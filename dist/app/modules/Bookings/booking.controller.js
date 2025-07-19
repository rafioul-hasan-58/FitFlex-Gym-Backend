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
exports.bookingController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("./booking.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const booking_constant_1 = require("../../constant/booking.constant");
const pagination_constant_1 = require("../../constant/pagination.constant");
const bookClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.bookingServices.bookClassSchedule(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Class schedule booked successfully",
        Data: result,
    });
}));
const getAllBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingFilters = (0, pick_1.default)(req.query, booking_constant_1.bookingFilterAbleFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_constant_1.paginationQueries);
    const result = yield booking_service_1.bookingServices.getAllBookings(bookingFilters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All bookings fetched successfully",
        Data: result,
    });
}));
const getMyBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingFilters = (0, pick_1.default)(req.query, booking_constant_1.bookingFilterAbleFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_constant_1.paginationQueries);
    const result = yield booking_service_1.bookingServices.getMyBookings(bookingFilters, paginationOptions, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My booking fetched successfully",
        Data: result,
    });
}));
exports.bookingController = {
    bookClassSchedule,
    getMyBookings,
    getAllBookings
};
