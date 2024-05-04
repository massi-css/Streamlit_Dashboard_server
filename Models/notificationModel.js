import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    deviceId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const notification = mongoose.model("Notification", notificationSchema);

export default notification;
