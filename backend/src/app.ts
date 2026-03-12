import express from "express";
import busRoutes from "./routes/bus.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();

app.use(express.json());

app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (_req, res) => {
  res.send("API is running");
});

export default app;
