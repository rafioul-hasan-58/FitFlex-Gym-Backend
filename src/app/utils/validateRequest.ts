import { ZodObject, ZodRawShape } from "zod";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

const validateRequest = (schema: ZodObject<ZodRawShape>) => {
    // console.log(schema);
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await schema.parseAsync(
            req.body
        )
        next()
    })
}


export default validateRequest