import { NotificationPayload } from "./types/payload";

const fastify = require('fastify')({ logger: true });
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
import serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Register fastify plugins
fastify.register(require('fastify-cors'));

// --- Helper Functions ---
const storeTokenInFirestore = async (
    userId: number,
    userType: string,
    token: string,
    deviceInfo?: object
) => {
    try {
        await admin.firestore().collection('deviceTokens').doc(userId.toString()).set({
            token,
            userType,
            deviceInfo: deviceInfo || {},
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (error: any) {
        throw new Error(`Firestore error: ${error.message}`);
    }
};

const getTokenFromFirestore = async (
    userId: number,
    userType: string
) => {
    try {
        const doc = await admin.firestore().collection('deviceTokens')
            .doc(userId.toString())
            .get();

        if (!doc.exists) return null;
        
        const data = doc.data();
        // Optional: Verify userType matches if needed
        if (data?.userType !== userType) {
            fastify.log.warn(`UserType mismatch for userId ${userId}`);
        }
        return data;
    } catch (error: any) {
        throw new Error(`Firestore error: ${error.message}`);
    }
};

// --- Core Functions ---
export const registerToken = async (
    userId: number,
    userType: string,
    token: string,
    deviceInfo?: object
) => {
    if (!userId || !userType || !token) {
        throw new Error('Missing required fields: userId, userType, or token');
    }

    await storeTokenInFirestore(userId, userType, token, deviceInfo);
    return { success: true };
};

export const sendToUser = async (notification: NotificationPayload) => {
    const { userId, userType } = notification.recipient[0];
    
    if (!userId || !userType) {
        throw new Error('Missing userId or userType');
    }

    const device = await getTokenFromFirestore(userId, userType);
    if (!device?.token) throw new Error('Device token not found');
    
    const pushNotification = notification.message.pushNotification;
    if (!pushNotification?.title || !pushNotification?.body) {
        throw new Error('Missing required push notification details');
    }

    // Convert all data values to strings
    const stringifiedData: Record<string, string> = {};
    if (notification.message) {
        Object.entries(notification.message).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                stringifiedData[key] = typeof value === 'object' 
                    ? JSON.stringify(value) 
                    : String(value);
            }
        });
    }

    const message = {
        notification: {
            title: pushNotification.title,
            body: pushNotification.body,
        },
        data: {
            ...stringifiedData,
            actionType: pushNotification.action?.type || '',
            actionUrl: pushNotification.action?.url || ''
        },
        token: device.token
    };

    return await admin.messaging().send(message);
};

export const sendToUsers = async (notification: NotificationPayload) => {
    const tokens: string[] = [];

    // Batch fetch tokens
    for (const recipient of notification.recipient) {
        const device = await getTokenFromFirestore(recipient.userId, recipient.userType);
        if (device?.token) tokens.push(device.token);
    }

    if (tokens.length === 0) {
        throw new Error('No valid tokens found');
    }
    
    const pushNotification = notification.message.pushNotification;
    if (!pushNotification?.title || !pushNotification?.body) {
        throw new Error('Missing required push notification details');
    }

    // Convert all data values to strings
    const stringifiedData: Record<string, string> = {};
    if (notification.message) {
        Object.entries(notification.message).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                stringifiedData[key] = typeof value === 'object' 
                    ? JSON.stringify(value) 
                    : String(value);
            }
        });
    }

    const message = {
        notification: {
            title: pushNotification.title,
            body: pushNotification.body,
        },
        data: {
            ...stringifiedData,
            actionType: pushNotification.action?.type || '',
            actionUrl: pushNotification.action?.url || ''
        },
        tokens
    };

    return await admin.messaging().sendMulticast(message);
};

export const scheduleNotification = async (notification: NotificationPayload) => {
    const { sendAt } = notification.schedule!;
    const scheduledTime = new Date(sendAt).getTime();
    const now = Date.now();

    if (scheduledTime <= now) {
        throw new Error('Scheduled time must be in the future');
    }

    setTimeout(async () => {
        try {
            await sendNotification(notification);
            fastify.log.info(`Scheduled notification sent`);
        } catch (error) {
            fastify.log.error(`Failed scheduled notification: ${error}`);
        }
    }, scheduledTime - now);

    return { 
        success: true, 
        scheduledFor: new Date(sendAt).toISOString() 
    };
};

export const sendNotification = async (notification: NotificationPayload) => {
    if (!notification.recipient || notification.recipient.length === 0) {
        throw new Error('No recipients specified');
    }

    if (notification.broadcast) {
        // Implement broadcast logic if needed
        throw new Error('Broadcast not implemented');
    }

    return notification.recipient.length === 1 
        ? sendToUser(notification) 
        : sendToUsers(notification);
};