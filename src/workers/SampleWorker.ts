import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SampleJob from "../jobs/SampleJob";

export default function SampleWorker(queueName: string) {

    new Worker(
        queueName, 

        async (job: Job) => {
            //console.log("Sample job worker kicking", job);
            console.log("job that Sample job worker kicking is=>", job?.name, "id=>", job?.id)
            if(job.name === "SampleJob") {
                const sampleJobInstance = new SampleJob(job.data);

                sampleJobInstance.handle(job);

                return true;
            }
        },

        {
            connection: redisConnection
        }
    );
}