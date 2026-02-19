export interface AuthUser {
    id: string;
    email: string;
    username: string;
    name?: string;
    organizationId?: string;
    roles: string[];
    scopes: string[];
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface AuthResult {
    success: boolean;
    error?: string;
    user?: AuthUser;
    tokens?: AuthTokens;
    authUrl?: string;
    requiresRedirect?: boolean;
}
export declare class MockAuthProvider {
    name: string;
    private mockUsers;
    initiateLogin(params: {
        codeVerifier: string;
        state: string;
    }): Promise<AuthResult>;
    completeLogin(params: any): Promise<AuthResult>;
    logout(params: {
        accessToken: string;
        refreshToken: string;
    }): Promise<void>;
    listUsers(): Promise<AuthUser[]>;
}
//# sourceMappingURL=mock-provider.d.ts.map