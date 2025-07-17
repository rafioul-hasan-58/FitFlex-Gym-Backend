import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import status from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.registerUser(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User registered successfully",
        Data: result,
    });
});

export const AuthController = {
    registerUser
}