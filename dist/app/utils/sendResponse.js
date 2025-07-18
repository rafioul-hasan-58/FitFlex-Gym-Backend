"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, jsonData) => {
    res.status(jsonData.statusCode).json({
        success: jsonData.success,
        message: jsonData.message,
        statusCode: jsonData.statusCode,
        Data: jsonData.Data || null || undefined,
    });
};
exports.default = sendResponse;
