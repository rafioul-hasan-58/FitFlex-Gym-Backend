import { Response } from "express";

const sendResponse = <T>(
    res: Response,
    jsonData: {
        statusCode: number;
        success: boolean;
        message: string;
        Data: T | null | undefined;
    }
) => {
    res.status(jsonData.statusCode).json({
        success: jsonData.success,
        message: jsonData.message,
        statusCode: jsonData.statusCode,
        Data: jsonData.Data || null || undefined,
    });
};

export default sendResponse;
