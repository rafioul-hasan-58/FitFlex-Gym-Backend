import { z } from 'zod';

export const createUserZodSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['Admin', 'Trainer', 'Trainee']).optional(),
});

export const loginUserZodSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string('Password not given'),
});

export const changePasswordZodSchema = z.object({
    oldPassword: z.string('Old password not given'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});