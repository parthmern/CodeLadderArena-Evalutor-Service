import Redis from "ioredis";

import ServerConfig from './serverConfig';

console.log(ServerConfig.REDIS_PORT,ServerConfig.REDIS_HOST, ServerConfig.REDIS_PASSWORD);

const redisConfig = {
    port: ServerConfig.REDIS_PORT,
    host: ServerConfig.REDIS_HOST,
    password: ServerConfig.REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Allow the custom retry strategy to manage retries
    retryStrategy: (times:any) => {
        if (times >= 10) {
            console.error('Redis connection attempts exceeded 10 retries.');
            return null; // Stop retrying
        }
        const delay = Math.min(times * 100, 2000); // Incremental delay, max 2 seconds
        console.log(`Retrying Redis connection in ${delay}ms... (Attempt ${times})`);
        return delay;
    },
};


const redisConnection = new Redis(redisConfig);

redisConnection.on('connect', () => {
    console.log('Redis client connected successfully!');
});

redisConnection.on('ready', () => {
    console.log('Redis client is ready to use!');
});

redisConnection.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

console.log(`Redis dashboard running on: http://localhost:8001`, redisConfig);

export default redisConnection;