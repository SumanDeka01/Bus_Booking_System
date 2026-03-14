import { Router } from "express";
import {
  getBuses,
  getBusById,
  reserveSeats,
} from "../controllers/bus.controller";

const router = Router();

router.get("/", getBuses);
router.get("/:busId", getBusById);
router.post("/:busId/reserve", reserveSeats);

export default router;



