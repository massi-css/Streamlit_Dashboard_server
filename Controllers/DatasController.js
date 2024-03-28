import datasModel from "../Models/datasModel.js";
import deviceModel from "../Models/devicesModel.js";
import mongoose from "mongoose";
import { addNotification, datacheck } from "../utils/NotificationSystem.js";

// @desc recieving the  data from the device
// @route POST /data/send
// @access Public
const receivedData = async (req, res) => {
  const { deviceId, temperature, conductivity, turbidity, ph, oxygen } =
    req.body;
  const Data = {
    deviceId,
    temperature,
    conductivity,
    turbidity,
    ph,
    oxygen,
  };
  console.log(Data.temperature);

  try {
    // check if the device exists
    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      return res.status(400).json({ message: "Invalid device ID" });
    }
    // check if the device exists
    const device = await deviceModel.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    } else {
      // save the data to the database and add its id to the device
      const savedData = await datasModel.create(Data);
      if (savedData) {
        if (!device.datas.includes(savedData._id)) {
          device.datas.push(savedData._id);
          await device.save();
          const message = datacheck(Data);
          if (message) {
            await addNotification({ message });
          }
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
    const device = await deviceModel
      .findById(req.params.deviceId)
      .populate("datas");
    if (device) {
      res.status(200).json(device.datas);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc get the latest temperature data
// @route GET /data/temperature/latest
// @access Public
const getLatestData = async (req, res) => {
  const deviceId = req.params.deviceId;
  try {
    const device = await deviceModel.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    } else {
      const limit = 1;
      const data = await datasModel
        .find({ deviceId: deviceId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-_id -deviceId");
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: "No data found" });
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
      device.datas = [];
      const saved = await device.save();
      if (data && saved) {
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

export { receivedData, getLatestData, getDeviceData, deleteDeviceData };
