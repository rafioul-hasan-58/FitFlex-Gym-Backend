"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.updateTrainerZodSchema = exports.createTrainerZodSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createTrainerZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.literal(client_1.userRole.Trainer, {
        error: 'Only Trainer role is allowed for registration',
    }),
}).strict();
exports.updateTrainerZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: zod_1.z.literal(client_1.userRole.Trainer, {
        error: 'Only Trainer role is allowed for registration',
    }).optional(),
}).strict();
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: zod_1.z.literal(client_1.userRole.Trainee, {
        error: 'Only Trainee role is allowed for registration',
    }).optional(),
}).strict();
