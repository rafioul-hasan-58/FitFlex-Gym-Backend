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
exports.classSchedulesService = void 0;
const prisma_1 = require("../../../generated/prisma");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prismaClient_1 = require("../../utils/prismaClient");
const http_status_1 = __importDefault(require("http-status"));
const addClassSchedule = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the class schedule for the given date already exists
    const dateExistingSchedule = yield prismaClient_1.prisma.classSchedule.findMany({
        where: {
            date: payload.date
        }
    });
    if (dateExistingSchedule.length > 4) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can not add more than 5 classes in a day");
    }
    const isSeatAvailable = yield prismaClient_1.prisma.classSchedule.findFirst({
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
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This time slot is already booked for this trainer");
    }
    // Check if the class duration is less or more than 2 hours
    const start = new Date(payload.startTime);
    const end = new Date(payload.endTime);
    const durationInMilliseconds = end.getTime() - start.getTime();
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
    if (durationInHours !== 2) {
        throw new AppError_1.default(400, "Class duration must be exactly 2 hours");
    }
    // Check if the trainer exists and has the correct role
    const trainer = yield prismaClient_1.prisma.user.findUnique({
        where: {
            id: payload.trainerId,
            role: prisma_1.userRole.Trainer
        }
    });
    if (!trainer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Trainer not found or invalid role");
    }
    const result = yield prismaClient_1.prisma.classSchedule.create({
        data: payload
    });
    return result;
});
exports.classSchedulesService = {
    addClassSchedule
};
