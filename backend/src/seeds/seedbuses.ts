import "dotenv/config";
import mongoose from "mongoose";
import { Bus } from "../models/bus.model";
import { Booking } from "../models/booking.model";

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

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

const generateDates = (): string[] => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const busTemplates = [
  // Bangalore → Hyderabad
  {
    name: "Orange Travels AC Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Hyderabad",
    stops: [
      { stopName: "Bangalore", departureTime: "09:00 PM" },
      { stopName: "Kurnool", arrivalTime: "02:00 AM", departureTime: "02:15 AM" },
      { stopName: "Hyderabad", arrivalTime: "07:00 AM" },
    ],
    totalSeats: 36, price: 1250, seatType: "sleeper", isAC: true,
  },
  {
    name: "VRL Travels Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Hyderabad",
    stops: [
      { stopName: "Bangalore", departureTime: "08:00 PM" },
      { stopName: "Anantapur", arrivalTime: "11:30 PM", departureTime: "11:45 PM" },
      { stopName: "Hyderabad", arrivalTime: "06:00 AM" },
    ],
    totalSeats: 40, price: 1100, seatType: "sleeper", isAC: true,
  },
  {
    name: "SRS Travels Semi Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Hyderabad",
    stops: [
      { stopName: "Bangalore", departureTime: "07:30 PM" },
      { stopName: "Kurnool", arrivalTime: "01:00 AM", departureTime: "01:15 AM" },
      { stopName: "Hyderabad", arrivalTime: "06:30 AM" },
    ],
    totalSeats: 40, price: 950, seatType: "semi-sleeper", isAC: true,
  },
  {
    name: "KSRTC Airavat Bangalore Hyd",
    departureCity: "Bangalore",
    arrivalCity: "Hyderabad",
    stops: [
      { stopName: "Bangalore", departureTime: "10:00 PM" },
      { stopName: "Anantapur", arrivalTime: "01:30 AM", departureTime: "01:45 AM" },
      { stopName: "Hyderabad", arrivalTime: "07:30 AM" },
    ],
    totalSeats: 44, price: 800, seatType: "normal", isAC: false,
  },
  {
    name: "Paulo Travels Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Hyderabad",
    stops: [
      { stopName: "Bangalore", departureTime: "06:00 PM" },
      { stopName: "Kurnool", arrivalTime: "11:00 PM", departureTime: "11:15 PM" },
      { stopName: "Hyderabad", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 36, price: 1350, seatType: "sleeper", isAC: true,
  },

  // Hyderabad → Mumbai
  {
    name: "Orange Travels Hyd Mumbai",
    departureCity: "Hyderabad",
    arrivalCity: "Mumbai",
    stops: [
      { stopName: "Hyderabad", departureTime: "05:00 PM" },
      { stopName: "Solapur", arrivalTime: "11:00 PM", departureTime: "11:15 PM" },
      { stopName: "Pune", arrivalTime: "03:00 AM", departureTime: "03:15 AM" },
      { stopName: "Mumbai", arrivalTime: "07:00 AM" },
    ],
    totalSeats: 36, price: 1450, seatType: "sleeper", isAC: true,
  },
  {
    name: "VRL Mumbai Express",
    departureCity: "Hyderabad",
    arrivalCity: "Mumbai",
    stops: [
      { stopName: "Hyderabad", departureTime: "04:00 PM" },
      { stopName: "Solapur", arrivalTime: "10:00 PM", departureTime: "10:15 PM" },
      { stopName: "Mumbai", arrivalTime: "06:00 AM" },
    ],
    totalSeats: 40, price: 1300, seatType: "sleeper", isAC: true,
  },
  {
    name: "Neeta Travels Semi Sleeper",
    departureCity: "Hyderabad",
    arrivalCity: "Mumbai",
    stops: [
      { stopName: "Hyderabad", departureTime: "06:00 PM" },
      { stopName: "Solapur", arrivalTime: "12:00 AM", departureTime: "12:15 AM" },
      { stopName: "Pune", arrivalTime: "04:00 AM", departureTime: "04:15 AM" },
      { stopName: "Mumbai", arrivalTime: "08:00 AM" },
    ],
    totalSeats: 40, price: 1100, seatType: "semi-sleeper", isAC: true,
  },
  {
    name: "Konduskar Travels",
    departureCity: "Hyderabad",
    arrivalCity: "Mumbai",
    stops: [
      { stopName: "Hyderabad", departureTime: "03:00 PM" },
      { stopName: "Solapur", arrivalTime: "09:00 PM", departureTime: "09:15 PM" },
      { stopName: "Mumbai", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 44, price: 900, seatType: "normal", isAC: false,
  },
  {
    name: "Paulo Hyd Mumbai Sleeper",
    departureCity: "Hyderabad",
    arrivalCity: "Mumbai",
    stops: [
      { stopName: "Hyderabad", departureTime: "07:00 PM" },
      { stopName: "Pune", arrivalTime: "04:00 AM", departureTime: "04:15 AM" },
      { stopName: "Mumbai", arrivalTime: "08:30 AM" },
    ],
    totalSeats: 36, price: 1550, seatType: "sleeper", isAC: true,
  },

  // Guwahati → Dibrugarh
  {
    name: "ASTC Volvo AC Sleeper",
    departureCity: "Guwahati",
    arrivalCity: "Dibrugarh",
    stops: [
      { stopName: "Guwahati", departureTime: "08:30 PM" },
      { stopName: "Nagaon", arrivalTime: "11:00 PM", departureTime: "11:15 PM" },
      { stopName: "Golaghat", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Dibrugarh", arrivalTime: "06:30 AM" },
    ],
    totalSeats: 36, price: 1350, seatType: "sleeper", isAC: true,
  },
  {
    name: "Jonaki Night Rider",
    departureCity: "Guwahati",
    arrivalCity: "Dibrugarh",
    stops: [
      { stopName: "Guwahati", departureTime: "09:00 PM" },
      { stopName: "Nagaon", arrivalTime: "11:30 PM", departureTime: "11:45 PM" },
      { stopName: "Dibrugarh", arrivalTime: "07:00 AM" },
    ],
    totalSeats: 40, price: 1100, seatType: "semi-sleeper", isAC: true,
  },
  {
    name: "Brahmaputra Express Sleeper",
    departureCity: "Guwahati",
    arrivalCity: "Dibrugarh",
    stops: [
      { stopName: "Guwahati", departureTime: "07:00 PM" },
      { stopName: "Nagaon", arrivalTime: "09:30 PM", departureTime: "09:45 PM" },
      { stopName: "Jorhat", arrivalTime: "01:00 AM", departureTime: "01:15 AM" },
      { stopName: "Dibrugarh", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 36, price: 1200, seatType: "sleeper", isAC: true,
  },
  {
    name: "North East Travels",
    departureCity: "Guwahati",
    arrivalCity: "Dibrugarh",
    stops: [
      { stopName: "Guwahati", departureTime: "06:00 PM" },
      { stopName: "Nagaon", arrivalTime: "08:30 PM", departureTime: "08:45 PM" },
      { stopName: "Dibrugarh", arrivalTime: "04:00 AM" },
    ],
    totalSeats: 44, price: 900, seatType: "normal", isAC: false,
  },
  {
    name: "Assam Queen Deluxe",
    departureCity: "Guwahati",
    arrivalCity: "Dibrugarh",
    stops: [
      { stopName: "Guwahati", departureTime: "10:00 PM" },
      { stopName: "Nagaon", arrivalTime: "12:30 AM", departureTime: "12:45 AM" },
      { stopName: "Golaghat", arrivalTime: "03:30 AM", departureTime: "03:45 AM" },
      { stopName: "Dibrugarh", arrivalTime: "07:30 AM" },
    ],
    totalSeats: 40, price: 1050, seatType: "semi-sleeper", isAC: false,
  },

  // Bangalore → Kochi
  {
    name: "Kerala Lines AC Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Kochi",
    stops: [
      { stopName: "Bangalore", departureTime: "08:30 PM" },
      { stopName: "Salem", arrivalTime: "01:00 AM", departureTime: "01:15 AM" },
      { stopName: "Coimbatore", arrivalTime: "04:00 AM", departureTime: "04:15 AM" },
      { stopName: "Kochi", arrivalTime: "08:00 AM" },
    ],
    totalSeats: 36, price: 1150, seatType: "sleeper", isAC: true,
  },
  {
    name: "KSRTC Bangalore Kochi",
    departureCity: "Bangalore",
    arrivalCity: "Kochi",
    stops: [
      { stopName: "Bangalore", departureTime: "07:00 PM" },
      { stopName: "Salem", arrivalTime: "11:30 PM", departureTime: "11:45 PM" },
      { stopName: "Coimbatore", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Kochi", arrivalTime: "07:00 AM" },
    ],
    totalSeats: 44, price: 950, seatType: "normal", isAC: false,
  },
  {
    name: "Kallada Travels Sleeper",
    departureCity: "Bangalore",
    arrivalCity: "Kochi",
    stops: [
      { stopName: "Bangalore", departureTime: "09:30 PM" },
      { stopName: "Coimbatore", arrivalTime: "03:00 AM", departureTime: "03:15 AM" },
      { stopName: "Kochi", arrivalTime: "08:30 AM" },
    ],
    totalSeats: 36, price: 1300, seatType: "sleeper", isAC: true,
  },
  {
    name: "Paulo Travels Kochi",
    departureCity: "Bangalore",
    arrivalCity: "Kochi",
    stops: [
      { stopName: "Bangalore", departureTime: "06:00 PM" },
      { stopName: "Salem", arrivalTime: "10:30 PM", departureTime: "10:45 PM" },
      { stopName: "Coimbatore", arrivalTime: "01:30 AM", departureTime: "01:45 AM" },
      { stopName: "Kochi", arrivalTime: "06:30 AM" },
    ],
    totalSeats: 40, price: 1050, seatType: "semi-sleeper", isAC: true,
  },
  {
    name: "Parveen Kochi Express",
    departureCity: "Bangalore",
    arrivalCity: "Kochi",
    stops: [
      { stopName: "Bangalore", departureTime: "10:00 PM" },
      { stopName: "Coimbatore", arrivalTime: "04:00 AM", departureTime: "04:15 AM" },
      { stopName: "Kochi", arrivalTime: "09:00 AM" },
    ],
    totalSeats: 40, price: 1200, seatType: "sleeper", isAC: true,
  },

  // Bangalore → Chennai
  {
    name: "VRL Travels Chennai",
    departureCity: "Bangalore",
    arrivalCity: "Chennai",
    stops: [
      { stopName: "Bangalore", departureTime: "10:45 PM" },
      { stopName: "Hosur", arrivalTime: "11:45 PM", departureTime: "12:00 AM" },
      { stopName: "Vellore", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Chennai", arrivalTime: "05:30 AM" },
    ],
    totalSeats: 36, price: 980, seatType: "sleeper", isAC: true,
  },
  {
    name: "SRS Travels Chennai",
    departureCity: "Bangalore",
    arrivalCity: "Chennai",
    stops: [
      { stopName: "Bangalore", departureTime: "08:00 AM" },
      { stopName: "Krishnagiri", arrivalTime: "10:30 AM", departureTime: "10:45 AM" },
      { stopName: "Chennai", arrivalTime: "02:00 PM" },
    ],
    totalSeats: 40, price: 650, seatType: "normal", isAC: true,
  },
  {
    name: "KSRTC Airavat Chennai",
    departureCity: "Bangalore",
    arrivalCity: "Chennai",
    stops: [
      { stopName: "Bangalore", departureTime: "11:00 PM" },
      { stopName: "Vellore", arrivalTime: "02:00 AM", departureTime: "02:15 AM" },
      { stopName: "Chennai", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 44, price: 750, seatType: "normal", isAC: false,
  },
  {
    name: "Orange Tours Chennai",
    departureCity: "Bangalore",
    arrivalCity: "Chennai",
    stops: [
      { stopName: "Bangalore", departureTime: "09:00 PM" },
      { stopName: "Krishnagiri", arrivalTime: "11:30 PM", departureTime: "11:45 PM" },
      { stopName: "Chennai", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 36, price: 1100, seatType: "sleeper", isAC: true,
  },
  {
    name: "KPN Travels Chennai",
    departureCity: "Bangalore",
    arrivalCity: "Chennai",
    stops: [
      { stopName: "Bangalore", departureTime: "07:00 PM" },
      { stopName: "Hosur", arrivalTime: "08:00 PM", departureTime: "08:15 PM" },
      { stopName: "Chennai", arrivalTime: "01:00 AM" },
    ],
    totalSeats: 40, price: 850, seatType: "semi-sleeper", isAC: true,
  },

  // Chennai → Bangalore
  {
    name: "KPN Travels Bangalore",
    departureCity: "Chennai",
    arrivalCity: "Bangalore",
    stops: [
      { stopName: "Chennai", departureTime: "11:30 PM" },
      { stopName: "Vellore", arrivalTime: "02:30 AM", departureTime: "02:45 AM" },
      { stopName: "Bangalore", arrivalTime: "06:00 AM" },
    ],
    totalSeats: 36, price: 900, seatType: "sleeper", isAC: true,
  },
  {
    name: "SRS Travels Bangalore",
    departureCity: "Chennai",
    arrivalCity: "Bangalore",
    stops: [
      { stopName: "Chennai", departureTime: "10:00 PM" },
      { stopName: "Vellore", arrivalTime: "01:00 AM", departureTime: "01:15 AM" },
      { stopName: "Bangalore", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 40, price: 750, seatType: "normal", isAC: true,
  },
  {
    name: "VRL Chennai Bangalore",
    departureCity: "Chennai",
    arrivalCity: "Bangalore",
    stops: [
      { stopName: "Chennai", departureTime: "09:00 PM" },
      { stopName: "Vellore", arrivalTime: "12:00 AM", departureTime: "12:15 AM" },
      { stopName: "Bangalore", arrivalTime: "04:30 AM" },
    ],
    totalSeats: 36, price: 1050, seatType: "sleeper", isAC: true,
  },

  // Guwahati → Jorhat
  {
    name: "Jonaki Sleeper Jorhat",
    departureCity: "Guwahati",
    arrivalCity: "Jorhat",
    stops: [
      { stopName: "Guwahati", departureTime: "09:00 PM" },
      { stopName: "Tezpur", arrivalTime: "11:30 PM", departureTime: "11:45 PM" },
      { stopName: "Jorhat", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 36, price: 1100, seatType: "sleeper", isAC: true,
  },
  {
    name: "ASTC Jorhat Express",
    departureCity: "Guwahati",
    arrivalCity: "Jorhat",
    stops: [
      { stopName: "Guwahati", departureTime: "08:00 PM" },
      { stopName: "Tezpur", arrivalTime: "10:30 PM", departureTime: "10:45 PM" },
      { stopName: "Jorhat", arrivalTime: "04:00 AM" },
    ],
    totalSeats: 40, price: 850, seatType: "normal", isAC: false,
  },

  // Mumbai → Pune
  {
    name: "Neeta Tours Mumbai Pune",
    departureCity: "Mumbai",
    arrivalCity: "Pune",
    stops: [
      { stopName: "Mumbai", departureTime: "07:00 AM" },
      { stopName: "Khopoli", arrivalTime: "08:30 AM", departureTime: "08:45 AM" },
      { stopName: "Pune", arrivalTime: "10:00 AM" },
    ],
    totalSeats: 40, price: 350, seatType: "normal", isAC: true,
  },
  {
    name: "Shivneri AC Mumbai Pune",
    departureCity: "Mumbai",
    arrivalCity: "Pune",
    stops: [
      { stopName: "Mumbai", departureTime: "02:00 PM" },
      { stopName: "Lonavala", arrivalTime: "03:30 PM", departureTime: "03:45 PM" },
      { stopName: "Pune", arrivalTime: "05:00 PM" },
    ],
    totalSeats: 40, price: 400, seatType: "normal", isAC: true,
  },
  {
    name: "Konduskar Mumbai Pune Night",
    departureCity: "Mumbai",
    arrivalCity: "Pune",
    stops: [
      { stopName: "Mumbai", departureTime: "09:00 PM" },
      { stopName: "Pune", arrivalTime: "12:00 AM" },
    ],
    totalSeats: 36, price: 700, seatType: "sleeper", isAC: true,
  },

  // Hyderabad → Bangalore
  {
    name: "Paulo Hyd Bangalore",
    departureCity: "Hyderabad",
    arrivalCity: "Bangalore",
    stops: [
      { stopName: "Hyderabad", departureTime: "08:00 PM" },
      { stopName: "Kurnool", arrivalTime: "11:00 PM", departureTime: "11:15 PM" },
      { stopName: "Bangalore", arrivalTime: "05:00 AM" },
    ],
    totalSeats: 36, price: 1400, seatType: "sleeper", isAC: true,
  },
  {
    name: "VRL Hyd Bangalore",
    departureCity: "Hyderabad",
    arrivalCity: "Bangalore",
    stops: [
      { stopName: "Hyderabad", departureTime: "09:30 PM" },
      { stopName: "Kurnool", arrivalTime: "12:30 AM", departureTime: "12:45 AM" },
      { stopName: "Bangalore", arrivalTime: "06:30 AM" },
    ],
    totalSeats: 40, price: 900, seatType: "semi-sleeper", isAC: false,
  },
  {
    name: "Orange Hyd Bangalore",
    departureCity: "Hyderabad",
    arrivalCity: "Bangalore",
    stops: [
      { stopName: "Hyderabad", departureTime: "07:00 PM" },
      { stopName: "Kurnool", arrivalTime: "10:00 PM", departureTime: "10:15 PM" },
      { stopName: "Bangalore", arrivalTime: "04:00 AM" },
    ],
    totalSeats: 36, price: 1200, seatType: "sleeper", isAC: true,
  },
];

export const seedBuses = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in .env");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Bus.deleteMany({});
  await Booking.deleteMany({});
  console.log("Cleared all existing data");

  const dates = generateDates();
  let totalSeeded = 0;

  for (const template of busTemplates) {
    for (const date of dates) {
      const seats = generateSeats(template.totalSeats, template.seatType);
      await Bus.create({
        name: template.name,
        departureCity: template.departureCity,
        arrivalCity: template.arrivalCity,
        date,
        stops: template.stops,
        totalSeats: template.totalSeats,
        availableSeats: template.totalSeats,
        price: template.price,
        seatTypes: [template.seatType],
        isAC: template.isAC,
        seats,
      });
      totalSeeded++;
    }
    console.log(`Seeded: ${template.name} for 30 days`);
  }

  console.log(`\nDone! ${totalSeeded} total entries (${busTemplates.length} buses x 30 days)`);
  await mongoose.disconnect();
  process.exit(0);
};

seedBuses().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});