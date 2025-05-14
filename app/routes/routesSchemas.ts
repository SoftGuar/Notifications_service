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
                userType: { type: 'string' },
            },
            required: ['userId', 'userType'],
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
        schema: {
          summary: 'Create a notification',
          description: 'Create a notification to be sent through specified channels',
          tags: ['notifications'],
          body: {
            type: 'object',
            required: ['requestId', 'timestamp', 'notificationType', 'channels', 'broadcast', 'recipient', 'message'],
            properties: {
              requestId: { 
                type: 'number', 
                description: 'Unique identifier for the notification request' 
              },
              timestamp: { 
                type: 'string', 
                format: 'date-time',
                description: 'ISO timestamp when the notification was created' 
              },
              notificationType: { 
                type: 'string',
                description: 'Type of notification (e.g., transactional, marketing)' 
              },
              channels: { 
                type: 'array',
                description: 'Delivery channels for the notification',
                items: { 
                  type: 'string',
                  enum: ['email', 'push', 'in-app']
                }
              },
              broadcast: { 
                type: 'boolean',
                description: 'Whether the notification should be sent to all users' 
              },
              recipient: { 
                type: 'array',
                description: 'Recipients of the notification (empty if broadcast is true)',
                items: { 
                  type: 'object',
                  required: ['userId', 'userType', 'email'],
                  properties: {
                    userId: { 
                      type: 'integer',
                      description: 'User ID of the recipient' 
                    },
                    userType: { 
                      type: 'string',
                      description: 'Type of user (e.g., admin, customer)' 
                    },
                    email: { 
                      type: 'string',
                      format: 'email',
                      description: 'Email address of the recipient' 
                    }
                  }
                }
              },
              message: { 
                type: 'object',
                required: ['subject', 'body'],
                properties: {
                  subject: { 
                    type: 'string',
                    description: 'Subject line of the notification' 
                  },
                  body: { 
                    type: 'string',
                    description: 'Main content of the notification' 
                  },
                  attachments: { 
                    type: 'array',
                    description: 'Optional list of attachment URLs',
                    items: { 
                      type: 'string' 
                    }
                  },
                  pushNotification: { 
                    type: 'object',
                    description: 'Configuration for push notifications',
                    properties: {
                      title: { 
                        type: 'string',
                        description: 'Title for push notification' 
                      },
                      body: { 
                        type: 'string',
                        description: 'Body text for push notification' 
                      },
                      icon: { 
                        type: 'string',
                        description: 'URL to icon for the push notification' 
                      },
                      action: { 
                        type: 'object',
                        properties: {
                          type: { 
                            type: 'string',
                            description: 'Type of action' 
                          },
                          url: { 
                            type: 'string',
                            description: 'URL to open when notification is tapped' 
                          }
                        }
                      }
                    }
                  }
                }
              },
              schedule: { 
                type: 'object',
                description: 'Optional scheduling information',
                properties: {
                  sendAt: { 
                    type: 'string',
                    format: 'date-time',
                    description: 'When to send the notification' 
                  }
                }
              },
              metadata: { 
                type: 'object',
                description: 'Additional metadata for the notification',
                properties: {
                  priority: { 
                    type: 'string',
                    enum: ['low', 'normal', 'high'],
                    description: 'Priority level of the notification' 
                  },
                  retries: { 
                    type: 'integer',
                    description: 'Number of retry attempts' 
                  }
                }
              }
            }
          },
          response: {
            201: {
              type: 'object',
              properties: {
                requestId: { type: 'string' },
                timestamp: { type: 'string' },
                notificationType: { type: 'string' },
                channels: { 
                  type: 'array',
                  items: { type: 'string' }
                },
                broadcast: { type: 'boolean' },
                recipient: { 
                  type: 'array',
                  items: { 
                    type: 'object',
                    properties: {
                      userId: { type: 'integer' },
                      email: { type: 'string' }
                    }
                  }
                },
                message: { 
                  type: 'object',
                  properties: {
                    subject: { type: 'string' },
                    body: { type: 'string' },
                    pushNotification: { 
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        body: { type: 'string' }
                      }
                    }
                  }
                }
              }
            },
            500: {
              type: 'object',
              properties: {
                error: { type: 'string' }
              }
            }
          }
        }
      }
}