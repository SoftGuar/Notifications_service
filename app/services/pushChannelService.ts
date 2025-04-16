import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { NotificationPayload } from "./types/payload";

const fastify = require('fastify')({ logger: true });
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Register fastify plugins
fastify.register(require('fastify-cors'));

// In-memory store for device tokens (in production, use a database)
const deviceTokens = new Map();

// Register a device token
export const registerToken = async (
        userId: number,
        token: string,
        deviceInfo?: object) => {
    try {

        if (!userId || !token) {
            throw new Error('Missing required parameters: userId and token');
        }

        // Store token with timestamp and device info
        deviceTokens.set(userId, {
            token,
            deviceInfo: deviceInfo || {},
            lastUpdated: new Date().toISOString()
        });

        return { success: true, message: 'Token registered successfully' };
    } catch (error: any) {
       throw new Error(`Error registering token: ${error.message}`);
    }
};

// Send notification to a specific user
export const sendToUser= async (notification:NotificationPayload) => {
    try {
        const userId = notification.recipient[0]?.userId;
        if (!userId) {
            throw new Error('Missing recipient userId');
                }

        const userDevice = deviceTokens.get(userId);
        if (!userDevice) {
            throw new Error('User token not found');
        }

        const pushNotification = notification.message.pushNotification;
        if (!pushNotification?.title || !pushNotification?.body) {
            throw new Error('Missing required push notification details');
        }

        const message = {
            notification: {
                title: pushNotification.title,
                body: pushNotification.body,
                icon: pushNotification.icon
            },
            data: {
                subject: notification.message.subject,
                body: notification.message.body,
                actionType: pushNotification.action?.type || '',
                actionUrl: pushNotification.action?.url || ''
            },
            token: userDevice.token
        };

        const response = await admin.messaging().send(message);
        return { success: true, messageId: response };
    } catch (error: any) {
        throw new Error(`Error sending notification: ${error.message}`);
    }
}
// Send notification to multiple users
export const sendToUsers= async (notification:NotificationPayload) => {
    try {
        const userIds = notification.recipient.map((user) => user.userId);

        if (!userIds || !Array.isArray(userIds)) {
            throw new Error('Missing or invalid recipient userIds');
        }

        const tokens = userIds
            .map(id => deviceTokens.get(id)?.token)
            .filter(Boolean);

        if (tokens.length === 0) {
            throw new Error('No valid tokens found for recipients');
        }

        const pushNotification = notification.message.pushNotification;
        if (!pushNotification?.title || !pushNotification?.body) {
            throw new Error('Missing required push notification details');
        }

        const message = {
            notification: {
                title: pushNotification.title,
                body: pushNotification.body,
                icon: pushNotification.icon
            },
            data: {
                subject: notification.message.subject,
                body: notification.message.body,
                actionType: pushNotification.action?.type || '',
                actionUrl: pushNotification.action?.url || ''
            },
            tokens
        };

        const response = await admin.messaging().sendMulticast(message);

        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
            responses: response.responses
        };
    } catch (error: any) {
        throw new Error(`Error sending notification: ${error.message}`);
    }
}

// Schedule a notification for future delivery
export const scheduleNotification= async (notification:NotificationPayload) => {
    try {
        const { recipient, message, schedule } = notification;

        if (!recipient || recipient.length === 0 || !message || !schedule?.sendAt) {
            throw new Error('Missing required parameters: recipient, message, or schedule.sendAt');
        }

        const userId = recipient[0].userId;
        const { pushNotification } = message;

        if (!userId || !pushNotification?.title || !pushNotification?.body) {
            throw new Error('Missing required push notification details or userId');
        }

        const userDevice = deviceTokens.get(userId);
        if (!userDevice) {
            throw new Error('User token not found');
        }

        const scheduledDate = new Date(schedule.sendAt);
        const now = new Date();

        if (scheduledDate <= now) {
            throw new Error('Scheduled time must be in the future');
        }

        // Calculate delay in milliseconds
        const delay = scheduledDate.getTime() - now.getTime();

        // Schedule the notification
        setTimeout(async () => {
            try {
                const messagePayload = {
                    notification: {
                        title: pushNotification.title,
                        body: pushNotification.body,
                        icon: pushNotification.icon
                    },
                    data: {
                        ...message,
                        actionType: pushNotification.action?.type || '',
                        actionUrl: pushNotification.action?.url || ''
                    },
                    token: userDevice.token
                };

                await admin.messaging().send(messagePayload);
                fastify.log.info(`Scheduled notification sent to userId: ${userId}`);
            } catch (err: any) {
                fastify.log.error(`Failed to send scheduled notification: ${err.message}`);
            }
        }, delay);

        return {
            success: true,
            message: 'Notification scheduled',
            scheduledFor: scheduledDate.toISOString()
        };
    } catch (error: any) {
        throw new Error(`Error scheduling notification: ${error.message}`);
    }
}

export const sendNotification = async (notification: NotificationPayload) => {
    try {
        if (notification.broadcast){
            return await sendToUsers(notification);
        }
        else if (notification.recipient.length === 1) {
            return await sendToUser(notification);
        }
        else if (notification.recipient.length > 1) {
            return await sendToUsers(notification);
        }
        else {
            throw new Error('Invalid recipient data');
        }
    } catch (error: any) {
        throw new Error(`Error sending notification: ${error.message}`);
    }
}

// // Send notifications to topics
// fastify.post('/send-to-topic', async (request: FastifyRequest<{
//     Body: {
//         topic: string;
//         title: string;
//         body: string;
//         data?: object;
//     };
// }>, reply: FastifyReply) => {
//     try {
//         const { topic, title, body, data } = request.body;

//         if (!topic || !title || !body) {
//             return reply.code(400).send({ error: 'Missing required parameters' });
//         }

//         const message = {
//             notification: {
//                 title,
//                 body
//             },
//             data: data || {},
//             topic
//         };

//         const response = await admin.messaging().send(message);
//         return { success: true, messageId: response };
//     } catch (error: any) {
//         request.log.error(error);
//         return reply.code(500).send({ error: error.message });
//     }
// });

// // Subscribe user to a topic
// fastify.post('/subscribe-to-topic', async (request: FastifyRequest<{
//     Body: {
//         userId: string;
//         topic: string;
//     };
// }>, reply: FastifyReply) => {
//     try {
//         const { userId, topic } = request.body;

//         if (!userId || !topic) {
//             return reply.code(400).send({ error: 'Missing userId or topic' });
//         }

//         const userDevice = deviceTokens.get(userId);
//         if (!userDevice) {
//             return reply.code(404).send({ error: 'User token not found' });
//         }

//         const response = await admin.messaging().subscribeToTopic(userDevice.token, topic);

//         return {
//             success: true,
//             successCount: response.successCount,
//             failureCount: response.failureCount
//         };
//     } catch (error: any) {
//         request.log.error(error);
//         return reply.code(500).send({ error: error.message });
//     }
// });

// // Unsubscribe user from a topic
// fastify.post('/unsubscribe-from-topic', async (request: FastifyRequest<{
//     Body: {
//         userId: string;
//         topic: string;
//     };
// }>, reply: FastifyReply) => {
//     try {
//         const { userId, topic } = request.body;

//         if (!userId || !topic) {
//             return reply.code(400).send({ error: 'Missing userId or topic' });
//         }

//         const userDevice = deviceTokens.get(userId);
//         if (!userDevice) {
//             return reply.code(404).send({ error: 'User token not found' });
//         }

//         const response = await admin.messaging().unsubscribeFromTopic(userDevice.token, topic);

//         return {
//             success: true,
//             successCount: response.successCount,
//             failureCount: response.failureCount
//         };
//     } catch (error: any) {
//         request.log.error(error);
//         return reply.code(500).send({ error: error.message });
//     }
// });