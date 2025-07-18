import { Router } from "express";
import { bookingController } from "./booking.controller";
import validateRequest from "../../utils/validateRequest";
import { bookingZodSchema } from "./booking.validation";
import roleGured from "../../middlewares/roleGured";
import { userRole } from "../../../generated/prisma";

const router = Router();

router.post(
    "/book-class-schedule",
    validateRequest(bookingZodSchema),
    roleGured(userRole.Trainee),
    bookingController.bookClassSchedule
);

export const bookingRoutes = router;