import { FastifyInstance } from "fastify";
import fastifyWebsocket from "@fastify/websocket";

// Store active connections
const activeConnections = new Map<string, WebSocket>();

export default async function websocketRoute(fastify: FastifyInstance) {
    fastify.register(fastifyWebsocket);
    
    fastify.get("/ws", { websocket: true }, (connection, req) => {
        // Generate a unique ID for this connection (could use user ID if authenticated)
        const connectionId = Math.random().toString(36).substring(2, 15);
        console.log(`Client connected: ${connectionId}`);

        // Store the connection
        activeConnections.set(connectionId, connection.socket);

        connection.socket.on("message", (message: string) => {
            try {
                const parsed = JSON.parse(message.toString());
                console.log("Received:", parsed);

                // Handle different message types
                if (parsed.type === "subscribe") {
                    // You could implement topic-based subscriptions here
                    connection.socket.send(
                        JSON.stringify({ 
                            type: "subscribed", 
                            topics: parsed.topics 
                        })
                    );
                }
            } catch (err) {
                console.error("Error processing message:", err);
            }
        });

        connection.socket.on("close", () => {
            console.log(`Client disconnected: ${connectionId}`);
            activeConnections.delete(connectionId);
        });
    });
}

// Function to send notifications to all or specific clients
export function sendNotification(notification: {
    type: string;
    title: string;
    message: string;
    userId?: string;
    topic?: string;
}) {
    const notificationMessage = JSON.stringify({
        type: "notification",
        data: notification
    });

    // Send to all connections (or filter by userId/topic in a real implementation)
    activeConnections.forEach((socket) => {
        if (socket.readyState === socket.OPEN) {
            socket.send(notificationMessage);
        } else {
            // Clean up closed connections
            activeConnections.forEach((value, key) => {
                if (value.readyState !== value.OPEN) {
                    activeConnections.delete(key);
                }
            });
        }
    });
}