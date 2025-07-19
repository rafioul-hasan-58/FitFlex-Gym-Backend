import { optional, z } from 'zod';

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
  date: z
    .string()
    .nonempty("Date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
  startTime: z
    .string()
    .nonempty("Start time is required")
    .regex(timeRegex, "Start time must be in HH:mm:ss format")
    .optional(),
  endTime: z
    .string()
    .nonempty("End time is required")
    .regex(timeRegex, "End time must be in HH:mm:ss format")
    .optional(),
  trainerId: z.string().nonempty("Trainer ID is required")
    .optional(),
}).strict();

