export interface NotificationPayload {
    requestId: string;
    timestamp: string;
    notificationType: "transactional" | "promotional";
    channels: Array<"email" | "push" | "in-app">;
    broadcast: boolean;
    recipient: Array<{
        userId: number;
        email: string;
    }>;
    message: {
        subject: string;
        body: string;
        attachments?: string[];
        smsText?: string;
        pushNotification?: {
            title: string;
            body: string;
            icon?: string;
            action?: {
                type: string;
                url: string;
            };
        };
    };
    schedule?: {
        sendAt: string;
    };
    metadata?: {
        priority: "low" | "normal" | "high";
        retries: number;
    };
}