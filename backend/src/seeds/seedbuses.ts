import "dotenv/config";
import mongoose from "mongoose";
import { Bus } from "../models/bus.model";
import { Booking } from "../models/booking.model";
import { buses } from "./data/buses";

const generateSeats = (totalSeats: number, seatType: string) => {
  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    const row = Math.ceil(i / 4);
    const colIndex = (i - 1) % 4;
    seats.push({
      seatNumber: i,
      isAvailable: true,
      isReserved: false,
      row,
      column: colIndex + 1,
      seatType,
      sleeperLevel:
        seatType === "sleeper"
          ? colIndex % 2 === 0
            ? "lower"
            : "upper"
          : undefined,
    });
  }
  return seats;
};

const seed = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in .env");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Bus.deleteMany({});
  await Booking.deleteMany({});
  console.log("Cleared existing data");

  for (const bus of buses) {
    const seats = generateSeats(bus.totalSeats, bus.seatTypes[0]);

    await Bus.create({
      name: bus.name,
      departureCity: bus.departureCity,
      arrivalCity: bus.arrivalCity,
      date: bus.date,
      stops: [
        {
          stopName: bus.departureCity,
          departureTime: bus.departureTime,
        },
        ...bus.stops.map((stop) => ({
          stopName: stop.stopName,
          arrivalTime: stop.arrivalTime,
          departureTime: stop.arrivalTime,
        })),
        {
          stopName: bus.arrivalCity,
          arrivalTime: bus.arrivalTime,
        },
      ],
      availableSeats: bus.totalSeats,
      totalSeats: bus.totalSeats,
      price: bus.price,
      seatTypes: bus.seatTypes,
      isAC: bus.isAC,
      seats,
    });

    console.log(
      `Seeded: ${bus.name} (${bus.departureCity} to ${bus.arrivalCity})`
    );
  }

  console.log(`\nDone! ${buses.length} buses seeded.`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});