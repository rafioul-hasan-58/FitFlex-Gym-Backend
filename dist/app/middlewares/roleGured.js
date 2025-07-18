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
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = require("../utils/prismaClient");
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const roleGured = (...userRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Your token is missing");
            }
            const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
            if (userRoles.length && !userRoles.includes(decodedUser.role)) {
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to access this route");
            }
            req.user = decodedUser;
            const isUserExists = yield prismaClient_1.prisma.user.findUnique({
                where: {
                    email: decodedUser.email,
                },
            });
            if (!isUserExists) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not exists in auth");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.default = roleGured;
