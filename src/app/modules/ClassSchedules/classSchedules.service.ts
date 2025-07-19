import AppError from "../../errors/AppError";
import { TBookingFilterRequest, TScheduleFilterRequest } from "../../types/filters.types";
import { IPaginationOptions } from "../../types/pagination";
import calculatePagination from "../../utils/calculatePagination";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import { IAuthUser } from "../Auth/auth.interface";
import { ClassSchedule, Prisma, userRole } from "@prisma/client";

const addClassSchedule = async (scheduleData: ClassSchedule) => {
    // Check if the number of classes scheduled on the given date exceeds limit
    const schedulesOnDate = await prisma.classSchedule.count({
        where: {
            date: scheduleData.date,
        },
    });

    if (schedulesOnDate >= 5) {
        throw new AppError(
            status.BAD_REQUEST,
            'Cannot add more than 5 classes on the same day'
        );
    }

    // Check for overlapping time slots for the trainer
    const overlappingSchedule = await prisma.classSchedule.findFirst({
        where: {
            trainerId: scheduleData.trainerId,
            AND: [
                { startTime: { lt: scheduleData.endTime } },
                { endTime: { gt: scheduleData.startTime } },
            ],
        },
    });

    if (overlappingSchedule) {
        throw new AppError(
            status.BAD_REQUEST,
            'This time slot is already booked for the trainer'
        );
    }

    // Validate class duration is exactly 2 hours
    const startTime = new Date(scheduleData.startTime);
    const endTime = new Date(scheduleData.endTime);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (durationHours !== 2) {
        throw new AppError(status.BAD_REQUEST, 'Class duration must be exactly 2 hours');
    }

    // Verify the trainer exists and has the Trainer role
    const trainer = await prisma.user.findUnique({
        where: { id: scheduleData.trainerId },
    });

    if (!trainer || trainer.role !== userRole.Trainer) {
        throw new AppError(status.NOT_FOUND, 'Trainer not found or invalid role');
    }

    // Create the class schedule
    const createdSchedule = await prisma.classSchedule.create({
        data: scheduleData,
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