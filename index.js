import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

connectDB(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
