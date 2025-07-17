import { NextFunction, Request, Response } from "express";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../utils/prismaClient";

const roleGured = (...userRoles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("You are not Authorized");
      }
      const decodedUser = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      if (userRoles.length && !userRoles.includes(decodedUser.role)) {
        throw new Error("Forbidden");
      }
      req.user = decodedUser;
      const isUserExists = await prisma.user.findUnique({
        where: {
          email: decodedUser.email,
        },
      });
      if (!isUserExists) {
        throw new Error("User not exists in auth");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default roleGured;
