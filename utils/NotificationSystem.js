import notificationModel from "../Models/notificationModel.js";
import devicesModel from "../Models/devicesModel.js";

// @desc check if the data is out of range
const datacheck = (data, device) => {
  let message = `${device.deviceName} : \n`;
  if (data.temperature > 30) {
    message += "- It's too hot ! \n";
  }
  if (data.temperature < 10) {
    message += "- It's too cold 🥶! \n";
  }
  if (data.conductivity > 500) {
    message += "- Conductivity is too high ! \n";
  }
  if (data.conductivity < 50) {
    message += "- Conductivity is too low ⚠️! \n";
  }
  if (data.turbidity > 25) {
    message += " - Turbidity is too high ⚠️! \n";
  }
  if (data.turbidity < 0) {
    message += "- Turbidity is too low ⚠️! \n";
  }
  if (data.ph > 8.5) {
    message += "- PH level is too high ⚠️! \n";
  }
  if (data.ph < 6.5) {
    message += "- PH level is too low ⚠️! \n";
  }
  if (message === `${device.deviceName} : \n`) {
    return null;
  }
  return message;
};

//add notification to the database
const addNotification = async (notification) => {
  const { deviceId } = notification;
  try {
    const newNotification = await notificationModel.create(notification);
    if (newNotification) {
      const device = await devicesModel.findById(deviceId);
      if(!device){
        console.log("notification system : Device not found");
      }else{
        device.notifications.push(newNotification._id);
        await device.save();
      }
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
