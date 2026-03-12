import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/booking.model";
import { Bus } from "../models/bus.model";

export const createBooking = async (

  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  try {
    const { busId, seats, passengerDetails } = req.body;

    if (!busId || !seats?.length || !passengerDetails?.length) {
      res.status(400).json({
        message: "busId, seats and passengerDetails are required",
      });
      return;
    }

    if(seats.length !== passengerDetails.length) {
      res.status(400).json({
        message: "Number of seats must match number of passengers"
      });
      return;
    }


    const bus = await Bus.findById(busId);
    if (!bus) {
      res.status(404).json({
        message: "Bus not found"
      });
      return;
    }


    const unavailable: number[] = [];
    for (const seatNum of seats) {
      const seat = bus.seats.find((s) => s.seatNumber === seatNum);
      if (!seat || !seat.isAvailable) {
        unavailable.push(seatNum);
      }
    }


    if(unavailable.length > 0) {
      res.status(409).json({
        message: "Some seats are not available",
        unavailableSeats: unavailable,
      });
      return;
    }


    let bookedCount = 0;
    for (const seat of bus.seats) {
      if (seats.includes(seat.seatNumber)) {
        seat.isAvailable = false;
        seat.isReserved = false;
        seat.reservedUntil = undefined;
        bookedCount++;

      }
    }

    bus.availableSeats = Math.max(0, bus.availableSeats - bookedCount);
    await bus.save();

    
    const passengers = passengerDetails.map((p: any, i: number) => ({
      ...p,
      seatNumber: seats[i],
    }));

   
    const booking = await Booking.create({
      busId: bus._id,
      seatsBooked: seats,
      passengers,
      totalPrice: bus.price * seats.length,
      status: "confirmed",
    });

    res.status(201).json({
      message: "Booking successful",
      id: booking._id.toString(),
      seatsBooked: booking.seatsBooked,
      totalPrice: booking.totalPrice,
    });

    } catch (error) {
    next(error);
  } 
};