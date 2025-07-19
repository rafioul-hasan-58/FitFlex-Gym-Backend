import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";
import { IAuthData, IAuthUser } from "./auth.interface";
import { createToken } from "../../utils/createToken";
import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { User, userRole } from "@prisma/client";

// register user
const registerUser = async (payload: User) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isUserExists) {
        throw new AppError(status.NOT_ACCEPTABLE, "This email is already in use");
    }
    if (payload.role === userRole.Trainer) {
        throw new AppError(status.UNAUTHORIZED, 'You are not authorized to register as a Trainer')
    }
    const { password } = payload;
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword
        }
    })
    return result;
}
// login user
const login = async (payload: IAuthData) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });
    if (!user) {
        throw new AppError(status.NOT_FOUND, 'User not found')
    }
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError(status.FORBIDDEN, 'Password not matched')
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
        userId: user.id
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
    );
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
    );

    return {
        accessToken,
        refreshToken
    }
}
const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwt.verify(token, config.jwt_refresh_secret as string);
    } catch (err) {
        throw new AppError(status.UNAUTHORIZED, "You are not authorized");
    }

    if (typeof decodedData === "string" || !("email" in decodedData)) {
        throw new AppError(status.NOT_ACCEPTABLE, "Invalid token payload");
    }
    const user = await prisma.user.findUnique({
        where: {
            email: decodedData.email,
        },
    });
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found!");
    }
    const accessToken = createToken(
        {
            email: user.email,
            role: user.role,
            userId: user.id,
        },
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
    );
    return { accessToken };
};

const changePassword = async (
    user: IAuthUser,
    payload: { oldPassword: string; newPassword: string }
) => {
    if (payload.oldPassword === payload.newPassword) {
        throw new AppError(status.NOT_ACCEPTABLE, "New password cannot be same as old password");
    }
    const userData = await prisma.user.findUnique({
        where: {
            email: user?.email,
        },
    });
    if (!userData) {
        throw new AppError(status.NOT_FOUND, "User not found!");
    }
    if (userData.password === payload.newPassword) {
        throw new AppError(status.NOT_ACCEPTABLE, "New password cannot be same as old password");
    }

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.oldPassword,
        userData.password
    );

    if (!isCorrectPassword) {
        throw new AppError(status.NOT_ACCEPTABLE, "Password incorrect!");
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });

    return {
        message: "Password changed successfully!",
    };
};
export const AuthServices = {
    registerUser,
    login,
    refreshToken,
    changePassword
}