export interface createNotificationInput {
    user_id: number;
    title: string;
    message: string;
    read: boolean;
    type?: string;
    metadata?: Record<string, any>;
    sentAt?: Date;
    readAt?: Date;
}
export interface updateNotificationInput {
    title?: string;
    message?: string;
    read?: boolean;
    type?: string;
    metadata?: Record<string, any>;
}
