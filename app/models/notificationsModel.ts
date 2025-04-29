import { UserType } from '@prisma/client';
import prisma from '../services/prismaService';
import { createNotificationInput, updateNotificationInput } from 'app/services/types/Notifications.types';

export const notificationsModel = {
  async getNotifications(userId: number, userType: UserType) {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
        user_id: userId,
        user_type: userType,
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
            data: {
                user_id: notificationData.user_id,
                user_type: notificationData.user_type,
                title: notificationData.title,
                message: notificationData.message,
                is_read: notificationData.read,
                type: notificationData.type || null,
                metadata: notificationData.metadata ?? undefined,
                sent_at: notificationData.sentAt || new Date(),
                read_at: notificationData.readAt || null,
            }
            });
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Failed to create notification');
        }
        }
    ,
    async updateNotification(notificationId: number, updateData: updateNotificationInput) {
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
    async deleteNotification(notificationId: number) {
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
    async markNotificationAsRead(notificationId: number) {
        try {
            const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: { is_read: true },
            });
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Failed to mark notification as read');
        }
    }
    ,
    async markNotificationAsUnread(notificationId: number) {
        try {
            const notification = await prisma.notification.update({
            where: { id: notificationId },
            data: { is_read: false },
            });
            return notification;
        } catch (error) {
            console.error('Error marking notification as unread:', error);
            throw new Error('Failed to mark notification as unread');
        }
    }
    ,
    async getNotificationById(notificationId: number) {
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
    async getNotificationsByTypeAndUserId(userId: number, type: string) {
        try {
            const notifications = await prisma.notification.findMany({
            where: {
                user_id: userId,
                type: type,
            },
            });
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications by type:', error);
            throw new Error('Failed to fetch notifications by type');
        }
    }
    
};