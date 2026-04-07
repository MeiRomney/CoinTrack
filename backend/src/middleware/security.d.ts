import type { Application } from "express";
export declare function configureSecurityMiddleware(app: Application): void;
export declare function sanitizeInput(input: string): string;
export declare function isValidEmail(email: string): boolean;
export declare function isValidUrl(url: string): boolean;
export declare function validateRequestBody(requiredFields?: string[]): (req: any, res: any, next: any) => any;
//# sourceMappingURL=security.d.ts.map