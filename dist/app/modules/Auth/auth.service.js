"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const prismaClient_1 = require("../../utils/prismaClient");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const createToken_1 = require("../../utils/createToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const client_1 = require("@prisma/client");
// register user
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "This email is already in use");
    }
    if (payload.role === client_1.userRole.Trainer) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to register as a Trainer');
    }
    const { password } = payload;
    // password hashing
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const result = yield prismaClient_1.prisma.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword })
    });
    return result;
});
// login user
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password not matched');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        userId: user.id
    };
    const accessToken = (0, createToken_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, createToken_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    if (typeof decodedData === "string" || !("email" in decodedData)) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Invalid token payload");
    }
    const user = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email: decodedData.email,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const accessToken = (0, createToken_1.createToken)({
        email: user.email,
        role: user.role,
        userId: user.id,
    }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return { accessToken };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.oldPassword === payload.newPassword) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "New password cannot be same as old password");
    }
    const userData = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (userData.password === payload.newPassword) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "New password cannot be same as old password");
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "Password incorrect!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prismaClient_1.prisma.user.update({
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
});
exports.AuthServices = {
    registerUser,
    login,
    refreshToken,
    changePassword
};
