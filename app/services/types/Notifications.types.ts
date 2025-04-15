export interface createNotificationInput {
    userId: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    type?: string;
    metadata?: Record<string, any>;
    sentAt?: Date;
    readAt?: Date;
}