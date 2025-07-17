import { Router } from "express";
import { AuthController } from "./auth.controller";
import roleGured from "../../middlewares/roleGured";
import { userRole } from "../../../generated/prisma";

const router = Router();

router.post(
    "/register",
    AuthController.registerUser
);
router.post(
    "/login",
    AuthController.login
);
router.post(
    "/refresh-token",
    AuthController.refreshToken
);
router.post(
    "/change-password",
    roleGured(userRole.Admin, userRole.Trainee, userRole.Trainer),
    AuthController.changePassword
);
export const AuthRoutes = router;