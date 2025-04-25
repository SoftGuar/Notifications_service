import { emailNotificationsService } from "./emailNotificationsService";
import { notificationsService } from "./notificationsService";
import { sendNotification } from "./pushChannelService";
import { NotificationPayload } from "./types/payload";

export const notifyService = {
    async notify(notification: NotificationPayload) {
        //databse storage
        await notificationsService.createNotification(notification);
        for (const channel of notification.channels) {
            switch (channel) {
                case 'email':
                    await emailNotificationsService.sendEmail(notification);
                    break;
                case 'push':
                    await sendNotification(notification);
                    break;
            }
        }
    }
}

