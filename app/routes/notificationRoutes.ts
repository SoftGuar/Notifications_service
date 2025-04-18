import {notificationsHandler} from '../handlers/notificationsHandler';
import { FastifyInstance } from 'fastify';
import { NotificationPayload } from '../services/types/payload';

export function registerNotificationRoutes(fastify: FastifyInstance){
    fastify.post('/notify', notificationsHandler.createNotification);
    fastify.get('/notifications/:userId', notificationsHandler.getNotifications);
    fastify.get('/notifications/:userId/:type', notificationsHandler.getNotificationsByTypeAndUserId);
    fastify.get('/notifications/:userId/:notificationId', notificationsHandler.getNotificationById);
    fastify.put('/notifications/:notificationId', notificationsHandler.updateNotification);
    fastify.put('/notifications/:notificationId/read', notificationsHandler.markNotificationAsRead);
    fastify.put('/notifications/:notificationId/unread', notificationsHandler.markNotificationAsUnread);
    fastify.delete('/notifications/:notificationId', notificationsHandler.deleteNotification);
}