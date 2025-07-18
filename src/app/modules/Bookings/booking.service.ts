import status from "http-status";
import { Booking } from "../../../generated/prisma";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prismaClient";
import { IAuthUser } from "../Auth/auth.interface";

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

export const bookingServices = {
    bookClassSchedule
}