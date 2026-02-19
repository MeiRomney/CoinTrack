export declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
export interface LogContext {
    [key: string]: any;
}
export interface ILogger {
    error(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
}
export declare class ConsoleLogger implements ILogger {
    private level;
    constructor(level?: LogLevel);
    private shouldLog;
    private formatMessage;
    error(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
}
export declare function createLogger(level?: string): ILogger;
export declare function getLogger(): ILogger;
export declare function setLogger(logger: ILogger): void;
//# sourceMappingURL=logger.d.ts.map