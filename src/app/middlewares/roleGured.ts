import { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../utils/prismaClient";
import AppError from "../errors/AppError";
import status from "http-status";

const roleGured = (...userRoles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(status.NOT_FOUND, "Your token is missing");
      }
      const decodedUser = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      if (userRoles.length && !userRoles.includes(decodedUser.role)) {
        throw new AppError(status.UNAUTHORIZED, "You are not authorized to access this route");
      }
      req.user = decodedUser;
      const isUserExists = await prisma.user.findUnique({
        where: {
          email: decodedUser.email,
        },
      });
      if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "User not exists in auth");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default roleGured;
