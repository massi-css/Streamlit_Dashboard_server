import express from "express";
import {addNotification, getNotifications} from "../Controllers/NotificationsController.js";
const router = express.Router();

router.get("/", getNotifications);
router.post("/", addNotification);

export default router;
