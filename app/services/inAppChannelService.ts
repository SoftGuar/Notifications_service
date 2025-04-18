
import { activeConnections } from "../handlers/websocketRouteHandler";
import { NotificationPayload } from "./types/payload";
import { WebSocket } from "ws";


export const inAppChannelService={
    async sendNotification(notificationData:NotificationPayload ) {
        try {
            sendNotification(
                notificationData,
                activeConnections
               );
        } catch (error) {
            console.error("Error sending in-app notification:", error);
            throw new Error("Failed to send in-app notification");
        }
    },
}


interface ActiveConnection {
    socket: WebSocket;
    user_id?: number;
    topics: string[];
}

const sendNotification= (notification: NotificationPayload, activeConnections: Map<string, ActiveConnection>) => {
        const notificationMessage = JSON.stringify({
            type: "notification",
            data: notification,
            timestamp: new Date().toISOString()
        });

        activeConnections.forEach((connection, connectionId) => {
            // Skip if connection is not open
            if (connection.socket.readyState !== WebSocket.OPEN) {
                activeConnections.delete(connectionId);
                return;
            }

            // Determine if this connection should receive the notification
            const shouldReceive = 
                // If it's a broadcast notification, send to everyone
                notification.broadcast ||
                // If no specific recipients or topics, send to everyone
                (!notification.recipient?.length && !notification.notificationType) ||
                // Check if any recipient matches the connection's user_id
                notification.recipient?.some(recipient => connection.user_id === recipient.userId) ||
                // Check if the notification type matches any of the connection's topics
                (notification.notificationType && connection.topics.includes(notification.notificationType));

            if (shouldReceive) {
                try {
                    console.log(`Sending notification to ${connectionId}:`, notificationMessage);
                    connection.socket.send(notificationMessage);
                } catch (err) {
                    console.error(`Failed to send notification to ${connectionId}:`, err);
                    activeConnections.delete(connectionId);
                }
            }
        });
    }