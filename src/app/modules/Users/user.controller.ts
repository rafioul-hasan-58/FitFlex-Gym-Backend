import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

// trainer related controllers
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
const deleteTrainer = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.deleteTrainer(req.params.id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Trainer deleted successfully",
        Data: result,
    });
});
// trainee & admin related controllers
const getMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await userServices.getMyProfile(req.user);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My profile fetched successfully",
        Data: result,
    });
});
const updateMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await userServices.updateMyProfile(req.user,req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My profile updated successfully",
        Data: result,
    });
});
export const userController = {
    createTrainer,
    updateTrainer,
    deleteTrainer,
    getMyProfile,
    updateMyProfile
}