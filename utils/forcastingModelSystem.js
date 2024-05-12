import axios from "axios";
import dotenv from "dotenv";
import deviceModel from "../Models/devicesModel.js";
import datasModel from "../Models/datasModel.js";
import forcastsModel from "../Models/forcastsModel.js";

const forcastData = async () => {
  dotenv.config();
  let devices;
  devices = await deviceModel.find();
  if (devices.length > 0) {
    devices.forEach(async (device) => {
      const data = await datasModel
        .find({ deviceId: device._id })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean();
      if (data.length > 0) {
        const datatobeused = {
          pH: data[0].ph,
          temperature: data[0].temperature,
          turbidity: data[0].turbidity,
        };
        const response = await axios.post(
          `${process.env.FORECASTING_API}/predict`,
          datatobeused
        );
        if (response.data) {
          const forcastdata = new forcastsModel({
            deviceId: device._id,
            ...response.data,
          });
          // console.log(forcastdata);
          await forcastdata.save();
        }
      }
    });
  }
};

export { forcastData };
