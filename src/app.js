import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.js";
import subsRouter from "./routes/subscription.js";
import healthCheckRouter from "./routes/healthCheck.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/subs", subsRouter);
app.use("/api/v1/health-check", healthCheckRouter);

export { app };
