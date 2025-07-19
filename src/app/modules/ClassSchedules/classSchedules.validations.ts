import { z } from 'zod';

export const addClassScheduleZodSchema = z.object({
    date: z.string().datetime({ message: "Invalid date format (ISO expected)" }),
    startTime: z.string().datetime({ message: "Invalid startTime format (ISO expected)" }),
    endTime: z.string().datetime({ message: "Invalid endTime format (ISO expected)" }),
    trainerId: z.string().uuid({ message: "Invalid trainerId" }),
}).strict();
export const updateClassScheduleZodSchema = z.object({
    date: z.string().datetime({ message: "Invalid date format (ISO expected)" }).optional(),
    startTime: z.string().datetime({ message: "Invalid startTime format (ISO expected)" }).optional(),
    endTime: z.string().datetime({ message: "Invalid endTime format (ISO expected)" }).optional(),
    trainerId: z.string().uuid({ message: "Invalid trainerId" }).optional(),
}).strict();
