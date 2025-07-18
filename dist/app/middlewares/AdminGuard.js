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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const prismaClient_1 = require("../utils/prismaClient");
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const AdminGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Token not found");
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        if (decoded.role !== "Admin")
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Unauthorized access.');
        const userExists = yield prismaClient_1.prisma.user.findUnique({
            where: { email: decoded.email },
        });
        if (!userExists)
            throw new Error("User not found");
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(http_status_1.default.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized access.",
            statusCode: http_status_1.default.UNAUTHORIZED,
            errorDetails: "You must be an admin to perform this action."
        });
    }
});
exports.default = AdminGuard;
