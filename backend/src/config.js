import dotenv from "dotenv";
// Load environment variables as early as possible
dotenv.config();
function getEnvVar(name, defaultValue) {
    const value = process.env[name];
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value;
}
function getEnvVarAsNumber(name, defaultValue) {
    const value = process.env[name];
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${name} must be a valid number`);
    }
    return parsed;
}
function getEnvVarAsBoolean(name, defaultValue) {
    const value = process.env[name];
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value.toLowerCase() === "true";
}
export const config = {
    nodeEnv: getEnvVar("NODE_ENV", "development"),
    port: getEnvVarAsNumber("PORT", 3001),
    oauth: {
        clientId: getEnvVar("OAUTH_CLIENT_ID"),
        clientSecret: getEnvVar("OAUTH_CLIENT_SECRET"),
        callbackUrl: getEnvVar("OAUTH_CALLBACK_URL"),
        serverUrl: getEnvVar("OAUTH_SERVER_URL"),
        appScopes: getEnvVar("OAUTH_APP_SCOPES").split(" "),
        ...(process.env.OAUTH_SERVICE_CLIENT_ID && {
            serviceClientId: process.env.OAUTH_SERVICE_CLIENT_ID,
        }),
        ...(process.env.OAUTH_SERVICE_CLIENT_SECRET && {
            serviceClientSecret: process.env.OAUTH_SERVICE_CLIENT_SECRET,
        }),
        // authorizationUrl: getEnvVar('OAUTH_AUTHORIZATION_URL'),
        // tokenUrl: getEnvVar('OAUTH_TOKEN_URL'),
        // userProfileUrl: getEnvVar('OAUTH_USER_PROFILE_URL'),
    },
    cors: {
        origins: getEnvVar("CORS_ORIGINS", "http://localhost:5173")
            .split(",")
            .map((origin) => origin.trim()),
    },
    rateLimit: {
        global: getEnvVarAsNumber("RATE_LIMIT_GLOBAL", 100),
        windowMs: getEnvVarAsNumber("RATE_LIMIT_WINDOW_MS", 1000),
    },
    swagger: {
        enabled: getEnvVarAsBoolean("ENABLE_SWAGGER", true),
    },
    //   session: {
    //     secret: getEnvVar('SESSION_SECRET'),
    //     cookieDomain: process.env.SESSION_COOKIE_DOMAIN || undefined,
    //   },
    logging: {
        level: getEnvVar("LOG_LEVEL", "info"),
    },
    development: {
        bypassAuth: getEnvVarAsBoolean("BYPASS_AUTH", false),
    },
    //   externalApps: {
    //     recruiterUrl: getEnvVar('RECRUITER_APP_URL', 'https://recruiter-staging.up.railway.app/'),
    //   },
    aws: {
        accessKeyId: getEnvVar("AWS_ACCESS_KEY_ID"),
        secretAccessKey: getEnvVar("AWS_SECRET_ACCESS_KEY"),
        region: getEnvVar("AWS_DEFAULT_REGION"),
        bucketName: getEnvVar("AWS_S3_BUCKET_NAME"),
        endpointUrl: getEnvVar("AWS_ENDPOINT_URL"),
    },
};
export default config;
//# sourceMappingURL=config.js.map