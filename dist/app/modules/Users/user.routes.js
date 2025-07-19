"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const user_validation_1 = require("./user.validation");
const AdminGuard_1 = __importDefault(require("../../middlewares/AdminGuard"));
const roleGured_1 = __importDefault(require("../../middlewares/roleGured"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
// trainer releted routes
router.post("/create-trainer", AdminGuard_1.default, (0, validateRequest_1.default)(user_validation_1.createTrainerZodSchema), user_controller_1.userController.createTrainer);
router.patch("/update-trainer/:id", AdminGuard_1.default, (0, validateRequest_1.default)(user_validation_1.updateTrainerZodSchema), user_controller_1.userController.updateTrainer);
router.delete("/delete-trainer/:id", AdminGuard_1.default, user_controller_1.userController.deleteTrainer);
// trainee & admin releted routes
router.get("/my-profile", (0, roleGured_1.default)(client_1.userRole.Admin, client_1.userRole.Trainee), user_controller_1.userController.getMyProfile);
router.patch("/update-my-profile", (0, roleGured_1.default)(client_1.userRole.Admin, client_1.userRole.Trainee), (0, validateRequest_1.default)(user_validation_1.updateUserZodSchema), user_controller_1.userController.updateMyProfile);
exports.userRoutes = router;
