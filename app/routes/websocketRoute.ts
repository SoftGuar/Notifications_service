import { FastifyInstance } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { WebSocket } from "ws";
import { WebSocketService } from "../services/WebsocketService";

interface ActiveConnection {
  socket: WebSocket;
  user_id?: number;
  topics: string[];
}

export const activeConnections = new Map<string, ActiveConnection>();

export default async function websocketRoute(fastify: FastifyInstance) {
    await fastify.register(fastifyWebsocket);
    
    fastify.get("/ws", { websocket: true },
        () => WebSocketService.WebSocketConnect(fastify, activeConnections));
}
    