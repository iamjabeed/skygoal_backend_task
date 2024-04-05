import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  //   console.log(username, email, password);
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Invalid user, Please fill all the required fields");
  }

  //Check if user already exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  if (newUser) {
    //To generate jwt token
    generateToken(res, newUser._id);
    res.status(201);
    res.json({
      message: "user successfully registred",
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } else {
    res.status(401);
    throw new Error("Please enter correct values");
  }
};

// @desc    LOGIN
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //verify user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      //To generate jwt token
      generateToken(res, existingUser._id);
      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      });
      return;
    }
  } else {
    res.status(400);
    throw new Error("User not found");
  }
};

// @desc    LOGOUT
// @route   POST /api/users/logout
// @access  Public
const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get the current user
// @route   GET /api/users/profile
// @access  Private/ Protected
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
};

// @desc    Update the current user
// @route   PUT /api/users/profile
// @access  Private/ Protected
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Check if the request body includes a new password
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

export { createUser, loginUser, logoutUser, getUserProfile, updateUserProfile };
