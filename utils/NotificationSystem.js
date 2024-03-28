import notificationModel from "../Models/notificationModel.js";

// @desc check if the data is out of range
const datacheck = (data) => {
  if (
    data.temperature[0].temperature > 40 ||
    data.temperature[0].temperature < 10
  ) {
    return "Temperature is out of range";
  } else if (data.conductivity > 50 || data.conductivity < 10) {
    return "Conductivity is out of range";
  } else if (data.turbidity > 50 || data.turbidity < 10) {
    return "Turbidity is out of range";
  } else if (data.ph > 10 || data.ph < 4) {
    return "PH is out of range";
  } else if (data.oxygen > 50 || data.oxygen < 10) {
    return "Oxygen is out of range";
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
