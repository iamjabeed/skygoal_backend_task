import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRouter from "./routes/user.router.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

connectDB(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
