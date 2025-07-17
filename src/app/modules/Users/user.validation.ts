import { z } from 'zod';
import { userRole } from '../../../generated/prisma';

export const createTrainerZodSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.literal(userRole.Trainer, {
        error: 'Only Trainer role is allowed for registration',
    }),
});