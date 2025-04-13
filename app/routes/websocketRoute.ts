import { FastifyInstance } from "fastify";
import fastifyWebsocket from "@fastify/websocket";

export default async function websocketRoute(fastify: FastifyInstance) {
    fastify.register(fastifyWebsocket);
    fastify.get("/ws", { websocket: true }, (connection, req) => {
        console.log("Client connected");

        connection.socket.on("message", (message: String) => {
            console.log("Received:", message.toString());

            // Echo back
            connection.socket.send(
                JSON.stringify({ type: "reply", content: "Hello from server!" })
            );
        });

        connection.socket.on("close", () => {
            console.log("Client disconnected");
        });
    });
}