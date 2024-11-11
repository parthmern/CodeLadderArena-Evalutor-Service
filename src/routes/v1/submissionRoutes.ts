import express from "express";

import { addSubmission } from "../../controllers/submissionController";
import { createSubmissionZodSchema } from "../../dtos/CreateSubmissionDto";
import { validator } from "../../validator/zodValidator";

const submissionRouter = express.Router();

submissionRouter.post('/', validator(createSubmissionZodSchema) ,addSubmission);

export default submissionRouter;