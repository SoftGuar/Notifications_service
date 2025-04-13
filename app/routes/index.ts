import { FastifyInstance } from 'fastify';
import websocketRoute from './websocketRoute';
export default async function registerRoutes(fastify: FastifyInstance) {
    fastify.register(websocketRoute, { prefix: '/websocket' });
}
