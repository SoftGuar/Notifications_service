import {notificationsHandler} from '../handlers/notificationsHandler';
import { FastifyInstance } from 'fastify';
import { NotificationPayload } from '../services/types/payload';

export function registerNotificationRoutes(fastify: FastifyInstance){
    fastify.post('/notifications', { schema: notificationCreationSchema }, notificationsHandler.createNotification);
    
}

const notificationCreationSchema={
    body: {
        type: "NotificationPayload",
        properties: {
            channels: {
                type: 'array',
                items: { type: 'string' },
            },
            message: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    body: { type: 'string' },
                },
            },
            recipient: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                },
            },
        },
        required: ['channels', 'message', 'recipient'],
    },
    response: {
        201: { type: 'object', properties: { success: { type: 'boolean' } } },
    },
}