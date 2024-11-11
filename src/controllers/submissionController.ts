import { Request, Response } from 'express';

import { CreateSubmissionDto } from '../dtos/CreateSubmissionDto';


export function addSubmission(req: Request, res: Response) {

    console.log("req.body=>", req.body);

    const submissionDto = req.body as CreateSubmissionDto;  // coming at running time so TS is not able to validate it according to 'CreateSubmissionDto' bcz it is converted into Js
    
    console.log(submissionDto);

    res.status(201).json({
        success: true,
        error: {},
        message: 'Successfully collected the submission',
        data: submissionDto
    });
}