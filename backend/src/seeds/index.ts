import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });  

import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import connectDB from "../config/db";
import { seedBuses } from "./seedbuses";

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