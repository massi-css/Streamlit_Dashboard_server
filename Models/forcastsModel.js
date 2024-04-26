import mongoose from "mongoose";

const ForcastsSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    next_day_temp: {
      type: Number,
      required: true,
    },
    next_day_turb: {
      type: Number,
      required: true,
    },
    next_day_pH: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const forcasts = mongoose.model("Forcasts", ForcastsSchema);

export default forcasts;