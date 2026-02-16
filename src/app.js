import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

//* Parses incoming JSON request bodies and makes them available in req.body
app.use(express.json());

//* cookieParser to read the cookies from  the request
app.use(cookieParser());

//* Authentication router for register and login
app.use("/auth", authRouter);

export default app;
