import {notificationsHandler} from '../handlers/notificationsHandler';
import { FastifyInstance } from 'fastify';
import { routesSchemas } from './routesSchemas';

export function registerNotificationRoutes(fastify: FastifyInstance){
    fastify.post('/notify', routesSchemas.createNotification, notificationsHandler.createNotification);
    fastify.get('/notifications/:userId', routesSchemas.getNotifications , notificationsHandler.getNotifications);
    fastify.get('/notifications/:userId/:type',  routesSchemas.getNotificationsByTypeAndUserId , notificationsHandler.getNotificationsByTypeAndUserId);
    fastify.get('/notification/:notificationId',  routesSchemas.getNotificationById , notificationsHandler.getNotificationById);
    fastify.put('/notifications/:notificationId',  routesSchemas.updateNotification , notificationsHandler.updateNotification);
    fastify.put('/notifications/:notificationId/read',  routesSchemas.markNotificationAsRead , notificationsHandler.markNotificationAsRead);
    fastify.put('/notifications/:notificationId/unread',  routesSchemas.markNotificationAsUnread , notificationsHandler.markNotificationAsUnread);
    fastify.delete('/notifications/:notificationId',  routesSchemas.deleteNotification , notificationsHandler.deleteNotification);
}