import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import {  createTrainerZodSchema } from "./user.validation";
import AdminGuard from "../../middlewares/AdminGuard";

const router = Router();

router.post(
    "/create-trainer",
    AdminGuard,
    validateRequest(createTrainerZodSchema),
    userController.createTrainer
);

export const userRoutes = router;