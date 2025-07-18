import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";
import { IAuthUser } from "../Auth/auth.interface";

const bookClassSchedule = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await bookingServices.bookClassSchedule(req.body, req.user as IAuthUser);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Class schedule booked successfully",
        Data: result,
    });
});

export const bookingController = {
    bookClassSchedule
};