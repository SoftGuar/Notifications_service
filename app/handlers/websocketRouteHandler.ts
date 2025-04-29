import { FastifyRequest } from "fastify"
import { WebSocket } from "ws";
interface ActiveConnection {
    socket: WebSocket;
    user_id?: number;
    user_type?: string;
    topics: string[];
  }
export const activeConnections = new Map<string, ActiveConnection>();

export const websocketRouteHandler=(
    req: FastifyRequest<{ Params: { user_id: number,user_type:string } }>,
    connection: WebSocket
)=>{
    const connectionId = Math.random().toString(36).substring(2, 15);
            const connectionData: ActiveConnection = {
                socket: connection,
                user_id: Number(req.params.user_id),
                user_type: req.params.user_type,
                topics: []
            };
            activeConnections.set(connectionId, connectionData);
            console.log(activeConnections)
            connection.on("message", (message) => {
                try {
                    const parsed = JSON.parse(message.toString());
                    console.log("Received:", parsed);
    
                    if (parsed.type === "subscribe") {
                        connectionData.user_id = req.params.user_id;
                        connectionData.user_type = req.params.user_type;
                        connectionData.topics = parsed.topics || [];
                        
                        connection.send(JSON.stringify({ 
                            type: "subscribed", 
                            topics: connectionData.topics,
                            user_id: connectionData.user_id,
                            user_type: connectionData.user_type
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
        }
