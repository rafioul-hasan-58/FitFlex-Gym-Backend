"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingZodSchema = void 0;
const zod_1 = require("zod");
exports.bookingZodSchema = zod_1.z.object({
    classScheduleId: zod_1.z.string()
        .nonempty("Class Schedule ID is required")
});
