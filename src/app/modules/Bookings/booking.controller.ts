import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";
import { IAuthUser } from "../Auth/auth.interface";
import pick from "../../utils/pick";
import { bookingFilterAbleFields } from "../../constant/booking.constant";
import { paginationQueries } from "../../constant/pagination.constant";

const bookClassSchedule = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await bookingServices.bookClassSchedule(req.body, req.user as IAuthUser);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Class schedule booked successfully",
        Data: result,
    });
});
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const bookingFilters = pick(req.query, bookingFilterAbleFields);
    const paginationOptions = pick(req.query, paginationQueries)
    const result = await bookingServices.getAllBookings(bookingFilters, paginationOptions);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "All bookings fetched successfully",
        Data: result,
    });
});
const getMyBookings = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const bookingFilters = pick(req.query, bookingFilterAbleFields);
    const paginationOptions = pick(req.query, paginationQueries)
    const result = await bookingServices.getMyBookings(bookingFilters, paginationOptions, req.user as IAuthUser);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "My booking fetched successfully",
        Data: result,
    });
});

export const bookingController = {
    bookClassSchedule,
    getMyBookings,
    getAllBookings
};