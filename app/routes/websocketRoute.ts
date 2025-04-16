import { FastifyInstance, FastifyRequest } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { WebSocket } from "ws";
import {websocketRouteHandler} from "../handlers/websocketRouteHandler";



export default async function websocketRoute(fastify: FastifyInstance) {
    await fastify.register(fastifyWebsocket);
    fastify.get("/ws/:user_id", { websocket: true }, (connection, req:FastifyRequest<{
        Params: { user_id: string }
    }>) => {
        websocketRouteHandler(req, connection);
    });
}
    