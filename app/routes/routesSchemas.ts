export const routesSchemas = {
    getNotifications: {
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
    },
    getNotificationsByTypeAndUserId: {
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
    },
    getNotificationById: {
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
    },  
    updateNotification: {
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
    },
    markNotificationAsRead: {
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
    },
    markNotificationAsUnread: {
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
    },
    deleteNotification: {
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
    },
    createNotification: {
        summary: 'Create a notification',
        description: 'Create a notification',
        tags: ['notifications'],
        body: {
            type: 'object',
            properties: {
                notification: { type: 'object' },
            },
            required: ['notification'],
        },
    },
    
    
    
    
    
};

