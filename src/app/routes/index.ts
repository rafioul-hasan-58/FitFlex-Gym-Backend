import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { userRoutes } from "../modules/Users/user.routes";
import { classSchedulesRoutes } from "../modules/ClassSchedules/classSchedules.routes";
import { bookingRoutes } from "../modules/Bookings/booking.routes";

const router = Router();

const moduleRoutes: any = [

    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/users",
        route: userRoutes,
    },
    {
        path: "/class-schedules",
        route: classSchedulesRoutes,
    },
    {
        path: "/bookings",
        route: bookingRoutes
    }
];

moduleRoutes.forEach((route: any) => router.use(route.path, route.route));

export default router;
