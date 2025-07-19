import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prismaClient";
import { IAuthUser } from "../Auth/auth.interface";
import { TBookingFilterRequest } from "../../types/filters.types";
import { IPaginationOptions } from "../../types/pagination";
import calculatePagination from "../../utils/calculatePagination";
import { Booking, Prisma } from "@prisma/client";

const bookClassSchedule = async (payload: Booking, user: IAuthUser) => {
    const classSchedule = await prisma.classSchedule.findUnique({
        where: {
            id: payload.classScheduleId
        }
    });

    //  Check if class schedule exists
    if (!classSchedule) {
        throw new AppError(status.NOT_FOUND, "Class schedule not found");
    }

    //  Check how many bookings are already made for this class schedule
    const existingTotalBooking = await prisma.booking.findMany({
        where: {
            classScheduleId: payload.classScheduleId,
        }
    });

    if (existingTotalBooking.length >= 10) {
        throw new AppError(
            status.BAD_REQUEST,
            "Class schedule is full. Maximum 10 trainees allowed per schedule"
        );
    }

    //  Check if the user has already booked this class schedule
    const isAlreadyBooked = await prisma.booking.findFirst({
        where: {
            classScheduleId: payload.classScheduleId,
            traineeId: user.userId,
        }
    });

    if (isAlreadyBooked) {
        throw new AppError(
            status.BAD_REQUEST,
            "You have already booked this class schedule"
        );
    }

    //  Create booking
    const result = await prisma.booking.create({
        data: {
            ...payload,
            traineeId: user.userId
        },
    });

    return result;
};

const getAllBookings = async (
    filters: TBookingFilterRequest,
    paginationOptions: IPaginationOptions,
) => {
    const { trainerName, startTime, endTime, date } = filters;
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const andConditions: Prisma.BookingWhereInput[] = [];
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

    const where: Prisma.BookingWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // Fetch paginated ideas
    const bookings = await prisma.booking.findMany({
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
    const total = await prisma.booking.count({ where });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: bookings,
    };
};
const getMyBookings = async (
    filters: TBookingFilterRequest,
    paginationOptions: IPaginationOptions,
    user: IAuthUser
) => {
    const { trainerName, startTime, endTime, date } = filters;
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const andConditions: Prisma.BookingWhereInput[] = [];
    andConditions.push({
        traineeId: user.userId
    })

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

    const where: Prisma.BookingWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // Fetch paginated ideas
    const bookings = await prisma.booking.findMany({
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
    const total = await prisma.booking.count({ where });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: bookings,
    };
};
const cancelBooking = async (id: string, user: IAuthUser) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id
        }
    });
    if (booking?.traineeId !== user.userId) {
        throw new AppError(status.NOT_FOUND, "You are not authorized to cancel this booking")
    }
    if (!booking) {
        throw new AppError(status.NOT_FOUND, "Booking not found!");
    }
    const result = await prisma.booking.delete({
        where: {
            id
        }
    });
    return result
}
const getBookingById = async (id: string) => {
    const result = await prisma.booking.findUnique({
        where: {
            id
        }
    })
    if (!result) {
        throw new AppError(status.NOT_FOUND, "Booking not found!")
    }
    return result
}
export const bookingServices = {
    bookClassSchedule,
    getMyBookings,
    getAllBookings,
    cancelBooking,
    getBookingById
}