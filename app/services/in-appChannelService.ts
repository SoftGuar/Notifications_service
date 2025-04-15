
import { sendNotification } from "app/routes/websocketRoute";
import { NotificationPayload } from "./types/payload";
export const inAppChannelService={
    async sendNotification(notificationData:NotificationPayload ) {
        try {
            sendNotification(
                {
                    title: notificationData.message.pushNotification?.title || "New Notification",
                    message: notificationData.message.pushNotification?.body || notificationData.message.body,
                    userId: notificationData.recipient.userId,
                    type: "in-app",
                });
        } catch (error) {
            console.error("Error sending in-app notification:", error);
            throw new Error("Failed to send in-app notification");
        }
    },
}