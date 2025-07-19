import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { classSchedulesService } from "./classSchedules.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import pick from "../../utils/pick";
import { IAuthUser } from "../Auth/auth.interface";
import { paginationQueries } from "../../constant/pagination.constant";
import { classScheduleFilterAbleFields } from "../../constant/classSchedule.constant";

const addClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await classSchedulesService.addClassSchedule(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Class schedule added successfully",
        Data: result,
    });
});
const getAllClassSchedules = catchAsync(async (req: Request, res: Response) => {
    const classScheduleFilters = pick(req.query, classScheduleFilterAbleFields);
    const paginationOptions = pick(req.query, paginationQueries)
    const result = await classSchedulesService.getAllClassSchedules(classScheduleFilters, paginationOptions);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All ClassSchedule fetched successfully",
        Data: result,
    });
});
const getTrainerSchedules = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const classScheduleFilters = pick(req.query, classScheduleFilterAbleFields);
    const paginationOptions = pick(req.query, paginationQueries)
    const result = await classSchedulesService.getTrainerSchedules(classScheduleFilters, paginationOptions, req.user as IAuthUser);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My Schedule fetched successfully",
        Data: result,
    });
});
const getClassScheduleById = catchAsync(async (req: Request, res: Response) => {
    const result = await classSchedulesService.getClassScheduleById(req.params.id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule fetched successfully",
        Data: result,
    });
});
const updateClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await classSchedulesService.updateClassSchedule(req.params.id, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule updated successfully",
        Data: result,
    });
});
const deleteClassSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await classSchedulesService.deleteClassSchedule(req.params.id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Schedule deleted successfully",
        Data: result,
    });
});
export const classSchedulesController = {
    addClassSchedule,
    getTrainerSchedules,
    getAllClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule

}