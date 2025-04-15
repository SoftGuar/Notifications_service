
import { sendNotification } from "../routes/websocketRoute";
import { NotificationPayload } from "./types/payload";
export const inAppChannelService={
    async sendNotification(notificationData:NotificationPayload ) {
        try {
            sendNotification(
                notificationData
               );
        } catch (error) {
            console.error("Error sending in-app notification:", error);
            throw new Error("Failed to send in-app notification");
        }
    },
}