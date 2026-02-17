import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { registerRoutes } from "./routes/index.ts";
import { errorHandler } from "./middleware/error-handler.ts";

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "*",
  }),
);
app.use(express.json());

// API routes
registerRoutes(app);

// Global error handler (keep last)
app.use(errorHandler);
