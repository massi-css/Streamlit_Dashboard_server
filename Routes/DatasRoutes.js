import express from "express";
import {
  getLatestTemperature,
  receivedTemperature,
} from "../Controllers/DatasController.js";
const router = express.Router();

router.post("/temperature", receivedTemperature);
router.get("/temperature/latest", getLatestTemperature);

export default router;
