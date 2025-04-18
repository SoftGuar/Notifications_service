import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { NotificationPayload } from './types/payload';

dotenv.config();

export const emailNotificationsService = {
    async sendEmail(notification: NotificationPayload) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: notification.recipient.map(r => r.email).join(', '),
            subject: notification.message.pushNotification?.title,
            text: notification.message.pushNotification?.body
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Emails sent successfully to all recipients');
        } catch (error) {
            console.error('Error sending emails:', error);
            throw new Error('Failed to send emails');
        }
    }
};
