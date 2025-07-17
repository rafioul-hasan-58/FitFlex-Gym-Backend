import { Router } from "express";
import validateRequest from "../../utils/validateRequest";
import AdminGuard from "../../middlewares/AdminGuard";
import { addClassScheduleZodSchema } from "./classSchedules.validations";
import { classSchedulesController } from "./classSchedules.controller";

const router = Router();


router.post(
    '/add-class-schedule',
    AdminGuard,
    validateRequest(addClassScheduleZodSchema),
    classSchedulesController.addClassSchedule
);
export const classSchedulesRoutes = router;