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
const addClassSchedule = (classScheduleData) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, startTime, endTime, trainerId } = classScheduleData;
    // Check if the trainer exists and is authorized
    const trainer = yield prismaClient_1.prisma.user.findUnique({ where: { id: trainerId } });
    if (!trainer || trainer.role !== client_1.userRole.Trainer) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid or unauthorized trainer");
    }
    // Normalize and prepare date/time values
    const dateString = new Date(date).toISOString().split("T")[0];
    const classStart = new Date(`${dateString}T${startTime}Z`);
    const classEnd = new Date(`${dateString}T${endTime}Z`);
    const classDate = new Date(`${dateString}T00:00:00Z`);
    // Validate class duration
    const classDurationInHours = (classEnd.getTime() - classStart.getTime()) / (1000 * 60 * 60);
    if (classDurationInHours !== 2) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Each class must be exactly 2 hours long");
    }
    // Check max class limit for the day
    const scheduledClassesCount = yield prismaClient_1.prisma.classSchedule.count({
        where: { date: classDate },
    });
    if (scheduledClassesCount >= 5) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot create more than 5 class schedules per day");
    }
    // Check for schedule conflict for the same trainer
    const conflictingSchedule = yield prismaClient_1.prisma.classSchedule.findFirst({
        where: {
            date: classDate,
            trainerId,
            AND: [
                { startTime: { lt: classEnd } },
                { endTime: { gt: classStart } },
            ],
        },
    });
    if (conflictingSchedule) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Trainer already has a schedule during this time slot");
    }
    // Create new class schedule
    const createdSchedule = yield prismaClient_1.prisma.classSchedule.create({
        data: {
            date: classDate,
            startTime: classStart,
            endTime: classEnd,
            trainerId,
        },
    });
    return createdSchedule;
});
const getAllClassSchedules = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
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
const getTrainerSchedules = (filters, paginationOptions, user) => __awaiter(void 0, void 0, void 0, function* () {
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
const getClassScheduleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prismaClient_1.prisma.classSchedule.findUnique({
        where: {
            id
        }
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Class schedule not found!");
    }
    return result;
});
const updateClassSchedule = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const classSchedule = yield prismaClient_1.prisma.classSchedule.findUnique({
        where: {
            id
        }
    });
    if (!classSchedule) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Class Schedule not found!');
    }
    const result = yield prismaClient_1.prisma.classSchedule.update({
        where: {
            id
        },
        data: payload
    });
    return result;
});
const deleteClassSchedule = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const classSchedule = yield prismaClient_1.prisma.classSchedule.findUnique({
        where: { id }
    });
    if (!classSchedule) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Class Schedule not found!');
    }
    try {
        const result = yield prismaClient_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Step 1: Delete related bookings
            yield tx.booking.deleteMany({
                where: { classScheduleId: id }
            });
            // Step 2: Delete the class schedule
            const deletedSchedule = yield tx.classSchedule.delete({
                where: { id }
            });
            return deletedSchedule;
        }));
        return result;
    }
    catch (error) {
        console.error('❌ Transaction failed:', error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete class schedule.');
    }
});
exports.classSchedulesService = {
    addClassSchedule,
    getTrainerSchedules,
    getAllClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule
};
