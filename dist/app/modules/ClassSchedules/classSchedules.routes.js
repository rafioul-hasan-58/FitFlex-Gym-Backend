"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classSchedulesRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const AdminGuard_1 = __importDefault(require("../../middlewares/AdminGuard"));
const classSchedules_validations_1 = require("./classSchedules.validations");
const classSchedules_controller_1 = require("./classSchedules.controller");
const roleGured_1 = __importDefault(require("../../middlewares/roleGured"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.post('/add-class-schedule', AdminGuard_1.default, (0, validateRequest_1.default)(classSchedules_validations_1.addClassScheduleZodSchema), classSchedules_controller_1.classSchedulesController.addClassSchedule);
router.get('/get-all-schedule', AdminGuard_1.default, classSchedules_controller_1.classSchedulesController.getAllSchedule);
router.get('/get-trainer-schedule', (0, roleGured_1.default)(client_1.userRole.Trainer), classSchedules_controller_1.classSchedulesController.getTrainerSchedule);
exports.classSchedulesRoutes = router;
