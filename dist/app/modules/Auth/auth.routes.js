"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const roleGured_1 = __importDefault(require("../../middlewares/roleGured"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.default)(auth_validation_1.registerUserZodSchema), auth_controller_1.AuthController.registerUser);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.loginUserZodSchema), auth_controller_1.AuthController.login);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
router.patch("/change-password", (0, validateRequest_1.default)(auth_validation_1.changePasswordZodSchema), (0, roleGured_1.default)(client_1.userRole.Admin, client_1.userRole.Trainee, client_1.userRole.Trainer), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
