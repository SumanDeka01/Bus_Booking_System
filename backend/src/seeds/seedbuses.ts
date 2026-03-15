import "dotenv/config";
import mongoose from "mongoose";
import { Bus } from "../models/bus.model";
import { Booking } from "../models/booking.model";

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
          ? colIndex % 2 === 0 ? "lower" : "upper"
          : null,
    });
  }
  return seats;
};

const busData = [
  {
    name: "ASTC Volvo AC Sleeper",
    departureCity: "Guwahati",
    arrivalCity: "Dibrugarh",
    date: "2026-03-25",
    stops: [
      { stopName: "Guwahati", departureTime: "08:30 PM" },
      { stopName: "Nagaon", arrivalTime: "11:00 PM", departureTime: "11:15 PM" },
      { stopName: "Golaghat", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Dibrugarh", arrivalTime: "06:30 AM" },
    ],
    totalSeats: 36,
    price: 1350,
    seatType: "sleeper",
    isAC: true,
  },
  {
    name: "Brahmaputra Non AC Seater",
    departureCity: "Guwahati",
    arrivalCity: "Silchar",
    date: "2026-03-25",
    stops: [
      { stopName: "Guwahati", departureTime: "07:00 AM" },
      { stopName: "Nagaon", arrivalTime: "09:00 AM", departureTime: "09:15 AM" },
      { stopName: "Hojai", arrivalTime: "10:30 AM", departureTime: "10:45 AM" },
      { stopName: "Silchar", arrivalTime: "04:00 PM" },
    ],
    totalSeats: 40,
    price: 850,
    seatType: "normal",
    isAC: false,
  },
  {
    name: "Jonaki Sleeper Deluxe",
    departureCity: "Guwahati",
    arrivalCity: "Jorhat",
    date: "2026-03-26",
    stops: [
      { stopName: "Guwahati", departureTime: "09:00 PM" },
      { stopName: "Tezpur", arrivalTime: "11:30 PM", departureTime: "11:45 PM" },
      { stopName: "Jorhat", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 36,
    price: 1100,
    seatType: "sleeper",
    isAC: true,
  },
  {
    name: "Northeast Express",
    departureCity: "Guwahati",
    arrivalCity: "Tezpur",
    date: "2026-03-27",
    stops: [
      { stopName: "Guwahati", departureTime: "09:30 AM" },
      { stopName: "Mangaldoi", arrivalTime: "11:30 AM", departureTime: "11:45 AM" },
      { stopName: "Tezpur", arrivalTime: "02:00 PM" },
    ],
    totalSeats: 40,
    price: 450,
    seatType: "normal",
    isAC: false,
  },
  {
    name: "VRL Travels AC Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Chennai",
    date: "2026-03-25",
    stops: [
      { stopName: "Bangalore", departureTime: "10:45 PM" },
      { stopName: "Hosur", arrivalTime: "11:45 PM", departureTime: "12:00 AM" },
      { stopName: "Vellore", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Chennai", arrivalTime: "05:30 AM" },
    ],
    totalSeats: 36,
    price: 980,
    seatType: "sleeper",
    isAC: true,
  },
  {
    name: "SRS Travels Seater",
    departureCity: "Bangalore",
    arrivalCity: "Chennai",
    date: "2026-03-26",
    stops: [
      { stopName: "Bangalore", departureTime: "08:00 AM" },
      { stopName: "Krishnagiri", arrivalTime: "10:30 AM", departureTime: "10:45 AM" },
      { stopName: "Chennai", arrivalTime: "02:00 PM" },
    ],
    totalSeats: 40,
    price: 650,
    seatType: "normal",
    isAC: true,
  },
  {
    name: "Orange Travels Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Hyderabad",
    date: "2026-03-25",
    stops: [
      { stopName: "Bangalore", departureTime: "09:30 PM" },
      { stopName: "Anantapur", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Hyderabad", arrivalTime: "07:00 AM" },
    ],
    totalSeats: 36,
    price: 1250,
    seatType: "sleeper",
    isAC: true,
  },
  {
    name: "Kerala Lines AC Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Kochi",
    date: "2026-03-26",
    stops: [
      { stopName: "Bangalore", departureTime: "08:30 PM" },
      { stopName: "Salem", arrivalTime: "01:00 AM", departureTime: "01:15 AM" },
      { stopName: "Coimbatore", arrivalTime: "04:00 AM", departureTime: "04:15 AM" },
      { stopName: "Kochi", arrivalTime: "06:30 AM" },
    ],
    totalSeats: 36,
    price: 1150,
    seatType: "sleeper",
    isAC: true,
  },
  {
    name: "KSRTC Superfast",
    departureCity: "Kochi",
    arrivalCity: "Trivandrum",
    date: "2026-03-27",
    stops: [
      { stopName: "Kochi", departureTime: "06:30 AM" },
      { stopName: "Alappuzha", arrivalTime: "08:30 AM", departureTime: "08:45 AM" },
      { stopName: "Trivandrum", arrivalTime: "11:00 AM" },
    ],
    totalSeats: 40,
    price: 520,
    seatType: "normal",
    isAC: false,
  },
  {
    name: "KPN Travels Sleeper",
    departureCity: "Chennai",
    arrivalCity: "Bangalore",
    date: "2026-03-25",
    stops: [
      { stopName: "Chennai", departureTime: "11:30 PM" },
      { stopName: "Vellore", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Bangalore", arrivalTime: "06:00 AM" },
    ],
    totalSeats: 36,
    price: 900,
    seatType: "sleeper",
    isAC: true,
  },
];

const seed = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in .env");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Bus.deleteMany({});
  await Booking.deleteMany({});
  console.log("Cleared existing data");

  for (const data of busData) {
    const seats = generateSeats(data.totalSeats, data.seatType);

    await Bus.create({
      name: data.name,
      departureCity: data.departureCity,
      arrivalCity: data.arrivalCity,
      date: data.date,
      stops: data.stops,
      totalSeats: data.totalSeats,
      availableSeats: data.totalSeats,
      price: data.price,
      seatTypes: [data.seatType],
      isAC: data.isAC,
      seats,
    });

    console.log(`Seeded: ${data.name}`);
  }

  console.log(`\nDone! ${busData.length} buses seeded.`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

export { seed as seedBuses };