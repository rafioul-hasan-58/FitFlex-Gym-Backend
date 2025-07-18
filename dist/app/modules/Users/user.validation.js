"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainerZodSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../generated/prisma");
exports.createTrainerZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.literal(prisma_1.userRole.Trainer, {
        error: 'Only Trainer role is allowed for registration',
    }),
});
