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
const router = (0, express_1.Router)();
router.post("/create-trainer", AdminGuard_1.default, (0, validateRequest_1.default)(user_validation_1.createTrainerZodSchema), user_controller_1.userController.createTrainer);
exports.userRoutes = router;
