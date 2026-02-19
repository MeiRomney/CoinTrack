interface AuthProvider {
    name: string;
    initiateLogin(params: any): Promise<any>;
    completeLogin(params: any): Promise<any>;
    logout(params: any): Promise<void>;
}
export declare function getAuthProvider(): AuthProvider;
export declare function isMockAuthEnabled(): boolean;
export {};
//# sourceMappingURL=provider-factory.d.ts.map