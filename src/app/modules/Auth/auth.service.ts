import { User } from "../../../generated/prisma";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../errors/APPError";

const registerUser = async (payload: User) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isUserExists) {
        throw new AppError(status.NOT_ACCEPTABLE, "This email is already in use");
    }
    const { password } = payload;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword
        }
    })
    return result;
}


export const AuthServices = {
    registerUser
}