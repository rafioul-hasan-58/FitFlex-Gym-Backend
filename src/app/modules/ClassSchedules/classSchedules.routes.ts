import { Router } from "express";
import validateRequest from "../../utils/validateRequest";
import AdminGuard from "../../middlewares/AdminGuard";
import { addClassScheduleZodSchema } from "./classSchedules.validations";
import { classSchedulesController } from "./classSchedules.controller";
import roleGured from "../../middlewares/roleGured";
import { userRole } from "../../../generated/prisma";

const router = Router();


router.post(
    '/add-class-schedule',
    AdminGuard,
    validateRequest(addClassScheduleZodSchema),
    classSchedulesController.addClassSchedule
);
router.get(
    '/get-all-schedule',
    AdminGuard,
    classSchedulesController.getAllSchedule
)
router.get(
    '/get-trainer-schedule',
    roleGured(userRole.Trainer),
    classSchedulesController.getTrainerSchedule
)
export const classSchedulesRoutes = router;