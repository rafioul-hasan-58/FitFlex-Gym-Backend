import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { classSchedulesService } from "./classSchedules.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const addClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await classSchedulesService.addClassSchedule(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Class schedule added successfully",
        Data: result,
    });
});

export const classSchedulesController = {
    addClassSchedule
}