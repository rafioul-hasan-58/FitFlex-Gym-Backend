import { ClassSchedule, userRole } from "../../../generated/prisma";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";

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

export const classSchedulesService = {
    addClassSchedule
}