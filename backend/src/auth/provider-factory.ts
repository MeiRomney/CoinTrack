import { MockAuthProvider } from "./mock-provider.ts";

interface AuthProvider {
  name: string;
  initiateLogin(params: any): Promise<any>;
  completeLogin(params: any): Promise<any>;
  logout(params: any): Promise<void>;
}

let authProvider: AuthProvider | null = null;

export function getAuthProvider(): AuthProvider {
  if (!authProvider) {
    if (isMockAuthEnabled()) {
      authProvider = new MockAuthProvider();
    } else {
      throw new Error("No auth provider configured");
    }
  }
  return authProvider;
}

export function isMockAuthEnabled(): boolean {
  return process.env.AUTH_PROVIDER === "mock" || !process.env.AUTH_PROVIDER;
}
