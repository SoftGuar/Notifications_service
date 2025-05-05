import { FastifyInstance } from 'fastify';
import websocketRoute from './websocketRoute';
import {registerNotificationRoutes} from './notificationRoutes';
import { pushRoutes } from './pushRoutes';
export default async function registerRoutes(fastify: FastifyInstance) {
    fastify.register(websocketRoute, { prefix: '/websocket' });
    fastify.register((fastify) => { registerNotificationRoutes(fastify); }, { prefix: '/' });
    fastify.register((fastify)=>{pushRoutes(fastify)}, { prefix: '/push' });
}
    