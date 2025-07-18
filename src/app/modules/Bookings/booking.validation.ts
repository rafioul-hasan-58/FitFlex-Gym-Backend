
import { z } from 'zod';

export const bookingZodSchema = z.object({
    classScheduleId: z.string()
        .nonempty("Class Schedule ID is required")
});
