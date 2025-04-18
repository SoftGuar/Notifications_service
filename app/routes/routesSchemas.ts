export const routesSchemas = {
    getNotifications: {
        schema:{
        summary: 'Get notifications for a user',
        description: 'Get notifications for a user',
        tags: ['notifications'],
        params: {
            type: 'object',
            properties: {
                userId: { type: 'number' },
            },
            required: ['userId'],
        },
    }
    },
    getNotificationsByTypeAndUserId: {
        schema:{
        summary: 'Get notifications for a user by type and user ID',
        description: 'Get notifications for a user by type and user ID',
        tags: ['notifications'],
        params: {
            type: 'object',
            properties: {
                userId: { type: 'number' },
                type: { type: 'string' },
            },
            required: ['userId', 'type'],
        },
    }
    },
    getNotificationById: {
        schema:{
        summary: 'Get a notification by ID',
        description: 'Get a notification by ID',
        tags: ['notifications'],
        params: {
            type: 'object',
            properties: {
                notificationId: { type: 'number' },
            },
            required: ['notificationId'],
        },
    }
    },
    updateNotification: {
        schema:{
        summary: 'Update a notification',
        description: 'Update a notification',
        tags: ['notifications'],
        params: {
            type: 'object',
            properties: {
                notificationId: { type: 'number' },
            },
            required: ['notificationId'],
        },
    }
    },
    markNotificationAsRead: {
        schema:{
        summary: 'Mark a notification as read',
        description: 'Mark a notification as read',
        tags: ['notifications'],
        params: {
            type: 'object',
            properties: {
                notificationId: { type: 'number' },
            },
            required: ['notificationId'],
        },
    }
    },
    markNotificationAsUnread: {
        schema:{
        summary: 'Mark a notification as unread',
        description: 'Mark a notification as unread',
        tags: ['notifications'],
        params: {
            type: 'object',
            properties: {
                notificationId: { type: 'number' },
            },
            required: ['notificationId'],
        },
    }
    },
    deleteNotification: {
        schema:{
        summary: 'Delete a notification',
        description: 'Delete a notification',
        tags: ['notifications'],
        params: {
            type: 'object',
            properties: {
                notificationId: { type: 'number' },
            },
            required: ['notificationId'],
        },
    }
    },
    createNotification: {
        schema:{
        summary: 'Create a notification',
        description: 'Create a notification',
        tags: ['notifications'],
        body: {
            type: 'object',
            properties: {
                requestId: { type: "string" },
                timestamp: { type: "string" },
                notificationType: { type: "string", enum: ["transactional", "promotional"] },
                channels: { 
                    type: "array",
                    items: { type: "string", enum: ["email", "push", "in-app"] }
                },
                broadcast: { type: "boolean" },
                recipient: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            userId: { type: "number" },
                            email: { type: "string" }
                        }
                    }
                },
                message: {
                    type: "object",
                    properties: {
                        subject: { type: "string" },
                        body: { type: "string" },
                        attachments: { type: "array", items: { type: "string" } },
                        smsText: { type: "string" },
                        pushNotification: {
                            type: "object",
                            properties: {
                                subject: { type: "string" },
                                body: { type: "string" },
                                icon: { type: "string" },
                                action: {
                                    type: "object",
                                    properties: {
                                        type: { type: "string" },
                                        url: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    required: ['subject', 'body']
                },
                schedule: {
                    type: "object",
                    properties: {
                        sendAt: { type: "string" }
                    }
                },
                metadata: {
                    type: "object",
                    properties: {
                        priority: { type: "string", enum: ["low", "normal", "high"] },
                        retries: { type: "number" }
                    }
                }
            },
            required: ['notificationType', 'channels', 'recipient', 'message'],
        },
        }
    }
    }