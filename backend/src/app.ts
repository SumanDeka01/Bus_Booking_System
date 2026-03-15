import express, { Application } from "express";
import cors from "cors";
import busRoutes from "./routes/bus.routes";
import bookingRoutes from "./routes/booking.routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app: Application = express();


app.use(cors({
  origin: "*",
})
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;