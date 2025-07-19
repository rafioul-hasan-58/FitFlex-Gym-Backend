"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classSchedulesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const classSchedules_service_1 = require("./classSchedules.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../utils/pick"));
const pagination_constant_1 = require("../../constant/pagination.constant");
const classSchedule_constant_1 = require("../../constant/classSchedule.constant");
const addClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield classSchedules_service_1.classSchedulesService.addClassSchedule(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Class schedule added successfully",
        Data: result,
    });
}));
const getAllClassSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classScheduleFilters = (0, pick_1.default)(req.query, classSchedule_constant_1.classScheduleFilterAbleFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_constant_1.paginationQueries);
    const result = yield classSchedules_service_1.classSchedulesService.getAllClassSchedules(classScheduleFilters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All ClassSchedule fetched successfully",
        Data: result,
    });
}));
const getTrainerSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classScheduleFilters = (0, pick_1.default)(req.query, classSchedule_constant_1.classScheduleFilterAbleFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_constant_1.paginationQueries);
    const result = yield classSchedules_service_1.classSchedulesService.getTrainerSchedules(classScheduleFilters, paginationOptions, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Schedule fetched successfully",
        Data: result,
    });
}));
const getClassScheduleById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield classSchedules_service_1.classSchedulesService.getClassScheduleById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule fetched successfully",
        Data: result,
    });
}));
const updateClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield classSchedules_service_1.classSchedulesService.updateClassSchedule(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule updated successfully",
        Data: result,
    });
}));
const deleteClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield classSchedules_service_1.classSchedulesService.deleteClassSchedule(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule deleted successfully",
        Data: result,
    });
}));
exports.classSchedulesController = {
    addClassSchedule,
    getTrainerSchedules,
    getAllClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule
};
