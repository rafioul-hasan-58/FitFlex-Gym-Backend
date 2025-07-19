import { Router } from "express";
import { AuthController } from "./auth.controller";
import roleGured from "../../middlewares/roleGured";
import validateRequest from "../../utils/validateRequest";
import { changePasswordZodSchema,  loginUserZodSchema, registerUserZodSchema } from "./auth.validation";
import { userRole } from "@prisma/client";

const router = Router();

router.post(
    "/register",
    validateRequest(registerUserZodSchema),
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
router.patch(
    "/change-password",
    validateRequest(changePasswordZodSchema),
    roleGured(userRole.Admin, userRole.Trainee, userRole.Trainer),
    AuthController.changePassword
);
export const AuthRoutes = router;