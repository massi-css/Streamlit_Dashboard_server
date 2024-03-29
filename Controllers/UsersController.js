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
  const user = req.body;
  try {
    const updatedUser = await usersModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    if (updateUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc get user by id
// @route GET /api/users/:id
// @access Public
const getUserById = async(req,res) =>{
    const {id} = req.params;
    try {
        const user = await usersModel.findById(id);
        if(user){
        res.status(200).json(user);
        }else{
        res.status(404).json({message: 'User not found'});
        }
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export { addUser, updateUser, getUserById};
