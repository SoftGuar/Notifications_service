import {notificationsService} from '../services/notificationsService';
import { FastifyRequest, FastifyReply } from 'fastify';
import {NotificationPayload} from '../services/types/payload';
import { updateNotificationInput } from 'app/services/types/Notifications.types';
import { notifyService } from '../services/notifyService';

export const notificationsHandler = {
    async getNotifications(req: FastifyRequest<{ Params: { userId: number } }>, res: FastifyReply) {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a URL parameter
            const notifications = await notificationsService.getNotifications(userId);
            res.status(201).send(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).send({ error: 'Failed to fetch notifications' });
        }
    },

    async createNotification(req: FastifyRequest<{ Body: NotificationPayload }>, res: FastifyReply) {
        try {
            const rawData = JSON.parse(JSON.stringify(req.body));
    console.log('Raw notification data:', rawData);
    console.log(rawData.recipient)
            const notificationData: NotificationPayload = req.body; 
            console.log(notificationData);
            await notifyService.notify(notificationData)
            res.status(201).send(notificationData);
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).send({ error: 'Failed to create notification' });
        }
    },
    
    async updateNotification(req: FastifyRequest<{ 
        Params: { notificationId: number } ,
        Body: updateNotificationInput
    }>, res: FastifyReply) {
        try {
            const notificationId = req.params.notificationId;
            const updateData = req.body;
            const notification = await notificationsService.updateNotification(notificationId, updateData);
            res.status(201).send(notification);
        } catch (error) {
            console.error('Error updating notification:', error);
            res.status(500).send({ error: 'Failed to update notification' });
        }
    },
    async markNotificationAsRead(req: FastifyRequest<{ Params: { notificationId: number } }>, res: FastifyReply) {
        try {
            const notificationId = req.params.notificationId;
            const notification = await notificationsService.markNotificationAsRead(notificationId);
            res.status(201).send(notification);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    },
    async markNotificationAsUnread(req: FastifyRequest<{ Params: { notificationId: number } }>, res: FastifyReply) {
        try {
            const notificationId = req.params.notificationId;
            const notification = await notificationsService.markNotificationAsUnread(notificationId);
            res.status(201).send(notification);
        } catch (error) {
            console.error('Error marking notification as unread:', error);
        }
    },
    async getNotificationsByTypeAndUserId(req: FastifyRequest<{ Params: { userId: number, type: string } }>, res: FastifyReply) {
        try {
            const userId = req.params.userId;
            const type = req.params.type;
            const notifications = await notificationsService.getNotificationsByTypeAndUserId(userId, type);
            res.status(201).send(notifications);
        } catch (error) {
            console.error('Error fetching notifications by type and user ID:', error);
        }
    },
    async getNotificationById(req: FastifyRequest<{ Params: { notificationId: number } }>, res: FastifyReply) {
        try {
            const notificationId = req.params.notificationId;
            const notification = await notificationsService.getNotificationById(notificationId);
            res.status(201).send(notification);
        } catch (error) {
            console.error('Error fetching notification by ID:', error);
            res.status(500).send({ error: 'Failed to fetch notification by ID' });
        }
    },
    async deleteNotification(req: FastifyRequest<{ Params: { notificationId: number } }>, res: FastifyReply) {
        try {
            const notificationId = req.params.notificationId;
            const notification = await notificationsService.deleteNotification(notificationId);
            res.status(201).send(notification);
        } catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).send({ error: 'Failed to delete notification' });
        }
    }
}
