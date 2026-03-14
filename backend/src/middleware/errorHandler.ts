import { Request, Response , NextFunction} from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || "server error",
    })
};