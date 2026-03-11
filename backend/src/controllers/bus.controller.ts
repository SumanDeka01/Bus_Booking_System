import { Request, Response, NextFunction } from "express";
import { Bus } from "../models/bus.model";

export const getBuses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const buses = await Bus.find();

    res.status(200).json({
      message: "Buses fetched successfully",
      buses,
    });
  } catch (error) {
    next(error);
  }
};
