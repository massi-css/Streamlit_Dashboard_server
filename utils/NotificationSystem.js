import notificationModel from "../Models/notificationModel.js";

// @desc check if the data is out of range
const datacheck = (data, device) => {
  if (data.temperature > 30) {
    return `${device.deviceName}: It's too hot!`;
  } else if (data.temperature < 10) {
    return `${device.deviceName}: It's too cold 🥶 !`;
  } else if (data.conductivity > 500) {
    return `${device.deviceName}: Conductivity is too high ♨️ !`;
  } else if (data.conductivity < 50) {
    return `${device.deviceName}: Conductivity is too low ⚠️!`;
  } else if (data.turbidity > 25) {
    return `${device.deviceName}: Turbidity is too high ⚠️!`;
  } else if (data.turbidity < 0) {
    return `${device.deviceName}: Turbidity is too low ⚠️ !`;
  } else if (data.ph > 8.5) {
    return `${device.deviceName}: PH level is too high ⚠️ !`;
  } else if (data.ph < 6.5) {
    return `${device.deviceName}: PH level is too low ⚠️ !`;
  } else if (data.oxygen < 5) {
    return `${device.deviceName}: Oxygen level is too low ⚠️ !`;
  } else {
    return null;
  }
};

//add notification to the database
const addNotification = async (notification) => {
  try {
    const newNotification = await notificationModel.create(notification);
    if (newNotification) {
      return {
        message: "Notification added successfully",
        notification: newNotification,
      };
    } else {
      throw new Error("Invalid notification data");
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export { addNotification, datacheck };
