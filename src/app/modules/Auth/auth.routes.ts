import { Router } from "express";
import { AuthController } from "./auth.controller";
import roleGured from "../../middlewares/roleGured";
import { userRole } from "../../../generated/prisma";
import validateRequest from "../../utils/validateRequest";
import { changePasswordZodSchema, createUserZodSchema, loginUserZodSchema } from "./auth.validation";

const router = Router();

router.post(
    "/register",
    validateRequest(createUserZodSchema),
    AuthController.registerUser
);
router.post(
    "/login",
    validateRequest(loginUserZodSchema),
    AuthController.login
);
router.post(
    "/refresh-token",
    AuthController.refreshToken
);
router.post(
    "/change-password",
    validateRequest(changePasswordZodSchema),
    roleGured(userRole.Admin, userRole.Trainee, userRole.Trainer),
    AuthController.changePassword
);
export const AuthRoutes = router;