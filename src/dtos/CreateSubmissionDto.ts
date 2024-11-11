import { z } from "zod";

// HOW DTO is going to look? 
// object that carries data between client and server

// export interface CreateSubmissionDto {
//     userId: string,
//     problemId: string,
//     code: string,
//     language: string
// };


export type CreateSubmissionDto = z.infer<typeof createSubmissionZodSchema>;    //z.infer for ts

export const createSubmissionZodSchema = z.object(
    {
        userId : z.string(),
        problemId : z.string(),
        code: z.string(),
        language: z.string()
    }
).strict();