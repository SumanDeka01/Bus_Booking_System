import {Router} from "express";
import { getBuses } from "../controllers/bus.controller";

const router = Router();

router.get("/", getBuses);

export default router;



