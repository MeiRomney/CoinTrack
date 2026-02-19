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

export class MockAuthProvider {
  name = "mock";

  private mockUsers: AuthUser[] = [
    {
      id: "user-1",
      email: "admin@example.com",
      username: "admin",
      name: "Admin User",
      roles: ["admin"],
      scopes: ["read", "write"],
    },
    {
      id: "user-2",
      email: "user@example.com",
      username: "user",
      name: "Regular User",
      roles: ["user"],
      scopes: ["read"],
    },
  ];

  async initiateLogin(params: {
    codeVerifier: string;
    state: string;
  }): Promise<AuthResult> {
    return {
      success: true,
      requiresRedirect: false,
    };
  }

  async completeLogin(params: any): Promise<AuthResult> {
    const { userId, userType, firstName, lastName } = params;

    if (userId) {
      const user = this.mockUsers.find((u) => u.id === userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        user,
        tokens: {
          accessToken: `mock-access-${userId}`,
          refreshToken: `mock-refresh-${userId}`,
        },
      };
    }

    // OAuth flow - not implemented in mock
    return {
      success: false,
      error: "OAuth not supported in mock mode",
    };
  }

  async logout(params: {
    accessToken: string;
    refreshToken: string;
  }): Promise<void> {
    // Mock logout - no-op
  }

  async listUsers(): Promise<AuthUser[]> {
    return this.mockUsers;
  }
}
