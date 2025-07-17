import { z } from 'zod';

export const createUserZodSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.enum(['Admin', 'Trainer', 'Trainee']).optional(), // from your enum
    }),
});
