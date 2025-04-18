import {notificationsHandler} from '../handlers/notificationsHandler';
import { FastifyInstance } from 'fastify';
import { routesSchemas } from './routesSchemas';

export function registerNotificationRoutes(fastify: FastifyInstance){
    fastify.post('/notify', { schema: routesSchemas.createNotification }, notificationsHandler.createNotification);
    fastify.get('/notifications/:userId', { schema: routesSchemas.getNotifications }, notificationsHandler.getNotifications);
    fastify.get('/notifications/:userId/:type', { schema: routesSchemas.getNotificationsByTypeAndUserId }, notificationsHandler.getNotificationsByTypeAndUserId);
    fastify.get('/notification/:userId/:notificationId', { schema: routesSchemas.getNotificationById }, notificationsHandler.getNotificationById);
    fastify.put('/notifications/:notificationId', { schema: routesSchemas.updateNotification }, notificationsHandler.updateNotification);
    fastify.put('/notifications/:notificationId/read', { schema: routesSchemas.markNotificationAsRead }, notificationsHandler.markNotificationAsRead);
    fastify.put('/notifications/:notificationId/unread', { schema: routesSchemas.markNotificationAsUnread }, notificationsHandler.markNotificationAsUnread);
    fastify.delete('/notifications/:notificationId', { schema: routesSchemas.deleteNotification }, notificationsHandler.deleteNotification);
}