import { notificationsModel } from "../models/notificationsModel";

const notificationsService = {
    async getNotifications(userId: string) {
        try {
        const notifications = await notificationsModel.getNotifications(userId);
        return notifications;
        } catch (error) {
        console.error('Error fetching notifications:', error);
        throw new Error('Failed to fetch notifications');
        }
    },
    
    async createNotification(notificationData: any) {
        try {
        const notification = await notificationsModel.createNotification(notificationData);
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