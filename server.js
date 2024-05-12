import express from "express";
import dotenv from "dotenv";
import connectDB from "./connectDB.js";
import DatasRoutes from "./Routes/DatasRoutes.js";
import DevicesRoutes from "./Routes/DevicesRoutes.js";
import notificationRoutes from "./Routes/NotificationsRoutes.js";
import UsersRoutes from "./Routes/UsersRoutes.js";
import ForcastsRoutes from "./Routes/ForcastsRoutes.js";
import { trainModel } from "./utils/trainingModelSystem.js";
import schedule from "node-schedule";
import { checkDeviceStatus } from "./utils/deviceStatus.js";
import { forcastData } from "./utils/forcastingModelSystem.js";

const port = 5000;
const app = express();
app.use(express.json());
dotenv.config();
// connecting to db
connectDB();

// check the model if its trained or not every week at 23:00 PM
const Trainigjob = schedule.scheduleJob({dayOfWeek:0 , hour: 23, minute: 0 }, trainModel);
// forcasting the data every day at 23:30 PM
const Forcastingjob = schedule.scheduleJob({ hour: 23, minute: 30 },forcastData);
// check the device status every 10 minutes
const Statusjob = schedule.scheduleJob("*/10 * * * *", checkDeviceStatus);

// main route for the server
app.get("/", (req, res) => {
  res.send("server is running");
});
app.post("/data", (req, res) => {
  console.log("Data received");
  res.json(req.body);
});
// route for the datas
app.use("/data", DatasRoutes);
app.use("/devices", DevicesRoutes);
app.use("/notifications", notificationRoutes);
app.use("/users", UsersRoutes);
app.use("/forcast", ForcastsRoutes);

// starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
