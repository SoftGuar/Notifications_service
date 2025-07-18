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
const getCompositeId = (userId: number, userType: string) => `${userId}_${userType}`;

const storeTokenInFirestore = async (
    userId: number,
    userType: string,
    token: string,
    deviceInfo?: object
) => {
    try {
        const docId = getCompositeId(userId, userType);
        await admin.firestore().collection('deviceTokens').doc(docId).set({
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
        const docId = getCompositeId(userId, userType);
        const doc = await admin.firestore().collection('deviceTokens').doc(docId).get();

        if (!doc.exists) return null;

        return doc.data()?.token ?? null;
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
    if (!device) throw new Error('Device token not found');
    
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
        token: device
    };

    return await admin.messaging().send(message);
};

export const sendToUsers = async (notification: NotificationPayload) => {
    const tokens: string[] = [];

    // Batch fetch tokens
    for (const recipient of notification.recipient) {
        const device = await getTokenFromFirestore(recipient.userId, recipient.userType);
        if (device) tokens.push(device);
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
        token: "" // Token will be set per message
    };
    for (const token of tokens) {
        try {
            message.token = token; // Set the token for each message
            await admin.messaging().send(message);
        } catch (error) {
            fastify.log.error(`Failed to send notification to token ${token}: ${error}`);
        }
    }
    return { success: true, sentTo: tokens.length };
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