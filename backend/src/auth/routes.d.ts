import type { Request } from "express";
interface SessionData {
    codeVerifier?: string;
    state?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: {
        id: string;
        email: string;
        username: string;
        name?: string;
        organizationId?: string;
        roles: string[];
        scopes: string[];
    };
}
declare global {
    namespace Express {
        interface Request {
            session: SessionData & {
                destroy(callback?: (err: Error | null) => void): void;
            };
            sessionID?: string;
        }
    }
}
declare const authRouter: import("express-serve-static-core").Router;
export declare function ensureAuthenticated(req: Request, res: any, next: any): void;
export declare function ensureRole(requiredRoles: string | string[]): (req: Request, res: any, next: any) => void;
export declare function ensureScope(requiredScopes: string | string[]): (req: Request, res: any, next: any) => void;
export default authRouter;
//# sourceMappingURL=routes.d.ts.map