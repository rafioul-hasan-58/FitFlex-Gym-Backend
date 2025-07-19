import AppError from "../../errors/AppError";
import { TBookingFilterRequest, TScheduleFilterRequest } from "../../types/filters.types";
import { IPaginationOptions } from "../../types/pagination";
import calculatePagination from "../../utils/calculatePagination";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import { IAuthUser } from "../Auth/auth.interface";
import { ClassSchedule, Prisma, userRole } from "@prisma/client";

const addClassSchedule = async (classScheduleData: ClassSchedule) => {
    const { date, startTime, endTime, trainerId } = classScheduleData;

    // Check if the trainer exists and is authorized
    const trainer = await prisma.user.findUnique({ where: { id: trainerId } });
    if (!trainer || trainer.role !== userRole.Trainer) {
        throw new AppError(status.BAD_REQUEST, "Invalid or unauthorized trainer");
    }

    // Normalize and prepare date/time values
    const dateString = new Date(date).toISOString().split("T")[0];
    const classStart = new Date(`${dateString}T${startTime}Z`);
    const classEnd = new Date(`${dateString}T${endTime}Z`);
    const classDate = new Date(`${dateString}T00:00:00Z`);

    // Validate class duration
    const classDurationInHours =
        (classEnd.getTime() - classStart.getTime()) / (1000 * 60 * 60);
    if (classDurationInHours !== 2) {
        throw new AppError(
            status.BAD_REQUEST,
            "Each class must be exactly 2 hours long"
        );
    }

    // Check max class limit for the day
    const scheduledClassesCount = await prisma.classSchedule.count({
        where: { date: classDate },
    });

    if (scheduledClassesCount >= 5) {
        throw new AppError(
            status.BAD_REQUEST,
            "Cannot create more than 5 class schedules per day"
        );
    }

    // Check for schedule conflict for the same trainer
    const conflictingSchedule = await prisma.classSchedule.findFirst({
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
        throw new AppError(
            status.BAD_REQUEST,
            "Trainer already has a schedule during this time slot"
        );
    }

    // Create new class schedule
    const createdSchedule = await prisma.classSchedule.create({
        data: {
            date: classDate,
            startTime: classStart,
            endTime: classEnd,
            trainerId,
        },
    });

    return createdSchedule;
};

const getAllClassSchedules = async (
    filters: TScheduleFilterRequest,
    paginationOptions: IPaginationOptions,
) => {
    const { traineeName, trainerName, startTime, endTime, date } = filters;
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const andConditions: Prisma.ClassScheduleWhereInput[] = [];

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

    const where: Prisma.ClassScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // Fetch paginated ideas
    const classSchedule = await prisma.classSchedule.findMany({
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
    const total = await prisma.classSchedule.count({ where });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: classSchedule,
    };
};
const getTrainerSchedules = async (
    filters: TScheduleFilterRequest,
    paginationOptions: IPaginationOptions,
    user: IAuthUser
) => {
    const { traineeName, startTime, endTime, date } = filters;
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const andConditions: Prisma.ClassScheduleWhereInput[] = [];
    andConditions.push({
        trainerId: user.userId
    })

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

    const where: Prisma.ClassScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // Fetch paginated ideas
    const classSchedule = await prisma.classSchedule.findMany({
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
    const total = await prisma.classSchedule.count({ where });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: classSchedule,
    };
};
const getClassScheduleById = async (id: string) => {
    const schedule = await prisma.classSchedule.findUnique({
        where: {
            id
        }
    })
    return schedule
}
const updateClassSchedule = async (id: string, payload: Partial<ClassSchedule>) => {
    const classSchedule = await prisma.classSchedule.findUnique({
        where: {
            id
        }
    });
    if (!classSchedule) {
        throw new AppError(status.NOT_FOUND, 'Class Schedule not found!')
    }
    const result = await prisma.classSchedule.update({
        where: {
            id
        },
        data: payload
    });
    return result
}
const deleteClassSchedule = async (id: string) => {
    const classSchedule = await prisma.classSchedule.findUnique({
        where: { id }
    });

    if (!classSchedule) {
        throw new AppError(status.NOT_FOUND, 'Class Schedule not found!');
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Step 1: Delete related bookings
            await tx.booking.deleteMany({
                where: { classScheduleId: id }
            });

            // Step 2: Delete the class schedule
            const deletedSchedule = await tx.classSchedule.delete({
                where: { id }
            });

            return deletedSchedule;
        });

        return result;
    } catch (error) {
        console.error('❌ Transaction failed:', error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to delete class schedule.');
    }
};

export const classSchedulesService = {
    addClassSchedule,
    getTrainerSchedules,
    getAllClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule
}