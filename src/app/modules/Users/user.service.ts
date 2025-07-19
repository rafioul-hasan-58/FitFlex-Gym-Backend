import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import bcrypt from "bcrypt";
import { IAuthUser } from "../Auth/auth.interface";
import { User, userRole } from "@prisma/client";
// trainer related services
const createTrainer = async (payload: User) => {
    const isTrainerExists = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isTrainerExists) {
        throw new AppError(status.NOT_ACCEPTABLE, "This email is already in use");
    };
    const { password } = payload;
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
        data: {
            ...payload,
            // Ensure the role is set to Trainer
            role: userRole.Trainer,
            password: hashedPassword
        }
    });
    return result;
}
const updateTrainer = async (id: string, payload: Partial<User>) => {
    const trainer = await prisma.user.findUnique({
        where: {
            id
        },
    });
    if (!trainer || trainer.role !== userRole.Trainer) {
        throw new AppError(status.NOT_FOUND, 'Trainer not found');
    }
    const result = await prisma.user.update({
        where: {
            id
        },
        data: payload
    });
    return result;
}


const deleteTrainer = async (id: string) => {
    // Check if the trainer exists and has the role Trainer
    const trainer = await prisma.user.findUnique({
        where: { id },
    });

    if (!trainer || trainer.role !== 'Trainer') {
        throw new AppError(status.NOT_FOUND, 'Trainer not found');
    }

    try {
        const result = await prisma.$transaction(async (tx:any) => {
            // 1. Find all ClassSchedules by this trainer
            const schedules = await tx.classSchedule.findMany({
                where: { trainerId: id },
                select: { id: true },
            });

            const scheduleIds = schedules.map((schedule:any) => schedule.id);

            // 2. Delete all bookings related to these schedules
            if (scheduleIds.length > 0) {
                await tx.booking.deleteMany({
                    where: {
                        classScheduleId: { in: scheduleIds },
                    },
                });
            }

            // 3. Delete all ClassSchedules of this trainer
            await tx.classSchedule.deleteMany({
                where: { trainerId: id },
            });

            // 4. Delete the trainer user
            const deletedTrainer = await tx.user.delete({
                where: { id },
            });

            return deletedTrainer;
        });

        return result;
    } catch (error) {
        throw error; // this will rollback transaction automatically
    }
};

// trainee & admin related services
const getMyProfile = async (user: IAuthUser) => {
    const profile = await prisma.user.findUnique({
        where: {
            id: user.userId
        }
    });
    if (!profile) {
        throw new AppError(status.NOT_FOUND, "Profile not found");
    }
    return profile;
}
const updateMyProfile = async (user: IAuthUser, payload: Partial<User>) => {
    const profile = await prisma.user.findUnique({
        where: {
            id: user.userId
        }
    });
    if (!profile) {
        throw new AppError(status.NOT_FOUND, "Profile not found");
    }
    const result = await prisma.user.update({
        where: {
            id: user.userId
        },
        data: payload
    });

    return result
}
export const userServices = {
    createTrainer,
    updateTrainer,
    deleteTrainer,
    getMyProfile,
    updateMyProfile
}