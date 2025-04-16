
import { activeConnections } from "../handlers/websocketRouteHandler";
import { WebSocketService } from "./WebsocketService";
import { NotificationPayload } from "./types/payload";

export const inAppChannelService={
    async sendNotification(notificationData:NotificationPayload ) {
        try {
            WebSocketService.sendNotification(
                notificationData,
                activeConnections
               );
        } catch (error) {
            console.error("Error sending in-app notification:", error);
            throw new Error("Failed to send in-app notification");
        }
    },
}