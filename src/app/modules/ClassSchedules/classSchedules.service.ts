import { ClassSchedule, Prisma, userRole } from "../../../generated/prisma";
import AppError from "../../errors/AppError";
import { TBookingFilterRequest, TScheduleFilterRequest } from "../../types/filters.types";
import { IPaginationOptions } from "../../types/pagination";
import calculatePagination from "../../utils/calculatePagination";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import { IAuthUser } from "../Auth/auth.interface";

const addClassSchedule = async (payload: ClassSchedule) => {
    // Check if the class schedule for the given date already exists
    const dateExistingSchedule = await prisma.classSchedule.findMany({
        where: {
            date: payload.date
        }
    })
    if (dateExistingSchedule.length > 4) {
        throw new AppError(status.BAD_REQUEST, "You can not add more than 5 classes in a day");
    }
    const isSeatAvailable = await prisma.classSchedule.findFirst({
        where: {
            trainerId: payload.trainerId,
            AND: [
                {
                    startTime: {
                        lt: payload.endTime,
                    },
                },
                {
                    endTime: {
                        gt: payload.startTime,
                    },
                },
            ],
        },
    });

    if (isSeatAvailable) {
        throw new AppError(
            status.BAD_REQUEST,
            "This time slot is already booked for this trainer"
        );
    }
    // Check if the class duration is less or more than 2 hours
    const start = new Date(payload.startTime);
    const end = new Date(payload.endTime);

    const durationInMilliseconds = end.getTime() - start.getTime();
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60);

    if (durationInHours !== 2) {
        throw new AppError(400, "Class duration must be exactly 2 hours");
    }
    // Check if the trainer exists and has the correct role
    const trainer = await prisma.user.findUnique({
        where: {
            id: payload.trainerId,
            role: userRole.Trainer
        }
    })
    if (!trainer) {
        throw new AppError(status.NOT_FOUND, "Trainer not found or invalid role");
    }
    const result = await prisma.classSchedule.create({
        data: payload
    })
    return result;
}

const getAllSchedule = async (
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
const getTrainerSchedule = async (
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

export const classSchedulesService = {
    addClassSchedule,
    getTrainerSchedule,
    getAllSchedule
}