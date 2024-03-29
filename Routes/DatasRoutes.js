import express from "express";
import {
  getLatestData,
  receivedData,
  getDeviceData,
  deleteDeviceData
} from "../Controllers/DatasController.js";
const router = express.Router();

router.post("/send",receivedData);
router.get("/latest/:deviceId", getLatestData);
router.get("/:deviceId", getDeviceData);
router.delete("/:deviceId", deleteDeviceData);

export default router;
