import sampleQueue from "../queues/sampleQueue";

export default async function(name: string, payload: Record<string, unknown>, priority?: number) {
    await sampleQueue.add(name, payload, { priority });
    console.log(`successfully added a new job (name:${name})`);
}