import mongoose from "mongoose";

const DevicesSchema = new mongoose.Schema(
  {
    deviceName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    datas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Datas'
      }],
      status: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const devices = mongoose.model("Devices", DevicesSchema);
export default devices;
