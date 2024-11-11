// import Docker from "dockerode";
// import { TestCases } from "../types/testCases";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

// async function runCpp(code:string, inputTestCase: string) {

//     const rawLogBuffer: Buffer[] = [];

//     console.log("starting.... cpp docker container");

//     const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
//     console.log(runCommand);
    
//     const cppDockerContainer = await createContainer(CPP_IMAGE, [
//         '/bin/sh', 
//         '-c',
//         runCommand
//     ]); 

//     await cppDockerContainer.start();

//     console.log("Started cpp docker container");

//     const loggerStream = await cppDockerContainer.logs({
//         stdout: true,
//         stderr: true,
//         timestamps: false,
//         follow: true // whether the logs are streamed or returned as a string
//     });

//     // 
//     loggerStream.on('data', (chunk)=>{
//         rawLogBuffer.push(chunk);   // wenver the log something during execution this listener will trigger
//     })

    

//     const response = await new Promise((res, _)=>{

//         loggerStream.on('end', (_chunk)=>{
//             console.log(rawLogBuffer);
//             const logString = Buffer.concat(rawLogBuffer).toString('utf-8');
//             console.log(logString);
    
//             const completeBuffer = Buffer.concat(rawLogBuffer);
//             const decodedStream = decodeDockerStream(completeBuffer);
//             console.log(decodedStream);
//             res(decodedStream);
    
//         })
//     })

//     await cppDockerContainer.remove();   

//     return response ;

// }

// export default runCpp;


class CppExecutor implements CodeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputCase: string): Promise<ExecutionResponse> {
        console.log("C++ executor called");
        console.log(code, inputTestCase, outputCase);

        const rawLogBuffer: Buffer[] = [];

        console.log("Initializing a new C++ Docker container");
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
        console.log(runCommand);

        const cppDockerContainer = await createContainer(CPP_IMAGE, [
            '/bin/sh', 
            '-c', 
            runCommand
        ]);

        // Start the Docker container
        await cppDockerContainer.start();
        console.log("Started C++ Docker container");

        const loggerStream = await cppDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true
        });

        // Attach events to read the stream data
        loggerStream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
        });

        try {
            const codeResponse: string = await this.fetchDecodedStream(loggerStream, rawLogBuffer);

            if (codeResponse.trim() === outputCase.trim()) {
                return { output: codeResponse, status: "SUCCESS" };
            } else {
                return { output: codeResponse, status: "WA" };
            }
        } catch (error) {
            console.log("Error occurred", error);

            if (error === "TLE") {
                await cppDockerContainer.kill();
            }
            return { output: error as string, status: "ERROR" };
            
        } finally {
            
            await cppDockerContainer.remove();
        }
    }

    private fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string> {
        return new Promise((res, rej) => {
            const timeout = setTimeout(() => {
                console.log("Timeout occurred");
                rej("TLE");
            }, 2000);

            loggerStream.on('end', () => {
                clearTimeout(timeout);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);

                if (decodedStream.stderr) {
                    rej(decodedStream.stderr);
                } else {
                    res(decodedStream.stdout);
                }
            });
        });
    }
}

export default CppExecutor;
