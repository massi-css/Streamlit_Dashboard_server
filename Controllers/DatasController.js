import temperatureModel from "../Models/datasModel.js";


// @desc recieving the temperature data
// @route POST /data/temperature
// @access Public
const receivedTemperature = async (req, res) => {
  const { sensorId, temperature } = req.body;
  const temperatureData = {
    sensorId,
    temperature,
  };
  console.log(temperatureData.temperature);
  
  try {
    const savedTemperature = await temperatureModel.create(temperatureData);
    if(savedTemperature){
      res.status(200).json({ message: "Temperature data saved" });
    } else {
      res.status(500).json({ message: "Error in saving temperature data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc get the latest temperature data
// @route GET /data/temperature/latest
// @access Public
const getLatestTemperature = async (req, res) => {
  try {
    const latestTemperature = await temperatureModel.findOne().sort({ createdAt: -1 });
    if(latestTemperature){
      res.status(200).json(latestTemperature);
    } else {
      res.status(404).json({ message: "No temperature data found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export { receivedTemperature, getLatestTemperature};
