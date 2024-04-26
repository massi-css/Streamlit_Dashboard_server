import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import dataToPredictModel from "../Models/datatopredictModel.js";

const runAtSpecificTime = (hour, minute, callback) => {
  var now = new Date();
  var targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0
  );
  var timeUntilTarget = targetTime - now;
  console.log(`now: ${now}`);
  console.log(`targetTime: ${targetTime}`);
  console.log(`timeUntilTarget: ${timeUntilTarget}`);

  if (timeUntilTarget < 0) {
    targetTime.setDate(targetTime.getDate() + 1);
    timeUntilTarget = targetTime - now;
  }

  setTimeout(async () => {
    try {
      await callback();
    } catch (error) {
      console.error(error);
    }
  }, timeUntilTarget);
};

const trainModel = async () => {
  dotenv.config();
  console.log("invoked");
  try {
      const data = await dataToPredictModel.find().select("-_id").lean();
      let params = ["Temp", "Ph", "Turb"];
      let responses = [];
      if (data.length > 0) {
        console.log("Training Model...");
        for (const param of params) {
          const response = await axios.post(
            `${process.env.FORECASTING_API}/train`,
            {
              data,
              train_ratio: 0.6,
              epochs: 100,
              paramName: param,
            }
          );
          console.log(response.data);
          responses.push(response);
        }
      } else {
        console.log("No data to train");
      }
  } catch (error) {
    console.error(`Training_Error: ${error.message}`);
  }
};

export { trainModel, runAtSpecificTime };
