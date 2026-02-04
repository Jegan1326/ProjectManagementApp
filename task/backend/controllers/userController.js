const User = require('../models/User');

// @desc    Get all users (teammates) for assignment
// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    // We select only name, role, and avatar to keep the payload light for the dropdown
    const users = await User.find().select('name role avatar email'); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Failed to fetch teammates" });
  }
};

// @desc    Create a new user (Admin or Teammate)
// @route   POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // Note: In a production app, you would hash this with bcrypt
      role
    });

    // Return the user without the password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};