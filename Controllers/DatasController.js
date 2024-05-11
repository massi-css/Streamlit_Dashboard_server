import forcastsModel from "../Models/forcastsModel.js";
import deviceModel from "../Models/devicesModel.js";
import mongoose from "mongoose";
import { addNotification, datacheck } from "../utils/NotificationSystem.js";
import { sendEmail } from "../utils/sendEmail.js";
import UserModel from "../Models/usersModel.js";
import datasModel from "../Models/datasModel.js";
import { sendSMS } from "../utils/send_sms.js";
import axios from "axios";
import dotenv from "dotenv";
import { calculate_wqi } from "../utils/waterQuality.js";

const simpleDate = (date) => {
  const dateformat = new Date(date);
  let hours = dateformat.getUTCHours().toString().padStart(2, "0");
  let minutes = dateformat.getUTCMinutes().toString().padStart(2, "0");
  let seconds = dateformat.getUTCSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const simpleForcastDate = (date) => {
  const dateformat = new Date(date);
  let day = dateformat.getUTCDate().toString().padStart(2, "0");
  let month = (dateformat.getUTCMonth() + 1).toString().padStart(2, "0");
  let year = dateformat.getUTCFullYear().toString();
  return `${day}-${month}-${year}`;
};

// @desc recieving the  data from the device
// @route POST /data/send
// @access Public
const receivedData = async (req, res) => {
  const { deviceId, temperature, conductivity, turbidity, ph } = req.body;

  try {
    // check if the device id is valid
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }
    // check if the device exists
    const device = await deviceModel.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found", deviceId });
    } else {
      // save the data to the database and add its id to the device
      const waterQuality = calculate_wqi(
        ph,
        turbidity,
        temperature
      );
      const Data = {
        deviceId,
        temperature,
        conductivity,
        turbidity,
        ph,
        qualityIndex: waterQuality,
      };
      const savedData = await datasModel.create(Data);
      if (savedData) {
        if (!device.datas.includes(savedData._id)) {
          device.datas.push(savedData._id);
          await device.save();
          const message = datacheck(Data, device.toObject());
          if (message) {
            await addNotification({ message, deviceId: device._id });
            const user = await UserModel.findById(process.env.ADMIN_ID);
            // check if the user wants to recieve notification via email or sms
            if (user && user.recieveNotification.perEmail) {
              await sendEmail(user.email, "Alert", message);
            }
            if (user && user.phoneNumber && user.recieveNotification.perSMS) {
              await sendSMS(message, user.phoneNumber);
            }
            console.log(message);
          }
          // update the device status to active
          device.status = "Active";
          await device.save();
          res.status(201).json({ message: "Data saved successfully" });
        }
      } else {
        res.status(500).json({ message: "Error in saving  data" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc get all the recieved data of the device
// @route GET /data/:deviceId
// @access Public
const getDeviceData = async (req, res) => {
  try {
    const device = await deviceModel.findById(req.params.deviceId).populate({
      path: "datas",
      select: "-_id -deviceId -__v -updatedAt",
    });
    if (device) {
      res.status(200).json(device.datas);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc get the latest data
// @route GET /data/latest
// @access Public
const getLatestData = async (req, res) => {
  const deviceId = req.params.deviceId;
  try {
    const device = await deviceModel.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    } else {
      const limit = 20;
      const data = await datasModel
        .find({ deviceId: deviceId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-_id -deviceId -__v -updatedAt")
        .lean();
      if (data.length > 0) {
        data.forEach((doc) => {
          doc.createdAt = simpleDate(doc.createdAt);
        });
        res.status(200).json(data);
      } else {
        res.status(404).json([
          {
            temperature: 0,
            turbidity: 0,
            ph: 0,
            qualityIndex: 0,
            createdAt: simpleDate(new Date()),
          },
        ]);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc delete all the data of the device
// @route DELETE /data/:deviceId
// @access Public
const deleteDeviceData = async (req, res) => {
  try {
    const device = await deviceModel.findById(req.params.deviceId);

    if (device) {
      const data = await datasModel.deleteMany({
        deviceId: req.params.deviceId,
      });
      const forcastData = await forcastsModel.deleteMany({
        deviceId: req.params.deviceId,
      });
      device.forcasts = [];
      device.datas = [];
      const saved = await device.save();
      if (data && forcastData && saved) {
        res.status(200).json({ message: "Data deleted successfully" });
      } else {
        res.status(404).json({ message: "No data found" });
      }
    } else {
      res.status(404).json({ message: "Device not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc get latest forcast data
// @route GET /forcast/:deviceId
// @access Public
const getLatestForcastData = async (req, res) => {
  try {
    const device = await deviceModel.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    } else {
      const forcastdata = await forcastsModel
        .find({ deviceId: req.params.deviceId })
        .sort({ createdAt: -1 })
        .limit(1)
        .select("-_id -deviceId -__v -updatedAt");
      if (forcastdata.length > 0) {
        res.status(200).json(forcastdata);
      } else {
        res.status(404).json([
          {
            next_day_temp: 0,
            next_day_turb: 0,
            next_day_pH: 0,
            createdAt: simpleForcastDate(new Date()),
          },
        ]);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc forcast next day data
// @route POST /forcast/:deviceId
// @access Public
const forcastData = async (req, res) => {
  dotenv.config();
  const { temperature, turbidity, pH } = req.body;
  const deviceId = req.params.deviceId;
  let response;

  try {
    // check if the device id is valid
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }
    // check if the device exists
    const device = await deviceModel.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    } else {
      try {
        response = await axios.post(`${process.env.FORECASTING_API}/predict`, {
          pH,
          temperature,
          turbidity,
        });
        console.log(response.data);
      } catch (err) {
        console.log(err.message);
        return res.status(500).json({ forcastModelmessage: err.message });
      }
      // save the forcasted data to the database and add its id to the device
      let savedData;
      if (response.data) {
        savedData = await forcastsModel.create({
          ...response.data,
          deviceId,
        });
      }
      if (savedData) {
        if (!device.forcasts.includes(savedData._id)) {
          device.forcasts.push(savedData._id);
          await device.save();
          res.status(201).json({ message: "Data saved successfully" });
        } else {
          res.status(500).json({ message: "Error in saving  data" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc get the latest temperature data
// @route GET /forcast/:deviceId/all
// @access Public
const getForcastedData = async (req, res) => {
  const deviceId = req.params.deviceId;
  try {
    const device = await deviceModel.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    } else {
      const limit = 10;
      const forcastdata = await forcastsModel
        .find({ deviceId: deviceId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-_id -deviceId -__v -updatedAt")
        .lean();
      if (forcastdata.length > 0) {
        forcastdata.forEach((doc) => {
          doc.createdAt = simpleForcastDate(doc.createdAt);
        });
        res.status(200).json(forcastdata);
      } else {
        res.status(404).json([
          {
            next_day_temp: 0,
            next_day_turb: 0,
            next_day_pH: 0,
            createdAt: simpleForcastDate(new Date()),
          },
        ]);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  receivedData,
  getLatestData,
  getDeviceData,
  deleteDeviceData,
  forcastData,
  getLatestForcastData,
  getForcastedData,
};
