"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClassScheduleZodSchema = void 0;
const zod_1 = require("zod");
exports.addClassScheduleZodSchema = zod_1.z.object({
    date: zod_1.z.string().datetime({ message: "Invalid date format (ISO expected)" }),
    startTime: zod_1.z.string().datetime({ message: "Invalid startTime format (ISO expected)" }),
    endTime: zod_1.z.string().datetime({ message: "Invalid endTime format (ISO expected)" }),
    trainerId: zod_1.z.string().uuid({ message: "Invalid trainerId" }),
}).strict();
