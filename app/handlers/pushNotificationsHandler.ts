import { FastifyRequest, FastifyReply } from 'fastify';
import { registerToken } from '../services/pushChannelService';
import { UserType } from '@prisma/client';

export const pushNotificationsHandler = {
    async registerToken(req: FastifyRequest<{ Body: { userId: number, userType: UserType, token: string, deviceInfo?: object } }>, res: FastifyReply) {
        try {
            const { userId, userType, token, deviceInfo } = req.body;
            const result = await registerToken(userId, userType, token, deviceInfo);
            res.status(201).send(result);
        } catch (error) {
            console.error('Error registering token:', error);
            res.status(500).send({ error: 'Failed to register token' });
        }
    },

};
