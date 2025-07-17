import { z } from 'zod';

export const addClassScheduleZodSchema = z.object({
    date: z.string().datetime({ message: "Invalid date format (ISO expected)" }),
    startTime: z.string().datetime({ message: "Invalid startTime format (ISO expected)" }),
    endTime: z.string().datetime({ message: "Invalid endTime format (ISO expected)" }),
    trainerId: z.string().uuid({ message: "Invalid trainerId" }),
});
