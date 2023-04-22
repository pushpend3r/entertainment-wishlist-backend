/* IMPORT REQUIRED PACKAGES */
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import publicRouter from "./routes/public.js";
import cookieParser from "cookie-parser";

/* LOAD ENVIRONMENT VARIABLES */
dotenv.config();

/* CONNECT TO DATABASE */
mongoose.connect(process.env.MONGODB_URL);

/* CREATE SERVER */
const app = express();

/* SET MIDDLEWARES */
app.use(cookieParser());
app.use(express.json());

/* REGISTER ROUTES */
app.use("/", publicRouter);
app.use("/", authRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server is listening on port", PORT);
});
