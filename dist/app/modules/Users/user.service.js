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
exports.userServices = void 0;
const prisma_1 = require("../../../generated/prisma");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prismaClient_1 = require("../../utils/prismaClient");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createTrainer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "This email is already in use");
    }
    const { password } = payload;
    // password hashing
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const result = yield prismaClient_1.prisma.user.create({
        data: Object.assign(Object.assign({}, payload), { 
            // Ensure the role is set to Trainer
            role: prisma_1.userRole.Trainer, password: hashedPassword })
    });
    return result;
});
exports.userServices = {
    createTrainer
};
