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
    datas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Datas",
      },
    ],
    forcasts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forcasts",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    status: {
      type: String,
      required: true,
      default: "Active",
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

DevicesSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await this.model("Notification").deleteMany({
    _id: { $in: this.notifications },
  });
  next();
});

DevicesSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await this.model("Datas").deleteMany({ _id: { $in: this.datas } });
  next();
});

DevicesSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await this.model("Forcasts").deleteMany({ _id: { $in: this.forcasts } });
  next();
});

const devices = mongoose.model("Devices", DevicesSchema);
export default devices;
