import { FastifyInstance, FastifyRequest } from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import {websocketRouteHandler} from "../handlers/websocketRouteHandler";
import { inAppChannelService } from "../services/inAppChannelService";
import { NotificationPayload } from "../services/types/payload";



export default async function websocketRoute(fastify: FastifyInstance) {
    await fastify.register(fastifyWebsocket);
    fastify.get("/ws/:user_id/:user_type", { websocket: true }, (connection, req:FastifyRequest<{
        Params: { user_id: number, user_type: string }
    }>) => {
        websocketRouteHandler(req, connection);
    });
    fastify.post("/ws/send-notification",(req:FastifyRequest<{
        Body: NotificationPayload
    }>) => {
        inAppChannelService.sendNotification(req.body);
    });
}
    