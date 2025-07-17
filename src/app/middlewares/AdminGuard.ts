import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../utils/prismaClient";
import AppError from "../errors/AppError";
import status from "http-status";
const AdminGuard = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token) throw new AppError(status.NOT_FOUND, "Token not found");

    const decoded = jwt.verify(token, config.jwt_access_secret!) as JwtPayload;

    if (decoded.role !== "Admin") throw new AppError(status.NOT_FOUND, 'Unauthorized access.')

    const userExists = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!userExists) throw new Error("User not found");

    req.user = decoded;
    next();
  } catch (err) {
    res.status(status.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access.",
      statusCode: status.UNAUTHORIZED,
      errorDetails: "You must be an admin to perform this action."
    });
  }
};

export default AdminGuard;
