import { NotificationPayload } from "../services/types/payload";
import { notificationsService } from "../services/notificationsService";
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { notificationsModel } from "../models/notificationsModel";
import { updateNotificationInput } from "../services/types/Notifications.types";
import { UserType } from "@prisma/client";

// Mock the notifications model to avoid actual database operations
jest.mock('../models/notificationsModel');

describe('Notifications Service Tests', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    // Create notification tests
    it('should create a basic email notification', async () => {
        const notification: NotificationPayload = {
            requestId: 123,
            timestamp: new Date().toISOString(),
            notificationType: "email",
            channels: ["email"],    
            broadcast: false,
            recipient: [{
                userId: 1, email: "test@test.com",
                userType: "USER"
            }],
            message: {
                subject: "Hello, world!",
                body: "Hello, world!",
                attachments: []
            },
            metadata: {
                priority: "normal",
                retries: 3
            }
        };
        
        const result = await notificationsService.createNotification(notification);
        expect(result.success).toBe(true);
        expect(result.message).toBe('Notifications created successfully');
    });

    it('should create a push notification with custom data', async () => {
        const notification: NotificationPayload = {
            requestId: 124,
            timestamp: new Date().toISOString(),
            notificationType: "push",
            channels: ["push"],
            broadcast: false,
            recipient: [{ userId: 2, email: "user2@test.com", userType: "USER" }],
            message: {
                subject: "Push Test",
                body: "Test push notification",
                pushNotification: {
                    title: "Custom Push Title",
                    body: "Custom push body",
                    icon: "test-icon.png",
                    action: {
                        type: "open_url",
                        url: "https://example.com"
                    }
                }
            },
            metadata: {
                priority: "high",
                retries: 1
            }
        };
        
        const result = await notificationsService.createNotification(notification);
        expect(result.success).toBe(true);
    });

    it('should create a multi-channel notification', async () => {
        const notification: NotificationPayload = {
            requestId: 125,
            timestamp: new Date().toISOString(),
            notificationType: "mixed",
            channels: ["email", "push", "in-app"],
            broadcast: false,
            recipient: [{ userId: 3, email: "user3@test.com", userType: "USER" }],
            message: {
                subject: "Multi-channel Test",
                body: "Test all channels",
                pushNotification: {
                    title: "Push Title",
                    body: "Push body"
                }
            },
            metadata: {
                priority: "normal",
                retries: 2
            }
        };
        
        const result = await notificationsService.createNotification(notification);
        expect(result.success).toBe(true);
    });

    it('should handle broadcast notifications', async () => {
        const notification: NotificationPayload = {
            requestId: 126,
            timestamp: new Date().toISOString(),
            notificationType: "broadcast",
            channels: ["email"],
            broadcast: true,
            recipient: [
                { userId: 1, email: "user1@test.com", userType: "USER" },
                { userId: 2, email: "user2@test.com", userType: "USER" },
                { userId: 3, email: "user3@test.com", userType: "USER" }
            ],
            message: {
                subject: "Broadcast Test",
                body: "Test broadcast message"
            },
            metadata: {
                priority: "high",
                retries: 1
            }
        };
        
        const result = await notificationsService.createNotification(notification);
        expect(result.success).toBe(true);
    });

    it('should handle scheduled notifications', async () => {
        const notification: NotificationPayload = {
            requestId: 127,
            timestamp: new Date().toISOString(),
            notificationType: "scheduled",
            channels: ["email"],
            broadcast: false,
            recipient: [{ userId: 4, email: "user4@test.com", userType: "USER" }],
            message: {
                subject: "Scheduled Test",
                body: "Test scheduled message"
            },
            schedule: {
                sendAt: new Date(Date.now() + 86400000).toISOString() // 24 hours from now
            },
            metadata: {
                priority: "normal",
                retries: 1
            }
        };
        
        const result = await notificationsService.createNotification(notification);
        expect(result.success).toBe(true);
    });

    it('should handle invalid notification data', async () => {
        const invalidNotification = {
            // Missing required fields
            requestId: "128",
            timestamp: new Date().toISOString()
        };
        
        await expect(notificationsService.createNotification(invalidNotification as any))
            .rejects.toThrow();
    });
    
    // Get notifications tests
    describe('Get notifications', () => {
        it('should get notifications by userID', async () => {
            const mockNotifications = [
                { 
                    id: 1, 
                    user_id: 3, 
                    user_type: UserType.USER,
                    title: 'Test 1', 
                    message: 'Message 1',
                    type: 'email',
                    metadata: {},
                    is_read: false,
                    created_at: new Date(),
                    sent_at: new Date(),
                    read_at: null
                },
                { 
                    id: 2, 
                    user_id: 3, 
                    user_type: UserType.USER,
                    title: 'Test 2', 
                    message: 'Message 2',
                    type: 'email',
                    metadata: {},
                    is_read: false,
                    created_at: new Date(),
                    sent_at: new Date(),
                    read_at: null
                }
            ];
            
            const mockGetNotifications = notificationsModel.getNotifications as jest.MockedFunction<typeof notificationsModel.getNotifications>;
            mockGetNotifications.mockResolvedValue(mockNotifications);
            
            const notifications = await notificationsService.getNotifications(3, UserType.USER);
            expect(notifications).toEqual(mockNotifications);
            expect(notificationsModel.getNotifications).toHaveBeenCalledWith(3, UserType.USER);
        });
        
        it('should get notification by id', async () => {
            const mockNotification = {
                id: 1, 
                user_id: 3, 
                user_type: UserType.USER,
                title: 'Test 1', 
                message: 'Message 1',
                type: 'email',
                metadata: {},
                is_read: false,
                created_at: new Date(),
                sent_at: new Date(),
                read_at: null,
            };
            
            const mockGetNotificationById = notificationsModel.getNotificationById as jest.MockedFunction<typeof notificationsModel.getNotificationById>;
            mockGetNotificationById.mockResolvedValue(mockNotification);
            
            const notification = await notificationsService.getNotificationById(1);
            expect(notification).toEqual(mockNotification);
            expect(notificationsModel.getNotificationById).toHaveBeenCalledWith(1);
        });
        
        it('should get notifications by type and user ID', async () => {
            const mockNotifications = [
                { 
                    id: 1, 
                    user_id: 3, 
                    user_type: UserType.USER,
                    title: 'Test 1', 
                    message: 'Message 1',
                    type: 'email',
                    metadata: {},
                    is_read: false,
                    created_at: new Date(),
                    sent_at: new Date(),
                    read_at: null
                }
            ];
            
            const mockGetNotificationsByTypeAndUserId = notificationsModel.getNotificationsByTypeAndUserId as jest.MockedFunction<typeof notificationsModel.getNotificationsByTypeAndUserId>;
            mockGetNotificationsByTypeAndUserId.mockResolvedValue(mockNotifications);
            
            const notifications = await notificationsService.getNotificationsByTypeAndUserId(3, 'email');
            expect(notifications).toEqual(mockNotifications);
            expect(notificationsModel.getNotificationsByTypeAndUserId).toHaveBeenCalledWith(3, 'email');
        });
    });
    
    // Update notification tests
    describe('Update notification', () => {
        it('should update a notification', async () => {
            const updateData: updateNotificationInput = {
                title: 'Updated Title',
                message: 'Updated Message',
                read: true
            };
            
            const mockUpdatedNotification = {
                id: 1,
                user_id: 3,
                user_type: UserType.USER,
                title: 'Updated Title',
                message: 'Updated Message',
                type: 'email',
                metadata: {},
                is_read: true,
                created_at: new Date(),
                sent_at: new Date(),
                read_at: new Date()
            };
            
            const mockUpdateNotification = notificationsModel.updateNotification as jest.MockedFunction<typeof notificationsModel.updateNotification>;
            mockUpdateNotification.mockResolvedValue(mockUpdatedNotification);
            
            const result = await notificationsService.updateNotification(1, updateData);
            expect(result).toEqual(mockUpdatedNotification);
            expect(notificationsModel.updateNotification).toHaveBeenCalledWith(1, updateData);
        });
    });
    
    // Delete notification tests
    describe('Delete notification', () => {
        it('should delete a notification', async () => {
            const mockDeletedNotification = {
                id: 1,
                user_id: 3,
                user_type: UserType.USER,
                title: 'Deleted Notification',
                message: 'This notification was deleted',
                type: 'email',
                metadata: {},
                is_read: false,
                created_at: new Date(),
                sent_at: new Date(),
                read_at: null
            };
            
            const mockDeleteNotification = notificationsModel.deleteNotification as jest.MockedFunction<typeof notificationsModel.deleteNotification>;
            mockDeleteNotification.mockResolvedValue(mockDeletedNotification);
            
            const result = await notificationsService.deleteNotification(1);
            expect(result).toEqual(mockDeletedNotification);
            expect(notificationsModel.deleteNotification).toHaveBeenCalledWith(1);
        });
    });
    
    // Mark notification as read/unread tests
    describe('Mark notification as read/unread', () => {
        it('should mark a notification as read', async () => {
            const mockReadNotification = {
                id: 1,
                user_id: 3,
                user_type: UserType.USER,
                title: 'Read Notification',
                message: 'This notification is read',
                type: 'email',
                metadata: {},
                is_read: true,
                created_at: new Date(),
                sent_at: new Date(),
                read_at: new Date()
            };
            
            const mockMarkAsRead = notificationsModel.markNotificationAsRead as jest.MockedFunction<typeof notificationsModel.markNotificationAsRead>;
            mockMarkAsRead.mockResolvedValue(mockReadNotification);
            
            const result = await notificationsService.markNotificationAsRead(1);
            expect(result).toEqual(mockReadNotification);
            expect(notificationsModel.markNotificationAsRead).toHaveBeenCalledWith(1);
        });
        
        it('should mark a notification as unread', async () => {
            const mockUnreadNotification = {
                id: 1,
                user_id: 3,
                user_type: UserType.USER,
                title: 'Unread Notification',
                message: 'This notification is unread',
                type: 'email',
                metadata: {},
                is_read: false,
                created_at: new Date(),
                sent_at: new Date(),
                read_at: null
            };
            
            const mockMarkAsUnread = notificationsModel.markNotificationAsUnread as jest.MockedFunction<typeof notificationsModel.markNotificationAsUnread>;
            mockMarkAsUnread.mockResolvedValue(mockUnreadNotification);
            
            const result = await notificationsService.markNotificationAsUnread(1);
            expect(result).toEqual(mockUnreadNotification);
            expect(notificationsModel.markNotificationAsUnread).toHaveBeenCalledWith(1);
        });
    });
    
    // Error handling tests
    describe('Error handling', () => {
        it('should handle errors when fetching notifications', async () => {
            const mockGetNotifications = notificationsModel.getNotifications as jest.MockedFunction<typeof notificationsModel.getNotifications>;
            mockGetNotifications.mockRejectedValue(new Error('Database error'));
            
            await expect(notificationsService.getNotifications(1, UserType.USER))
                .rejects.toThrow('Failed to fetch notifications');
        });
        
        it('should handle errors when creating notifications', async () => {
            const notification: NotificationPayload = {
                requestId: 123,
                timestamp: new Date().toISOString(),
                notificationType: "email",
                channels: ["email"],
                broadcast: false,
                recipient: [{ userId: 1, userType: UserType.USER, email: "test@test.com" }],
                message: {
                    subject: "Test Subject",
                    body: "Test Body"
                }
            };
            
            const mockCreateNotification = notificationsModel.createNotification as jest.MockedFunction<typeof notificationsModel.createNotification>;
            mockCreateNotification.mockRejectedValue(new Error('Creation failed'));
            
            await expect(notificationsService.createNotification(notification))
                .rejects.toThrow('Failed to create notification');
        });
        
        it('should handle errors when updating notifications', async () => {
            const updateData: updateNotificationInput = {
                title: 'Updated Title'
            };
            
            const mockUpdateNotification = notificationsModel.updateNotification as jest.MockedFunction<typeof notificationsModel.updateNotification>;
            mockUpdateNotification.mockRejectedValue(new Error('Update failed'));
            
            await expect(notificationsService.updateNotification(1, updateData))
                .rejects.toThrow('Failed to update notification');
        });
        
        it('should handle errors when deleting notifications', async () => {
            const mockDeleteNotification = notificationsModel.deleteNotification as jest.MockedFunction<typeof notificationsModel.deleteNotification>;
            mockDeleteNotification.mockRejectedValue(new Error('Deletion failed'));
            
            await expect(notificationsService.deleteNotification(1))
                .rejects.toThrow('Failed to delete notification');
        });
    });
});