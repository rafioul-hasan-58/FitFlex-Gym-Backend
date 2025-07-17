import { Router } from "express";
import { userController } from "./user.controller";
import { validateHeaderName } from "http";
import validateRequest from "../../utils/validateRequest";
import { createTrainerZodSchema } from "./user.validation";

const router = Router();

router.post(
    "/create-trainer",
    validateRequest(createTrainerZodSchema),
    userController.createTrainer
);

export const userRoutes = router;