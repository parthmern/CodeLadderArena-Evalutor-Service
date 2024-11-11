import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";

export default class SampleJob implements IJob {

    // IJob like
    // name: string ,
    // payload?: Record<string, unknown> ,
    // handle: (job?: Job) => void  ,
    // failed: (job?: Job) => void ,

    name: string;
    payload: Record<string, unknown>;

    constructor(payload: Record<string, unknown>) {
        this.payload = payload;
        this.name = this.constructor.name;  // name of object
    }

    handle = (job?: Job) => {
        console.log("Handler of the job called");
        console.log(this.payload);
        if(job) {
            console.log(`jobName: ${job.name} | jobId: ${job.id}, | jobData: ${JSON.stringify(job.data)}`)
        }
    };

    failed = (job?: Job) : void => {
        console.log("Job failed");
        if(job) {
            console.log(`jobName: ${job.name} | jobId: ${job.id}, | jobData: ${job.data}`)
        }
    };
}