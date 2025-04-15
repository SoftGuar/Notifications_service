import { FastifyInstance } from "fastify";
import { NotificationPayload } from "app/services/types/payload";
import fastifyWebsocket from "@fastify/websocket";
import { WebSocket } from "ws";

interface ActiveConnection {
  socket: WebSocket;
  user_id?: number;
  topics: string[];
}

const activeConnections = new Map<string, ActiveConnection>();

export default async function websocketRoute(fastify: FastifyInstance) {
    await fastify.register(fastifyWebsocket);
    
    fastify.get("/ws", { websocket: true }, (connection, req) => {
        const connectionId = Math.random().toString(36).substring(2, 15);
        console.log(`Client connected: ${connectionId}`);

        // In @fastify/websocket, the connection object itself is the socket
        const connectionData: ActiveConnection = {
            socket: connection, // The connection is the socket
            user_id: undefined,
            topics: []
        };
        activeConnections.set(connectionId, connectionData);

        connection.on("message", (message) => {
            try {
                const parsed = JSON.parse(message.toString());
                console.log("Received:", parsed);

                if (parsed.type === "subscribe") {
                    // Update connection data
                    connectionData.user_id = parsed.user_id;
                    connectionData.topics = parsed.topics || [];
                    
                    connection.send(JSON.stringify({ 
                        type: "subscribed", 
                        topics: connectionData.topics,
                        user_id: connectionData.user_id
                    }));
                }
            } catch (err) {
                console.error("Error processing message:", err);
            }
        });

        connection.on("close", () => {
            console.log(`Client disconnected: ${connectionId}`);
            activeConnections.delete(connectionId);
        });

        // Send welcome message
        connection.send(JSON.stringify({
            type: "welcome",
            message: "Connected to notification service",
            timestamp: new Date().toISOString()
        }));
    });
}

export function sendNotification(notification: NotificationPayload) {
    const notificationMessage = JSON.stringify({
        type: "notification",
        data: {
            ...notification,
            timestamp: new Date().toISOString()
        }
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