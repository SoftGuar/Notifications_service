import { notificationsModel } from "../models/notificationsModel";
import { createNotificationInput } from "./types/Notifications.types";
import { NotificationPayload } from "./types/payload";

export const notificationsService = {
    async getNotifications(userId: string) {
        try {
        const notifications = await notificationsModel.getNotifications(userId);
        return notifications;
        } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications');
        }
    },
    
    async createNotification(notificationData: NotificationPayload) {
        try {
        //fill createNotificationInput with the data from notificationData
        const createNotificationInput :createNotificationInput = {
            userId: notificationData.recipient.userId,
            title: notificationData.message.pushNotification?.title || "New Notification",
            message: notificationData.message.pushNotification?.body || notificationData.message.body,
            read: false,
            type: notificationData.notificationType, 
            metadata: notificationData.metadata,
            sentAt: new Date(),
        };
        const notification = await notificationsModel.createNotification(createNotificationInput);
        return notification;
        } catch (error) {
        console.error('Error creating notification:', error);
        throw new Error('Failed to create notification');
        }
    },
    
    async updateNotification(notificationId: string, updateData: any) {
        try {
        const notification = await notificationsModel.updateNotification(notificationId, updateData);
        return notification;
        } catch (error) {
        console.error('Error updating notification:', error);
        throw new Error('Failed to update notification');
        }
    },
    
    async deleteNotification(notificationId: string) {
        try {
        const notification = await notificationsModel.deleteNotification(notificationId);
        return notification;
        } catch (error) {
        console.error('Error deleting notification:', error);
        throw new Error('Failed to delete notification');
        }
    },
    
    async markNotificationAsRead(notificationId: string) {
        try {
        const notification = await notificationsModel.markNotificationAsRead(notificationId);
        return notification;
        } catch (error) {
        console.error('Error marking notification as read:', error);
        throw new Error('Failed to mark notification as read');
        }
    },
    };