import { Job, Worker } from "bullmq";

import redisConnection from "../config/redisConfig";
import SubmissionJob from "../jobs/SubmissionJob";

export default function SubmissionWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            try {
                console.log("SubmissionJob job worker kicking", job?.id);
                if (job.name === "SubmissionJob") {
                    const submissionJobInstance = new SubmissionJob(job.data);
                    console.log("Calling job handler");
                    submissionJobInstance.handle(job);

                    return true;
                }
            }catch(error){
                console.log("submission worker error", error);
                return false;
            }
        },
        {
            connection: redisConnection
        }
    );
}