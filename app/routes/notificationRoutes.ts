import {notificationsHandler} from '../handlers/notificationsHandler';
import { FastifyInstance } from 'fastify';
import { NotificationPayload } from '../services/types/payload';

export function registerNotificationRoutes(fastify: FastifyInstance){
    fastify.post('/notify', notificationsHandler.createNotification);
    
}