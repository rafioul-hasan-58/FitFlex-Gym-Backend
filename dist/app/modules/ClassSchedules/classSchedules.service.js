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
exports.classSchedulesService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const calculatePagination_1 = __importDefault(require("../../utils/calculatePagination"));
const prismaClient_1 = require("../../utils/prismaClient");
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const addClassSchedule = (scheduleData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the number of classes scheduled on the given date exceeds limit
    const schedulesOnDate = yield prismaClient_1.prisma.classSchedule.count({
        where: {
            date: scheduleData.date,
        },
    });
    if (schedulesOnDate >= 5) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot add more than 5 classes on the same day');
    }
    // Check for overlapping time slots for the trainer
    const overlappingSchedule = yield prismaClient_1.prisma.classSchedule.findFirst({
        where: {
            trainerId: scheduleData.trainerId,
            AND: [
                { startTime: { lt: scheduleData.endTime } },
                { endTime: { gt: scheduleData.startTime } },
            ],
        },
    });
    if (overlappingSchedule) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This time slot is already booked for the trainer');
    }
    // Validate class duration is exactly 2 hours
    const startTime = new Date(scheduleData.startTime);
    const endTime = new Date(scheduleData.endTime);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    if (durationHours !== 2) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Class duration must be exactly 2 hours');
    }
    // Verify the trainer exists and has the Trainer role
    const trainer = yield prismaClient_1.prisma.user.findUnique({
        where: { id: scheduleData.trainerId },
    });
    if (!trainer || trainer.role !== client_1.userRole.Trainer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Trainer not found or invalid role');
    }
    // Create the class schedule
    const createdSchedule = yield prismaClient_1.prisma.classSchedule.create({
        data: scheduleData,
    });
    return createdSchedule;
});
const getAllSchedule = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { traineeName, trainerName, startTime, endTime, date } = filters;
    const { limit, page, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(paginationOptions);
    const andConditions = [];
    // Filter by trainer name
    if (trainerName) {
        andConditions.push({
            trainer: {
                name: {
                    contains: trainerName
                }
            }
        });
    }
    // Filter by trainee name
    if (traineeName) {
        andConditions.push({
            bookings: {
                some: {
                    trainee: {
                        name: {
                            contains: traineeName
                        }
                    }
                }
            }
        });
    }
    //filter by date
    if (date) {
        andConditions.push({
            date: {
                equals: date
            }
        });
    }
    // Filter by start time
    if (startTime) {
        andConditions.push({
            startTime: {
                equals: startTime
            }
        });
    }
    // 
    // Filter by end time
    if (endTime) {
        andConditions.push({
            endTime: {
                equals: endTime
            }
        });
    }
    const where = andConditions.length > 0 ? { AND: andConditions } : {};
    // Fetch paginated ideas
    const classSchedule = yield prismaClient_1.prisma.classSchedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            trainer: true,
            bookings: {
                include: {
                    trainee: true
                }
            },
        },
    });
    // Count total
    const total = yield prismaClient_1.prisma.classSchedule.count({ where });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: classSchedule,
    };
});
const getTrainerSchedule = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { traineeName, startTime, endTime, date } = filters;
    const { limit, page, skip, sortBy, sortOrder } = (0, calculatePagination_1.default)(paginationOptions);
    const andConditions = [];
    andConditions.push({
        trainerId: user.userId
    });
    // Filter by trainer name
    if (traineeName) {
        andConditions.push({
            bookings: {
                some: {
                    trainee: {
                        name: {
                            contains: traineeName
                        }
                    }
                }
            }
        });
    }
    //filter by date
    if (date) {
        andConditions.push({
            date: {
                equals: date
            }
        });
    }
    // Filter by start time
    if (startTime) {
        andConditions.push({
            startTime: {
                equals: startTime
            }
        });
    }
    // 
    // Filter by end time
    if (endTime) {
        andConditions.push({
            endTime: {
                equals: endTime
            }
        });
    }
    const where = andConditions.length > 0 ? { AND: andConditions } : {};
    // Fetch paginated ideas
    const classSchedule = yield prismaClient_1.prisma.classSchedule.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            bookings: {
                include: {
                    trainee: true
                }
            },
        },
    });
    // Count total
    const total = yield prismaClient_1.prisma.classSchedule.count({ where });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: classSchedule,
    };
});
exports.classSchedulesService = {
    addClassSchedule,
    getTrainerSchedule,
    getAllSchedule
};
