import { NotificationPayload } from "app/services/types/payload";
import { WebSocket } from "ws";
interface ActiveConnection {
    socket: WebSocket;
    user_id?: number;
    topics: string[];
  }

export const WebSocketService={

    sendNotification: (notification: NotificationPayload, activeConnections: Map<string, ActiveConnection>)=> {
        const notificationMessage = JSON.stringify({
            type: "notification",
            data: notification,
            timestamp: new Date().toISOString()
        });
    
        activeConnections.forEach((connection, connectionId) => {
            // Check if connection should receive this notification
            const shouldReceive = 
                // If no userId/topic specified, send to everyone
                (!notification.recipient.userId && !notification.notificationType) ||
                // Or if userId matches
                (notification.recipient.userId && connection.user_id === notification.recipient.userId) ||
                // Or if topic matches
                (notification.notificationType && connection.topics.includes(notification.notificationType));
                console.log(`Sending notification to ${connectionId}:`, notificationMessage);
                connection.socket.send(notificationMessage);
            if (shouldReceive && connection.socket.readyState === WebSocket.OPEN) {
                try {
                    console.log(`Sending notification to ${connectionId}:`, notificationMessage);
                    connection.socket.send(notificationMessage);
                } catch (err) {
                    console.error("Failed to send notification:", err);
                    activeConnections.delete(connectionId);
                }
            } else if (connection.socket.readyState !== WebSocket.OPEN) {
                // Clean up closed connections
                activeConnections.delete(connectionId);
            }
        });
    }
}