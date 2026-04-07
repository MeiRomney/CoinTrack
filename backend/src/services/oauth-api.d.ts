interface UserRoleInfo {
    roleId: string;
    roleName: string;
}
interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organizationId: string;
    roleIds?: string[];
}
interface CreatedUser {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    organizationId: string;
    isActive: boolean;
    createdAt: string;
}
/**
 * OAuth Server API Client
 * Uses client credentials flow for machine-to-machine communication
 */
declare class OAuthApiClient {
    private client;
    private accessToken;
    private tokenExpiresAt;
    constructor();
    /**
     * Get access token using client credentials flow
     */
    private getAccessToken;
    /**
     * Get user's role assignments from OAuth server
     * Returns array of role names
     * @param userId - The user ID to fetch roles for
     * @param organizationId - The organization ID (required for client credentials auth)
     */
    /**
     * Get all users with roles for an organization (cached for batch operations)
     */
    private orgUsersCache;
    private ORG_USERS_CACHE_TTL;
    private getOrgUsersWithRoles;
    /**
     * Get all users in an organization with their basic info and roles
     * This is the source of truth for org membership
     * @param organizationId - The organization ID
     * @returns Array of users with id, username, email, firstName, lastName, isActive, createdAt, and roles
     */
    getOrganizationUsers(organizationId: string): Promise<Array<{
        id: string;
        username: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        isActive: boolean;
        createdAt: string;
        roles: string[];
    }>>;
    getUserRoles(userId: string, organizationId: string): Promise<string[]>;
    /**
     * Get user's role assignments with IDs
     * @param userId - The user ID to fetch roles for
     * @param organizationId - The organization ID (required for client credentials auth)
     */
    getUserRolesWithIds(userId: string, organizationId: string): Promise<UserRoleInfo[]>;
    /**
     * Get multiple users' roles in batch
     * @param userIds - Array of user IDs
     * @param organizationId - The organization ID (required for client credentials auth)
     */
    getUsersRolesBatch(userIds: string[], organizationId: string): Promise<Record<string, string[]>>;
    /**
     * Get all roles for an organization
     */
    getOrganizationRoles(organizationId: string): Promise<Array<{
        id: string;
        name: string;
    }>>;
    /**
     * Update user's RBAC settings (roles and direct permissions)
     */
    updateUserRBAC(userId: string, data: {
        organizationId?: string | null;
        roleIds?: string[];
        permissionIds?: string[];
    }): Promise<boolean>;
    /**
     * Update user's team and role assignments
     * Removes existing university:team:* and university:role:* role assignments,
     * then adds the new ones while preserving other role assignments
     */
    updateUserTeamAndRole(userId: string, newTeamRoleName: string | null, newUserRoleName: string | null, organizationId: string, currentRoles: UserRoleInfo[]): Promise<boolean>;
    /**
     * Create a new user in the OAuth server
     * Used for team member invitations
     */
    createUser(input: CreateUserInput): Promise<CreatedUser>;
    /**
     * Create user and assign team/role in one operation
     * Returns the created user with assigned roles
     */
    createUserWithTeamAndRole(input: {
        username: string;
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        organizationId: string;
    }, teamRoleName: string | null, userRoleName: string | null): Promise<CreatedUser>;
}
export declare const oauthApi: OAuthApiClient;
export {};
//# sourceMappingURL=oauth-api.d.ts.map