import { Queue } from "bullmq";

import redisConnection from "../config/redisConfig";

const sampleQueue = new Queue('SampleQueue', { connection: redisConnection});

export default sampleQueue;