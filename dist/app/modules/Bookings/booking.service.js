"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prismaClient_1 = require("../../utils/prismaClient");
const calculatePagination_1 = __importDefault(require("../../utils/calculatePagination"));
const bookClassSchedule = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const classSchedule = yield prismaClient_1.prisma.classSchedule.findUnique({
        where: {
            id: payload.classScheduleId
        }
    });
    //  Check if class schedule exists
    if (!classSchedule) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Class schedule not found");
    }
    //  Check how many bookings are already made for this class schedule
    const existingTotalBooking = yield prismaClient_1.prisma.booking.findMany({
        where: {
            classScheduleId: payload.classScheduleId,
        }
    });
    if (existingTotalBooking.length >= 1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Class schedule is full. Maximum 10 trainees allowed per schedule");
    }
    //  Check if the user has already booked this class schedule
    const isAlreadyBooked = yield prismaClient_1.prisma.booking.findFirst({
        where: {
            classScheduleId: payload.classScheduleId,
            traineeId: user.userId,
        }
    });
    if (isAlreadyBooked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You have already booked this class schedule");
    }
    //  Create booking
    const result = yield prismaClient_1.prisma.booking.create({
        data: Object.assign(Object.assign({}, payload), { traineeId: user.userId }),
    });
    return result;
});
const getMyBookings = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { trainerName, startTime, endTime, date } = filters;
    const { limit, page, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(paginationOptions);
    const andConditions = [];
    andConditions.push({
        traineeId: user.userId
    });
    // Filter by trainer name
    if (trainerName) {
        andConditions.push({
            classSchedule: {
                trainer: {
                    name: {
                        contains: trainerName
                    }
                },
            },
        });
    }
    //filter by date
    if (date) {
        andConditions.push({
            classSchedule: {
                date: {
                    equals: date
                }
            }
        });
    }
    // Filter by start time
    if (startTime) {
        andConditions.push({
            classSchedule: {
                startTime: {
                    equals: startTime
                }
            }
        });
    }
    // 
    // Filter by end time
    if (endTime) {
        andConditions.push({
            classSchedule: {
                endTime: {
                    equals: endTime
                }
            }
        });
    }
    const where = andConditions.length > 0 ? { AND: andConditions } : {};
    // Fetch paginated ideas
    const bookings = yield prismaClient_1.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            classSchedule: {
                include: {
                    trainer: true
                }
            },
        },
    });
    // Count total
    const total = yield prismaClient_1.prisma.booking.count({ where });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: bookings,
    };
});
exports.bookingServices = {
    bookClassSchedule,
    getMyBookings
};
