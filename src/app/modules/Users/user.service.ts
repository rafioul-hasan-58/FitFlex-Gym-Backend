import { ClassSchedule, User, userRole } from "../../../generated/prisma";
import AppError from "../../errors/AppError";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import bcrypt from "bcrypt";

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
    if (!trainer) {
        throw new AppError(status.NOT_FOUND, "Trainer not found");
    };
    const result = await prisma.user.update({
        where: {
            id
        },
        data: payload
    });
    return result;
}

export const userServices = {
    createTrainer,
    updateTrainer
}