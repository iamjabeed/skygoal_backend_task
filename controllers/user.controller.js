import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

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

export { createUser, loginUser };
