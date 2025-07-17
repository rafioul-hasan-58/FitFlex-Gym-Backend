import { User } from "../../../generated/prisma";
import { prisma } from "../../utils/prismaClient";
import status from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../errors/APPError";
import config from "../../config";
import { IAuthData } from "./auth.interface";
import { createToken } from "../../utils/createToken";

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

export const AuthServices = {
    registerUser,
    login
}