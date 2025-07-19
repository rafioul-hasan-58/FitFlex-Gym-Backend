import { z } from 'zod';

const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const addClassScheduleZodSchema = z.object({
   date: z
      .string()
      .nonempty("Date is required")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    startTime: z
      .string()
      .nonempty("Start time is required")
      .regex(timeRegex, "Start time must be in HH:mm:ss format"),
    endTime: z
      .string()
      .nonempty("End time is required")
      .regex(timeRegex, "End time must be in HH:mm:ss format"),
    trainerId: z.string().nonempty("Trainer ID is required"),
}).strict();

export const updateClassScheduleZodSchema = z.object({
    date: z.string().datetime({ message: "Invalid date format (ISO expected)" }).optional(),
    startTime: z.string().datetime({ message: "Invalid startTime format (ISO expected)" }).optional(),
    endTime: z.string().datetime({ message: "Invalid endTime format (ISO expected)" }).optional(),
    trainerId: z.string().uuid({ message: "Invalid trainerId" }).optional(),
}).strict();
