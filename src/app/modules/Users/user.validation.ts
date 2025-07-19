import { userRole } from '@prisma/client';
import { z } from 'zod';

export const createTrainerZodSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),

}).strict();

export const updateTrainerZodSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),

}).strict();
export const updateUserZodSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.literal(userRole.Trainee, {
        error: 'Only Trainee role is allowed for registration',
    }).optional(),
}).strict();