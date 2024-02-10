import { createClient } from 'redis';

// Create the Redis client with configuration options
const redclient = createClient({
    password: process.env.REDIS_PW,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!, 10) // Ensure proper radix
    }
});

// Error event listener for logging and potentially handling Redis client errors
redclient.on('error', (err) => console.log('Redis Client Error', err));

// Function to ensure the client is connected before use
async function ensureConnected() {
    if (!redclient.isOpen) {
        try {
            await redclient.connect();
        } catch (err) {
            console.error('Failed to connect to Redis:', err);
            // Handle connection error (e.g., retry logic, graceful degradation, etc.)
        }
    }
}

export { redclient, ensureConnected };
