import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import status from "http-status";
import { IAuthUser } from "./auth.interface";

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.registerUser(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User registered successfully",
        Data: result,
    });
});

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.login(req.body);
    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
    });
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User logged in successfully",
        Data: {
            accessToken: result.accessToken,
        },
    });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Token refreshed successfully",
        Data: result,
    });
});
const changePassword = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const result = await AuthServices.changePassword(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Password Changed successfully",
      Data: result,
    });
  }
);
export const AuthController = {
    registerUser,
    login,
    refreshToken,
    changePassword
}