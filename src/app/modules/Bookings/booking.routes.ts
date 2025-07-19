import { Router } from "express";
import { bookingController } from "./booking.controller";
import validateRequest from "../../utils/validateRequest";
import { bookingZodSchema } from "./booking.validation";
import roleGured from "../../middlewares/roleGured";
import AdminGuard from "../../middlewares/AdminGuard";
import { userRole } from "@prisma/client";

const router = Router();

router.post(
    "/book-class-schedule",
    validateRequest(bookingZodSchema),
    roleGured(userRole.Trainee),
    bookingController.bookClassSchedule
);
router.get(
    "/all-bookings",
    AdminGuard,
    bookingController.getAllBookings
);
router.get(
    "/my-bookings",
    roleGured(userRole.Trainee),
    bookingController.getMyBookings
);

export const bookingRoutes = router;