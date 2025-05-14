# Notifications Service

This project is a **Notifications Service** built with **Fastify**, **Prisma**, and **TypeScript**. It provides a robust system for managing and delivering notifications through multiple channels, including email, push notifications, and in-app notifications.

## Features

- **Multi-Channel Notifications**: Supports email, push, and in-app notifications.
- **Broadcast Notifications**: Send notifications to all users.
- **Scheduled Notifications**: Schedule notifications to be sent at a specific time.
- **WebSocket Support**: Real-time in-app notifications using WebSocket.
- **Push Notifications**: Integration with Firebase for push notifications.
- **Email Notifications**: Uses Nodemailer for sending emails.
- **CRUD Operations**: Create, read, update, and delete notifications.
- **Swagger Documentation**: Auto-generated API documentation.

1. Set up environment variables:

Create a .env file in the root directory and configure the following variables:
```
DATABASE_URL=your_database_url
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
FIREBASE_DATABASE_URL=your_firebase_database_url
```

2. Install dependencies:
```sh
npm install
```
3. generate prisma client 
```sh 
npx prisma generate --schema app/prisma/schema.prisma
```

4. Start the Development Server
Run the following command to start the server in development mode:
```sh
npm run dev
```

# Run Tests 
Execute the test suite using Jest:
```sh
npm run test
```

# API Documentation
Swagger documentation is available at 
https://BASE_URL/docs.

# Endpoints
Notifications
- POST /notify: Create a new notification.
- GET /notifications/:userId/:userType: Get notifications for a user.
- GET /notification/:notificationId: Get a notification by ID.
- PUT /notifications/:notificationId: Update a notification.
- PUT /notifications/:notificationId/read: Mark a notification as read.
- PUT /notifications/:notificationId/unread: Mark a notification as unread.
- DELETE /notifications/:notificationId: Delete a notification.
- POST /push/register-token: Register a device token for push notifications.
- GET /websocket/ws/:user_id/:user_type: Establish a WebSocket connection.
- POST /websocket/ws/send-notification: Send a real-time notification.