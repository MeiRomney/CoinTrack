export interface Config {
    nodeEnv: string;
    port: number;
    oauth: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
        serverUrl: string;
        appScopes: string[];
        serviceClientId?: string;
        serviceClientSecret?: string;
    };
    cors: {
        origins: string[];
    };
    rateLimit: {
        global: number;
        windowMs: number;
    };
    swagger: {
        enabled: boolean;
    };
    session?: {
        secret: string;
        cookieDomain?: string;
    };
    logging: {
        level: string;
    };
    development: {
        bypassAuth: boolean;
    };
    externalApps?: {
        recruiterUrl: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        bucketName: string;
        endpointUrl: string;
    };
}
export declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map