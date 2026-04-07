import { cryptoRouter } from "./routes-crypto.js";
import { portfolioRouter } from "./routes-portfolio.js";
import testRouter from "./test.js";
export function registerRoutes(app) {
    // Health check
    app.get("/health", (req, res) => {
        res.json({ status: "ok", uptime: process.uptime() });
    });
    // Grouped API routes
    app.use("/api/crypto", cryptoRouter);
    app.use("/api/portfolio", portfolioRouter);
    app.use("/api/test", testRouter);
    // 404 for unknown API routes
    app.use("/api", (req, res, next) => {
        if (res.headersSent)
            return next();
        res.status(404).json({ error: "Not found" });
    });
}
//# sourceMappingURL=index.js.map