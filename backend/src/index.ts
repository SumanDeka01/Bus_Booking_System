import "dotenv/config";
import app from "./app";
import connectDB from "./config/db";

// Got DNS issue! Had to do this:)
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 8000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();