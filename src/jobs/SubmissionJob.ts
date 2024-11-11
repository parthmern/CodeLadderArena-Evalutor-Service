import { Job } from "bullmq";

import evaluationQueueProducer from "../producers/evaluationQueueProducer";
// import runCpp from "../containers/runCpp";
import { IJob } from "../types/bullMqJobDefinition";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutorFactory";

export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, SubmissionPayload>;
    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    // handle = async (job?: Job) => {
    //     console.log("Handler of the job called");
    //     console.log(this.payload);
    //     if(job) {
    //         const key = Object.keys(this.payload)[0];
    //         const codeLanguage = this.payload[key].language;
    //         const code = this.payload[key].code;
    //         const inputTestCase = this.payload[key].inputCase;
    //         const outputTestCase = this.payload[key].outputCase;
    //         console.log(codeLanguage, inputTestCase, outputTestCase);
    //         const strategy = createExecutor(codeLanguage);
    //         console.log("strategy", strategy);
    //         if(strategy != null) {
    //             const response : ExecutionResponse = await strategy.execute(code, inputTestCase, outputTestCase);

    //             evaluationQueueProducer({response, userId: this.payload[key].userId, submissionId: this.payload[key].submissionId});
    //             if(response.status === "SUCCESS") {
    //                 console.log("Code executed successfully");
    //                 console.log(response);
    //             } else {
    //                 console.log("Something went wrong with code execution");
    //                 console.log(response);
    //             }
    //         }
    //     }
    // };

    handle = async (job?: Job) => {
        console.log("Handler of the job called");
        console.log(this.payload);
        if (job) {
            const key = Object.keys(this.payload)[0];
            const codeLanguage = this.payload[key].language;
            const code = this.payload[key].code;
            //@ts-ignore
            const testCases = this.payload[key].testCases; // Array of test cases
            const userId = this.payload[key].userId;
            const submissionId = this.payload[key].submissionId;
            
            const strategy = createExecutor(codeLanguage);
            console.log("strategy", strategy);
            
            if (strategy != null) {
                let allPassed = true;
                const results = [];
    
                // Execute each test case
                for (const testCase of testCases) {
                    const inputTestCase = testCase.input;
                    const outputTestCase = testCase.output;
    
                    console.log(codeLanguage, inputTestCase, outputTestCase);
                    
                    // Execute the code with the current test case
                    const response: ExecutionResponse = await strategy.execute(code, inputTestCase, outputTestCase);
                    
                    results.push(response); // Collect the response for each test case

                    console.log("end====>",results);
    
                    if (response.status !== "SUCCESS") {
                        allPassed = false;
                    }
    
                    console.log(response);
                }
    
                // Produce to the evaluation queue with results of all test cases
                evaluationQueueProducer({
                    results, 
                    userId, 
                    submissionId, 
                    overallStatus: allPassed ? "SUCCESS" : "FAILURE"
                });
    
                if (allPassed) {
                    console.log("All test cases passed successfully");
                } else {
                    console.log("Some test cases failed");
                }
            }
        }
    };
    

    failed = (job?: Job) : void => {
        console.log("Job failed");
        if(job) {
            console.log(job.id);
        }
    };
}