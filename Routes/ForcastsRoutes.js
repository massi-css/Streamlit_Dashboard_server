import express from "express";
import {
  forcastData,
  getForcastedData,
  getLatestForcastData,
} from "../Controllers/DatasController.js";

const router = express.Router();

router.get("/:deviceId", getLatestForcastData);
router.post("/:deviceId", forcastData);
router.get("/:deviceId/all", getForcastedData);

export default router;
