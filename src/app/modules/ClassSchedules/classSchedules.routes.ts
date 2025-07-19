import { Router } from "express";
import validateRequest from "../../utils/validateRequest";
import AdminGuard from "../../middlewares/AdminGuard";
import { addClassScheduleZodSchema, updateClassScheduleZodSchema } from "./classSchedules.validations";
import { classSchedulesController } from "./classSchedules.controller";
import roleGured from "../../middlewares/roleGured";
import { userRole } from "@prisma/client";

const router = Router();


router.post(
    '/add-class-schedule',
    AdminGuard,
    validateRequest(addClassScheduleZodSchema),
    classSchedulesController.addClassSchedule
);
router.get(
    '/get-all-class-schedules',
    roleGured(userRole.Admin,userRole.Trainee),
    classSchedulesController.getAllClassSchedules
);
router.get(
    '/get-trainer-schedules',
    roleGured(userRole.Trainer),
    classSchedulesController.getTrainerSchedules
);
router.get(
    '/get-class-schedule/:id',
    roleGured(userRole.Trainer, userRole.Admin, userRole.Trainee),
    classSchedulesController.getClassScheduleById
);
router.patch(
    '/update-class-schedule/:id',
    AdminGuard,
    validateRequest(updateClassScheduleZodSchema),
    classSchedulesController.updateClassSchedule
);
router.delete(
    '/delete-class-schedule/:id',
    AdminGuard,
    classSchedulesController.deleteClassSchedule
);
export const classSchedulesRoutes = router;