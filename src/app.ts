import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app: Application = express();
import status from "http-status";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandlar";

app.use(
  cors()
);
app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "FitFlex-Gym Server Is Running",
  });
});
// all routes
app.use("/api", router);

// global error handler
app.use(globalErrorHandler);

// not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API not found",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found",
    },
  });
});

export default app;