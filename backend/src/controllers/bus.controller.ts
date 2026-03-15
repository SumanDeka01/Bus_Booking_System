import { Request, Response, NextFunction } from "express";
import { Bus } from "../models/bus.model";
import { getDepartureSlots } from "../utils/seatLayout";

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
      isAC,
      departureSlot,
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string>;

    if (!departureCity || !arrivalCity || !date) {
      res.status(400).json({
        message: "departureCity, arrivalCity and date are required",
      });
      return;
    }

    
    const query: any = {
      departureCity: { $regex: new RegExp(`^${departureCity}$`, "i") },
      arrivalCity: { $regex: new RegExp(`^${arrivalCity}$`, "i") },
      date, 
    };

   
    if (seatType) query.seatTypes = { $in: [seatType] };
    if (isAC !== undefined) query.isAC = isAC === "true";

    
    let buses = await Bus.find(query).select("-seats").lean();

    
    if (departureSlot) {
      buses = buses.filter((bus) => {
        const firstStop = bus.stops[0];
        if (!firstStop?.departureTime) return false;
        return (
          getDepartureSlots(firstStop.departureTime) ===
          departureSlot.toLowerCase()
        );
      });
    }

    // pagination
    const pageNum = Math.max(1, parseInt(page));
    const pageSizeNum = Math.min(50, Math.max(1, parseInt(pageSize)));
    const skip = (pageNum - 1) * pageSizeNum;
    const totalBuses = buses.length;
    const totalPages = Math.ceil(totalBuses / pageSizeNum);
    const paginated = buses.slice(skip, skip + pageSizeNum);

    res.status(200).json({
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages,
      totalBuses,
      buses: paginated.map((bus) => ({
        id: bus._id.toString(),
        name: bus.name,
        stops: bus.stops,
        availableSeats: bus.availableSeats,
        price: bus.price,
        seatTypes: bus.seatTypes,
        isAC: bus.isAC,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getBusById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId).lean();

    if (!bus) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }

    const now = new Date();

    const seats = bus.seats.map((seat) => {
      const expired =
        seat.isReserved && seat.reservedUntil && seat.reservedUntil < now;
      if (expired) {
        return { ...seat, isReserved: false, reservedUntil: null };
      }
      return seat;
    });

    res.status(200).json({
      id: bus._id.toString(),
      name: bus.name,
      availableSeats: bus.availableSeats,
      price: bus.price,
      seatTypes: bus.seatTypes,
      isAC: bus.isAC,
      stops: bus.stops,
      seats: seats.map((seat) => ({
        seatNumber: seat.seatNumber,
        isAvailable: seat.isAvailable && !seat.isReserved,
        row: seat.row,
        column: seat.column,
        seatType: seat.seatType,
        ...(seat.sleeperLevel && { sleeperLevel: seat.sleeperLevel }),
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const reserveSeats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { busId } = req.params;
    const { seats }: { seats: number[] } = req.body;

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      res.status(400).json({ message: "seats array is required" });
      return;
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }

    const now = new Date();
    const ttl = parseInt(process.env.SEAT_RESERVATION_TTL || "120000");
    const reservedUntil = new Date(now.getTime() + ttl);

    const unavailable: number[] = [];
    for (const seatNum of seats) {
      const seat = bus.seats.find((s) => s.seatNumber === seatNum);
      if (!seat || !seat.isAvailable) {
        unavailable.push(seatNum);
        continue;
      }
      const activeReservation =
        seat.isReserved && seat.reservedUntil && seat.reservedUntil > now;
      if (activeReservation) {
        unavailable.push(seatNum);
      }
    }

    if (unavailable.length > 0) {
      res.status(409).json({
        message: "Some seats are not available",
        unavailableSeats: unavailable,
      });
      return;
    }

    for (const seat of bus.seats) {
      if (seats.includes(seat.seatNumber)) {
        seat.isReserved = true;
        seat.reservedUntil = reservedUntil;
      }
    }

    await bus.save();

    res.status(200).json({
      message: "Seats reserved for 2 minutes",
      reservedUntil,
      seats,
    });
  } catch (error) {
    next(error);
  }
};
