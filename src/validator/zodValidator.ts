import { NextFunction,Request, Response } from 'express';
import { ZodSchema } from "zod";

 
export const validator = (schema: ZodSchema<any>) => (req : Request, res: Response, next : NextFunction) =>{
    try {
        
        // way to validate zod validation
        schema.parse({...req.body});

        next();

    } catch (error) {
        console.log(error);
        
        res.status(400).json({
            success: false,
            message: 'Invalid request params received',
            data: {},
            error: error 
        });
    }
}