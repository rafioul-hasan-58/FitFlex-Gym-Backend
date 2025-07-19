"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordZodSchema = exports.loginUserZodSchema = exports.registerUserZodSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.registerUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.literal(client_1.userRole.Trainee, {
        error: 'Only Trainee role is allowed for registration',
    }).optional(),
}).strict();
exports.loginUserZodSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string('Password not given'),
}).strict();
exports.changePasswordZodSchema = zod_1.z.object({
    oldPassword: zod_1.z.string('Old password not given'),
    newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters'),
}).strict();
