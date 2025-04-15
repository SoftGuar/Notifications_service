import prisma from '../services/prismaService';
import { createNotificationInput } from 'app/services/types/Notifications.types';

export const notificationsModel = {
  async getNotifications(userId: string) {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId: userId,
        },
      });
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }
    ,
    async createNotification(notificationData: createNotificationInput) {
        try {
            const notification = await prisma.notification.create({
            data: notificationData,
            });
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Failed to create notification');
        }
        }
    ,
    async updateNotification(notificationId: string, updateData: any) {
        try {
            const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: updateData,
            });
            return notification;
        } catch (error) {
            console.error('Error updating notification:', error);
            throw new Error('Failed to update notification');
        }
    }
    ,
    async deleteNotification(notificationId: string) {
        try {
            const notification = await prisma.notification.delete({
            where: { id: notificationId },
            });
            return notification;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw new Error('Failed to delete notification');
        }
    }
    ,
    async markNotificationAsRead(notificationId: string) {
        try {
            const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
            });
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Failed to mark notification as read');
        }
    }
    ,
    async markNotificationAsUnread(notificationId: string) {
        try {
            const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: { read: false },
            });
            return notification;
        } catch (error) {
            console.error('Error marking notification as unread:', error);
            throw new Error('Failed to mark notification as unread');
        }
    }
    ,
    async getNotificationById(notificationId: string) {
        try {
            const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
            });
            return notification;
        } catch (error) {
            console.error('Error fetching notification by ID:', error);
            throw new Error('Failed to fetch notification by ID');
        }
    }
    ,
    async getNotificationsByType(userId: string, type: string) {
        try {
            const notifications = await prisma.notification.findMany({
            where: {
                userId: userId,
                type: type,
            },
            });
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications by type:', error);
            throw new Error('Failed to fetch notifications by type');
        }
    }
    ,
    async getNotificationsByStatus(userId: string, status: string) {
        try {
            const notifications = await prisma.notification.findMany({
            where: {
                userId: userId,
                status: status,
            },
            });
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications by status:', error);
            throw new Error('Failed to fetch notifications by status');
        }
    },
    
};