import { PrismaClient } from '@prisma/client';

async function testDatabaseConnection() {
    console.log('Attempting to connect to the database...');

    // This environment variable MUST be loaded for Prisma to work
    if (!process.env.DATABASE_URL) {
        console.error('🔴 ERROR: DATABASE_URL environment variable is not set.');
        console.log('Please make sure your .env file is correct and in the /server folder.');
        return;
    }

    const prisma = new PrismaClient({
        // Log the queries Prisma is trying to run
        log: ['query', 'info', 'warn', 'error'],
    });

    try {
        // This is the simplest possible query to test the connection.
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Success! Database connection is working.');
    } catch (e) {
        console.error('🔴 FAILED to connect to the database. Error details:');
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabaseConnection();