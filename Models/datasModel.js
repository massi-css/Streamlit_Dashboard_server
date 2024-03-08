import mongoose from "mongoose";

const temperatureSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: true,
    },
    temperature:[
      {
        temperature: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const temperature = mongoose.model("TemperatureData", temperatureSchema);

export default temperature;
