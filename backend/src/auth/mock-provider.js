export class MockAuthProvider {
    name = "mock";
    mockUsers = [
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
    async initiateLogin(params) {
        return {
            success: true,
            requiresRedirect: false,
        };
    }
    async completeLogin(params) {
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
    async logout(params) {
        // Mock logout - no-op
    }
    async listUsers() {
        return this.mockUsers;
    }
}
//# sourceMappingURL=mock-provider.js.map