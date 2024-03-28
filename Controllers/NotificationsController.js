import notificationModel from "../Models/notificationModel.js";

// @desc   Get all notifications
// @route  GET /api/notifications
// @access Public
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find();
    if(notifications.length > 0){
        res.status(200).json(notifications);
    }else{
        res.status(404).json({message: "No notifications found"});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc add new notification
// @route POST /api/notifications
// @access Public
const addNotification = async (req, res) => {
  const notification = req.body;
  try {
    const newNotification = await notificationModel.create(notification);
    if(newNotification){
        res.status(201).json(newNotification);
    }
    else{
        res.status(400).json({message: "Invalid notification data"});
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export { getNotifications, addNotification };