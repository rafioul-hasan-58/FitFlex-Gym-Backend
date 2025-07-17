import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";

const router = Router();

const moduleRoutes: any = [

    {
        path: "/auth",
        route: AuthRoutes,
    }
];

moduleRoutes.forEach((route: any) => router.use(route.path, route.route));

export default router;
