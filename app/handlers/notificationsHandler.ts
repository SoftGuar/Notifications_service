import {notificationsService} from '../services/notificationsService';
import { FastifyInstance } from 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import {NotificationPayload} from '../services/types/payload';
import { inAppChannelService } from '../services/inAppChannelService';
import { sendNotification } from 'app/services/pushChannelService';
import { emailNotificationsService } from '../services/emailNotificationsService';

export const notificationsHandler = {
    async getNotifications(req: FastifyRequest<{ Params: { userId: number } }>, res: FastifyReply) {
        try {
            const userId = req.params.userId; // Assuming userId is passed as a URL parameter
            const notifications = await notificationsService.getNotifications(userId);
            res.send(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).send({ error: 'Failed to fetch notifications' });
        }
    },

    async createNotification(req: FastifyRequest<{ Body: NotificationPayload }>, res: FastifyReply) {
        try {
            const notificationData = req.body; // Assuming notification data is sent in the request body
            const notification = await notificationsService.createNotification(notificationData);
            for (const channel of notificationData.channels) {
                switch (channel) {
                    case 'email':
                        await emailNotificationsService.sendEmail(notificationData);
                        break;
                    case 'push':
                        console.log('Sending push notification:', notificationData);
                        await sendNotification(notificationData);
                        break;
                    case 'in-app':
                        console.log('Sending in-app notification:', notificationData);
                        await inAppChannelService.sendNotification(notificationData);
                        break;
                }
            }
            res.status(201).send(notification);
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).send({ error: 'Failed to create notification' });
        }
    },
    
    async updateNotification(req: FastifyRequest<{ Params: { notificationId: number } }>, res: FastifyReply) {
        try {
            const notificationId = req.params.notificationId;
            const updateData = req.body;
            const notification = await notificationsService.updateNotification(notificationId, updateData);
            res.send(notification);
        } catch (error) {
            console.error('Error updating notification:', error);
            res.status(500).send({ error: 'Failed to update notification' });
        }
    },

}