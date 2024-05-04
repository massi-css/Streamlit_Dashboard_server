import devicesModel from "../Models/devicesModel.js";
import axios from "axios";
// @desc   Get all devices
// @route  GET /api/devices
// @access Public
const getDevices = async (req, res) => {
  try {
    const devices = await devicesModel.find().select("-__v");
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc add new device
// @route POST /api/devices
// @access Public
const addDevice = async (req, res) => {
  const device = req.body;

  try {
    const createdDevice = await devicesModel.create(device);
    let connected;
    if (createdDevice) {
      try{
        connected = await axios.post("http://192.168.100.96:80/connectdevice", {
          deviceId: createdDevice._id,
        });
      }catch (e) {
        console.log(e)
        devicesModel.findByIdAndDelete(createdDevice._id);
        res.status(409).json({ message: "Device not connected,try to use the same Wifi" });
      }
      if (connected){
        res.status(201).json({ message: "Device connected successfully", data: createdDevice });
      }
    }
    // res
    //   .status(201)
    //   .json({ message: "Device added successfully", data: createdDevice });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// @desc   Get device by id
// @route  GET /api/devices/:id
// @access Public
const getDeviceById = async (req, res) => {
  try {
    const device = await devicesModel.findOne({ _id: req.params.id });
    if (device) {
      res.status(200).json(device);
    } else {
      res.status(404).json({ message: "Device not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc  Delete device by id
// @route DELETE /api/devices/:id
// @access Public
const deleteDevice = async (req, res) => {
  try {
    const device = await devicesModel.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    await devicesModel.deleteOne({ _id: req.params.id});
    res
      .status(200)
      .json({ message: "Device deleted successfully", data: device });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc Update device by id
// @route PUT /api/devices/:id
// @access Public
const updateDevice = async (req, res) => {
  const device = req.body;
  try {
    const updatedDevice = await devicesModel.findByIdAndUpdate(
      req.params.id,
      device,
      { new: true }
    );
    if (updatedDevice) {
      res
        .status(200)
        .json({ message: "Device updated successfully", data: updatedDevice });
    } else {
      res.status(404).json({ message: "Device not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { getDevices, addDevice, getDeviceById, deleteDevice, updateDevice };
