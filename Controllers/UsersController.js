import usersModel from "../Models/usersModel.js";

// @desc add a new user
// @route POST /api/users
// @access Public
const addUser = async (req, res) => {
  try {
    const user = await usersModel.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc update a user
// @route PUT /api/users/:id
// @access Public
const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const user = await usersModel.findById(id);
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
    } else {
      if (user.password === data.oldPassword) {
        const updatedUser = await usersModel.findByIdAndUpdate(id, data, {
          new: true,
        });
        if (updatedUser) {
          res
            .status(200)
            .json({ status: true, message: "User updated successfully" });
        } else {
          res
            .status(404)
            .json({ status: false, message: "Error while updating" });
        }
      } else {
        res
          .status(404)
          .json({ status: false, message: "Password is incorrect" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc get user by id
// @route GET /api/users/:id
// @access Public
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersModel.findById(id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc update notification infos
// @route PUT /api/users/:id/notifications
// @access Public
const updateNotification = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const user = await usersModel.findById(id);
    if (!user) {
      res.status(404).json({ status: false, message: "User not found" });
    } else {
      const updatedUser = await usersModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (updatedUser) {
        res
          .status(200)
          .json({ status: true, message: "Settings updated successfully" });
      } else {
        res
          .status(404)
          .json({ status: false, message: "Error while updating" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { addUser, updateUser, getUserById, updateNotification};
