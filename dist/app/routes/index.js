"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/Users/user.routes");
const classSchedules_routes_1 = require("../modules/ClassSchedules/classSchedules.routes");
const booking_routes_1 = require("../modules/Bookings/booking.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/class-schedules",
        route: classSchedules_routes_1.classSchedulesRoutes,
    },
    {
        path: "/bookings",
        route: booking_routes_1.bookingRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
