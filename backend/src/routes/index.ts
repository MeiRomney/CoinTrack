import type { Express, Request, Response, NextFunction } from "express";
import { cryptoRouter } from "./routes-crypto.js";
import { portfolioRouter } from "./routes-portfolio.js";
import { walletRouter } from "./wallet-routes.js";
import { accountRouter } from "./account-routes.js";
import testRouter from "./test.js";

export function registerRoutes(app: Express) {
  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Grouped API routes
  app.use("/api/crypto", cryptoRouter);
  app.use("/api/portfolio", portfolioRouter);
  app.use("/api/wallet", walletRouter);
  app.use("/api/account", accountRouter);
  app.use("/api/test", testRouter);

  // 404 for unknown API routes
  app.use("/api", (req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next();
    res.status(404).json({ error: "Not found" });
  });
}
