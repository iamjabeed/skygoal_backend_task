import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";

import {
  createUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.route("/profile").get(authenticate, getUserProfile);

export default router;
