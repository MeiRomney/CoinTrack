export var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
export class ConsoleLogger {
    level;
    constructor(level = LogLevel.INFO) {
        this.level = level;
    }
    shouldLog(level) {
        const levels = [
            LogLevel.ERROR,
            LogLevel.WARN,
            LogLevel.INFO,
            LogLevel.DEBUG,
        ];
        const currentLevelIndex = levels.indexOf(this.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` ${JSON.stringify(context)}` : "";
        return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
    }
    error(message, context) {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage(LogLevel.ERROR, message, context));
        }
    }
    warn(message, context) {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage(LogLevel.WARN, message, context));
        }
    }
    info(message, context) {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage(LogLevel.INFO, message, context));
        }
    }
    debug(message, context) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
        }
    }
}
// Logger factory function to allow for easy switching between implementations
export function createLogger(level) {
    const logLevel = level || LogLevel.INFO;
    return new ConsoleLogger(logLevel);
}
// Global logger instance
let globalLogger;
export function getLogger() {
    if (!globalLogger) {
        globalLogger = createLogger(process.env.LOG_LEVEL);
    }
    return globalLogger;
}
export function setLogger(logger) {
    globalLogger = logger;
}
//# sourceMappingURL=logger.js.map