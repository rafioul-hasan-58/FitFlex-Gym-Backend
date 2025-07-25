import { userRole } from '@prisma/client';
import { z } from 'zod';

export const registerUserZodSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.literal(userRole.Trainee, {
        error: 'Only Trainee role is allowed for registration',
    }).optional(),
}).strict();

export const loginUserZodSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string('Password not given'),
}).strict();

export const changePasswordZodSchema = z.object({
    oldPassword: z.string('Old password not given'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
}).strict();