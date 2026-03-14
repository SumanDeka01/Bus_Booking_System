import dotenv from "dotenv";
import connectDB from "../config/db";
import { seedBuses } from "./seedbuses";


import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config( {
    path: ".env"
});

const runSeed = async () => {
  try {
    await connectDB();

    await seedBuses();

    console.log("Seeding completed");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runSeed();