import type { Express, Request, Response, NextFunction } from "express";
import { cryptoRouter } from "./routes-crypto.ts";
import { portfolioRouter } from "./routes-portfolio.ts";

export function registerRoutes(app: Express) {
  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Grouped API routes
  app.use("/api/crypto", cryptoRouter);
  app.use("/api/portfolio", portfolioRouter);

  // 404 for unknown API routes
  app.use("/api", (req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next();
    res.status(404).json({ error: "Not found" });
  });
}
