import { Request, Response, NextFunction } from "express";
import { Bus } from "../models/bus.model";
import { generateSeatLayout, getDepartureSlots } from "../utils/seatLayout";

export const getBuses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
        departureCity,
        arrivalCity,
        date,
        seatType,
        isAXC,
        departureTime
    }= req.query as Record<string, string>;

    if(!departureCity || !arrivalCity || !date) {
        res.status(400).json({
            message: "departureCity, arrivalCity and date are required"
        });
        return;
    }

    res.status(200).json({
      message: "Buses fetched successfully",
      buses,
    });


  } catch (error) {
    next(error);
  }
};
