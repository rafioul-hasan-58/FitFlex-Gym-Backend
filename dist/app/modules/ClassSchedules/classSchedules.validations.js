"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClassScheduleZodSchema = exports.addClassScheduleZodSchema = void 0;
const zod_1 = require("zod");
const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
exports.addClassScheduleZodSchema = zod_1.z.object({
    date: zod_1.z
        .string()
        .nonempty("Date is required")
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    startTime: zod_1.z
        .string()
        .nonempty("Start time is required")
        .regex(timeRegex, "Start time must be in HH:mm:ss format"),
    endTime: zod_1.z
        .string()
        .nonempty("End time is required")
        .regex(timeRegex, "End time must be in HH:mm:ss format"),
    trainerId: zod_1.z.string().nonempty("Trainer ID is required"),
}).strict();
exports.updateClassScheduleZodSchema = zod_1.z.object({
    date: zod_1.z.string().datetime({ message: "Invalid date format (ISO expected)" }).optional(),
    startTime: zod_1.z.string().datetime({ message: "Invalid startTime format (ISO expected)" }).optional(),
    endTime: zod_1.z.string().datetime({ message: "Invalid endTime format (ISO expected)" }).optional(),
    trainerId: zod_1.z.string().uuid({ message: "Invalid trainerId" }).optional(),
}).strict();
