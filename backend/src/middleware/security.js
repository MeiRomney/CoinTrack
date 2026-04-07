import helmet from "helmet";
import cors from "cors";
import { config } from "../config.js";
import { getLogger } from "../utils/logger.js";
const logger = getLogger();
export function configureSecurityMiddleware(app) {
    // Configure Helmet for security headers
    app.use(helmet({
        // Configure Content Security Policy
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                ],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        // Configure Cross-Origin-Embedder-Policy
        crossOriginEmbedderPolicy: false, // Disable if you need to embed resources from other origins
        // Configure other security headers
        hsts: {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
        },
        // Remove X-Powered-By header
        hidePoweredBy: true,
        // Set X-Frame-Options
        frameguard: {
            action: "deny",
        },
        // Set X-Content-Type-Options
        noSniff: true,
        // Set Referrer-Policy
        referrerPolicy: {
            policy: "strict-origin-when-cross-origin",
        },
    }));
    // Configure CORS
    const corsOptions = {
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin)
                return callback(null, true);
            // Check if the origin is in our allowed list
            if (config.cors.origins.includes(origin)) {
                return callback(null, true);
            }
            // Log unauthorized CORS attempts
            logger.warn("CORS request from unauthorized origin", {
                origin,
                allowedOrigins: config.cors.origins,
            });
            const msg = "The CORS policy for this site does not allow access from the specified origin.";
            return callback(new Error(msg), false);
        },
        credentials: true, // Allow cookies and authentication headers
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
            "Cache-Control",
            "X-CSRF-Token",
        ],
        exposedHeaders: [
            "X-RateLimit-Limit",
            "X-RateLimit-Remaining",
            "X-RateLimit-Reset",
        ],
        maxAge: 86400, // 24 hours
    };
    app.use(cors(corsOptions));
    // Trust proxy if behind a reverse proxy (important for Railway, Heroku, etc.)
    if (config.nodeEnv === "production") {
        app.set("trust proxy", 1);
    }
    // Security logging middleware
    app.use((req, res, next) => {
        // Log security-relevant request information
        const securityContext = {
            ip: req.ip,
            method: req.method,
            path: req.path,
            userAgent: req.get("User-Agent"),
            origin: req.get("Origin"),
            referer: req.get("Referer"),
        };
        // Log suspicious requests
        if (req.path.includes("..") ||
            req.path.includes("<script>") ||
            req.path.includes("eval(")) {
            logger.warn("Suspicious request detected", securityContext);
        }
        // Add security headers to response
        res.setHeader("X-Request-ID", req.get("X-Request-ID") || Math.random().toString(36).substring(7));
        next();
    });
    logger.info("Security middleware configured", {
        corsOrigins: config.cors.origins,
        trustProxy: config.nodeEnv === "production",
    });
}
// Additional security utilities
export function sanitizeInput(input) {
    // Basic input sanitization - you might want to use a more robust library like DOMPurify
    return input
        .replace(/[<>]/g, "") // Remove basic HTML tags
        .trim()
        .substring(0, 1000); // Limit length
}
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
}
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
// Middleware for input validation
export function validateRequestBody(requiredFields = []) {
    return (req, res, next) => {
        // Check for required fields
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: "Validation Error",
                    message: `Missing required field: ${field}`,
                    field,
                });
            }
        }
        // Sanitize string inputs
        for (const key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = sanitizeInput(req.body[key]);
            }
        }
        next();
    };
}
//# sourceMappingURL=security.js.map