import Redis from "ioredis";

import ServerConfig from './serverConfig';

const redisConfig = {
    port:ServerConfig.REDIS_PORT,
    host: ServerConfig.REDIS_HOST,
    maxRetriesPerRequest: null
};

const redisConnection = new Redis(redisConfig);

console.log(`Redis dashboard running on: http://localhost:8001`);

export default redisConnection;