import { notificationsModel } from "../models/notificationsModel";
import { createNotificationInput, updateNotificationInput } from "./types/Notifications.types";
import { NotificationPayload } from "./types/payload";

export const notificationsService = {
    async getNotifications(userId: number) {
        try {
        const notifications = await notificationsModel.getNotifications(userId);
        return notifications;
        } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications');
        }
    },
    async getNotificationById(notificationId: number) {
        try {
            const notification = await notificationsModel.getNotificationById(notificationId);
            return notification;
        } catch (error) {
            console.error('Error fetching notification:', error);
            throw new Error('Failed to fetch notification');
        }
    },
    async createNotification(notificationData: NotificationPayload) {
        try {
            for (const recipient of notificationData.recipient) {

                const createNotificationInput :createNotificationInput = {
                    user_id: recipient?.userId,
                    title: notificationData.message.pushNotification?.title || "New Notification",
                    message: notificationData.message.pushNotification?.body || notificationData.message.body,
                    read: false,
                    type: notificationData.notificationType, 
                    metadata: notificationData.metadata,
                    sentAt: new Date(),
                };
                await notificationsModel.createNotification(createNotificationInput);
            }
        return {
            success: true,
            message: 'Notifications created successfully'
        };
        } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification');
        }
    },
    
    async updateNotification(notificationId: number, updateData: updateNotificationInput) {
        try {
        const notification = await notificationsModel.updateNotification(notificationId, updateData);
        return notification;
        } catch (error) {
        console.error('Error updating notification:', error);
        throw new Error('Failed to update notification');
        }
    },
    
    async deleteNotification(notificationId: number) {
        try {
        const notification = await notificationsModel.deleteNotification(notificationId);
        return notification;
        } catch (error) {
        console.error('Error deleting notification:', error);
        throw new Error('Failed to delete notification');
        }
    },
    
    async markNotificationAsRead(notificationId: number) {
        try {
        const notification = await notificationsModel.markNotificationAsRead(notificationId);
        return notification;
        } catch (error) {
        console.error('Error marking notification as read:', error);
        throw new Error('Failed to mark notification as read');
        }
    },
    async markNotificationAsUnread(notificationId: number) {
        try {
            const notification = await notificationsModel.markNotificationAsUnread(notificationId);
            return notification;
        } catch (error) {
            console.error('Error marking notification as unread:', error);
            throw new Error('Failed to mark notification as unread');
        }
    },
    async getNotificationsByTypeAndUserId(userId: number, type: string) {
        try {
            const notifications = await notificationsModel.getNotificationsByTypeAndUserId(userId, type);
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications by type and user ID:', error);
            throw new Error('Failed to fetch notifications by type and user ID');
        }
    }
};