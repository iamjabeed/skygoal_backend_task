import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authenticate = async (req, res, next) => {
  let token;
  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token
      req.user = await User.findById(decode.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      res.json({ message: "Not authorized, token failed" });
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    res.json({ message: "Not authorized, no token" });
    throw new Error("Not authorized, no token");
  }
};

export { authenticate };
