import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import goalsRouter from "./routes/goals.routes.js";
import progressRouter from "./routes/progress.routes.js";
import aiRouter from "./routes/ai.routes.js";
import cpRouter from "./routes/cp.routes.js";
import settingsRouter from "./routes/setting.routes.js";

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if(!origin || origin==="http://localhost:3000")
      callback(null, true);
    else
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Bypass-Tunnel-Reminder"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/progress", progressRouter);
app.use("/api/ai", aiRouter);
app.use("/api/cp", cpRouter);
app.use("/api/settings", settingsRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running" });
});

export default app;
