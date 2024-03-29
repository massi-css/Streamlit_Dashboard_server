import mongoose from "mongoose";

const DatasSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    conductivity: {
      type: Number,
      required: true,
    },
    turbidity: {
      type: Number,
      required: true,
    },
    ph: {
      type: Number,
      required: true,
    },
    oxygen: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const datas = mongoose.model("Datas", DatasSchema);

export default datas;
