"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordZodSchema = exports.loginUserZodSchema = exports.registerUserZodSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../generated/prisma");
exports.registerUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.literal(prisma_1.userRole.Trainee, {
        error: 'Only Trainee role is allowed for registration',
    }).optional(),
});
exports.loginUserZodSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string('Password not given'),
});
exports.changePasswordZodSchema = zod_1.z.object({
    oldPassword: zod_1.z.string('Old password not given'),
    newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters'),
});
