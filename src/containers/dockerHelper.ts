import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

// buffer is collection of bytes here

export default function decodeDockerStream(buffer: Buffer) : DockerStreamOutput{
    let offset = 0; // This variable keeps track of the current position in the buffer while parsing

    // The output that will store the accumulated stdout and stderr output as strings
    const output: DockerStreamOutput = { stdout: '' , stderr: ''}; 

    // Loop until offset reaches end of the buffer
    while(offset < buffer.length) {

        // channel is read from buffer and has value of type of stream
        const typeOfStream = buffer[offset];

        // This length variable hold the length of the value 
        // We will read this variable on an offset of 4 bytes from the start of the chunk
        const length = buffer.readUint32BE(offset + 4);

        // as now we have read the header, we can move forward to the value of the chunk
        // first 8 byte is header so move forward
        offset += DOCKER_STREAM_HEADER_SIZE;

        if(typeOfStream === 1) {
            // stdout stream => output stream
            output.stdout += buffer.toString('utf-8', offset, offset + length);
        } else if(typeOfStream === 2) {
            // stderr stream => error stream
            output.stderr += buffer.toString('utf-8', offset, offset + length);
        }

        offset += length; // move offset to next chunk
    }

    return output;
}