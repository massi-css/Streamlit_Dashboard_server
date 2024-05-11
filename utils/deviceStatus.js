import devicesModel from "../Models/devicesModel.js";

const checkDeviceStatus = async () => {
  const devices = await devicesModel.find();
  if (!devices) {
    return;
  }
  devices.forEach(async (device) => {
    if (device.status === "Active") {
      const date = new Date();
      const lastUpdate = new Date(device.updatedAt);
      const diff = date - lastUpdate;
      const diffTime = Math.abs(diff);
      if (diffTime > 900000) {
        device.status = "Inactive";
        await device.save();
      }
    }
  });
};

export { checkDeviceStatus };
