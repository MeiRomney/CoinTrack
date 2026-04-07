import { MockAuthProvider } from "./mock-provider.js";
let authProvider = null;
export function getAuthProvider() {
    if (!authProvider) {
        if (isMockAuthEnabled()) {
            authProvider = new MockAuthProvider();
        }
        else {
            throw new Error("No auth provider configured");
        }
    }
    return authProvider;
}
export function isMockAuthEnabled() {
    return process.env.AUTH_PROVIDER === "mock" || !process.env.AUTH_PROVIDER;
}
//# sourceMappingURL=provider-factory.js.map