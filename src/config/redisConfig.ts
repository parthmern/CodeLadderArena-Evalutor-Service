import Redis from "ioredis";

import ServerConfig from './serverConfig';

console.log(ServerConfig.REDIS_PORT,ServerConfig.REDIS_HOST, ServerConfig.REDIS_PASSWORD);

const redisConfig = {
    port:ServerConfig.REDIS_PORT,
    host: ServerConfig.REDIS_HOST,
    password : ServerConfig.REDIS_PASSWORD,
    maxRetriesPerRequest: null 
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