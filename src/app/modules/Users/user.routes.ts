import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../utils/validateRequest";
import { createTrainerZodSchema, updateTrainerZodSchema, updateUserZodSchema } from "./user.validation";
import AdminGuard from "../../middlewares/AdminGuard";
import roleGured from "../../middlewares/roleGured";
import { userRole } from "@prisma/client";

const router = Router();
// trainer releted routes
router.post(
    "/create-trainer",
    AdminGuard,
    validateRequest(createTrainerZodSchema),
    userController.createTrainer
);
router.patch(
    "/update-trainer/:id",
    AdminGuard,
    validateRequest(updateTrainerZodSchema),
    userController.updateTrainer
);
router.delete(
    "/delete-trainer/:id",
    AdminGuard,
    userController.deleteTrainer
);
// trainee & admin releted routes
router.get(
    "/my-profile",
    roleGured(userRole.Admin, userRole.Trainee),
    userController.getMyProfile
);
router.patch(
    "/update-my-profile",
    roleGured(userRole.Admin, userRole.Trainee),
    validateRequest(updateUserZodSchema),
    userController.updateMyProfile
);


export const userRoutes = router;