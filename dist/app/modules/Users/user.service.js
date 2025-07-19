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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prismaClient_1 = require("../../utils/prismaClient");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
// trainer related services
const createTrainer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTrainerExists = yield prismaClient_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isTrainerExists) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "This email is already in use");
    }
    ;
    const { password } = payload;
    // password hashing
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const result = yield prismaClient_1.prisma.user.create({
        data: Object.assign(Object.assign({}, payload), { 
            // Ensure the role is set to Trainer
            role: client_1.userRole.Trainer, password: hashedPassword })
    });
    return result;
});
const updateTrainer = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const trainer = yield prismaClient_1.prisma.user.findUnique({
        where: {
            id
        },
    });
    if (!trainer || trainer.role !== client_1.userRole.Trainer) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Trainer not found');
    }
    const result = yield prismaClient_1.prisma.user.update({
        where: {
            id
        },
        data: payload
    });
    return result;
});
const deleteTrainer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the trainer exists and has the role Trainer
    const trainer = yield prismaClient_1.prisma.user.findUnique({
        where: { id },
    });
    if (!trainer || trainer.role !== 'Trainer') {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Trainer not found');
    }
    try {
        const result = yield prismaClient_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Find all ClassSchedules by this trainer
            const schedules = yield tx.classSchedule.findMany({
                where: { trainerId: id },
                select: { id: true },
            });
            const scheduleIds = schedules.map((schedule) => schedule.id);
            // 2. Delete all bookings related to these schedules
            if (scheduleIds.length > 0) {
                yield tx.booking.deleteMany({
                    where: {
                        classScheduleId: { in: scheduleIds },
                    },
                });
            }
            // 3. Delete all ClassSchedules of this trainer
            yield tx.classSchedule.deleteMany({
                where: { trainerId: id },
            });
            // 4. Delete the trainer user
            const deletedTrainer = yield tx.user.delete({
                where: { id },
            });
            return deletedTrainer;
        }));
        return result;
    }
    catch (error) {
        throw error; // this will rollback transaction automatically
    }
});
// trainee & admin related services
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prismaClient_1.prisma.user.findUnique({
        where: {
            id: user.userId
        }
    });
    if (!profile) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Profile not found");
    }
    return profile;
});
const updateMyProfile = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prismaClient_1.prisma.user.findUnique({
        where: {
            id: user.userId
        }
    });
    if (!profile) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Profile not found");
    }
    const result = yield prismaClient_1.prisma.user.update({
        where: {
            id: user.userId
        },
        data: payload
    });
    return result;
});
exports.userServices = {
    createTrainer,
    updateTrainer,
    deleteTrainer,
    getMyProfile,
    updateMyProfile
};
