import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";


const createTrainer = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createTrainer(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Trainer created successfully",
        Data: result,
    });
});
const updateTrainer = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.updateTrainer(req.params.id, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Trainer updated successfully",
        Data: result,
    });
});

export const userController = {
    createTrainer,
    updateTrainer
}