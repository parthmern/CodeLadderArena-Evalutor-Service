// import Docker from "dockerode";
// import { TestCases } from "../types/testCases";
import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

// async function runJava(code:string, inputTestCase: string) {

//     const rawLogBuffer: Buffer[] = [];

//     console.log("starting.... java docker container");

//     const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
//     console.log(runCommand);
    
//     const javaDockerContainer = await createContainer(JAVA_IMAGE, [
//         '/bin/sh', 
//         '-c',
//         runCommand
//     ]); 

//     await javaDockerContainer.start();

//     console.log("Started java docker container");

//     const loggerStream = await javaDockerContainer.logs({
//         stdout: true,
//         stderr: true,
//         timestamps: false,
//         follow: true // whether the logs are streamed or returned as a string
//     });

//     // 
//     loggerStream.on('data', (chunk)=>{
//         rawLogBuffer.push(chunk);   // wenver the log something during execution this listener will trigger
//     })

    

//     await new Promise((res, _)=>{

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

//     await javaDockerContainer.remove();   

//     return ;

// }


class JavaExecutor implements CodeExecutorStrategy {
    async execute(code: string, inputTestCase: string, outputCase: string): Promise<ExecutionResponse> {
        console.log("Java executor called");
        console.log(code, inputTestCase, outputCase);

        const rawLogBuffer: Buffer[] = [];

        console.log("Initialising a new java docker container");
        console.log(`Code received is \n ${code.replace(/'/g, `'\\"`)}`)
        //const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
        const runCommand = `echo "${code.replace(/"/g, '\\"').replace(/'/g, `'"'"'`)}" > Main.java && javac Main.java && echo "${inputTestCase.replace(/"/g, '\\"')}" | java Main`;

        console.log(runCommand);
        const javaDockerContainer = await createContainer(JAVA_IMAGE, [
            '/bin/sh', 
            '-c',
            runCommand
        ]); 


        // starting / booting the corresponding docker container
        await javaDockerContainer.start();

        console.log("Started the docker container");

        const loggerStream = await javaDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true // whether the logs are streamed or returned as a string
        });
        
        // Attach events on the stream objects to start and stop reading
        loggerStream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
        });

        try {
            const codeResponse : string = await this.fetchDecodedStream(loggerStream, rawLogBuffer);

            console.log( "codeResponse.trim() =>", codeResponse.trim() , "outputCase.trim()", outputCase.trim() );

            if(codeResponse.trim() === outputCase.trim()) {
                return {output: codeResponse, status: "SUCCESS"};
            } else {
                return {output: codeResponse, status: "WA"};
            }

        } catch (error) {
            
            console.log("Error occurred", error);

            if(error === "TLE") {
                await javaDockerContainer.kill();
            }
            return {output: error as string, status: "ERROR"}
        } finally {

            await javaDockerContainer.remove();

        }
    }

    fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]) : Promise<string> {
    
        return new Promise((res, rej) => {
            const timeout = setTimeout(() => {
                console.log("Timeout called");
                rej("TLE");
            }, 2000);
            loggerStream.on('end', () => {
                // This callback executes when the stream ends
                clearTimeout(timeout);
                console.log(rawLogBuffer);
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodedStream = decodeDockerStream(completeBuffer);
                // console.log(decodedStream);
                // console.log(decodedStream.stdout);
                if(decodedStream.stderr) {
                    rej(decodedStream.stderr);
                } else {
                    res(decodedStream.stdout);
                }
            });
        })
    }
    
}
  

export default JavaExecutor;
