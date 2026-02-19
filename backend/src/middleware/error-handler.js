// Simple JSON error handler
export const errorHandler = (err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    if (res.headersSent) {
        return res;
    }
    const status = typeof err?.status === "number" ? err.status : 500;
    res.status(status).json({
        error: status === 500 ? "Internal server error" : err.message ?? "Request failed",
    });
};
//# sourceMappingURL=error-handler.js.map