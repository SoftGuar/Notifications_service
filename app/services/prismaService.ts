import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

/**
 * Establishes a connection to the database and logs the status.
 * If the connection fails, logs the error and terminates the process.
 *
 * @async
 * @function
 * @throws Will terminate the process with exit code 1 if the database connection fails.
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

// Graceful shutdown function
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

export default prisma;