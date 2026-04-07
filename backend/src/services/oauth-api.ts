import axios from "axios";
import type { AxiosInstance } from "axios";
import config from "../config.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger();

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
class OAuthApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: config.oauth.serverUrl,
      timeout: 10000,
    });
  }

  /**
   * Get access token using client credentials flow
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    try {
      // Use service client credentials if available, otherwise use app credentials
      const clientId = config.oauth.serviceClientId || config.oauth.clientId;
      const clientSecret =
        config.oauth.serviceClientSecret || config.oauth.clientSecret;

      const response = await axios.post(
        `${config.oauth.serverUrl}/oauth2/token`,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope:
            "auth:organization:users auth:organization:users:create auth:organization:users:modify:roles auth:organization:roles",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      // Handle both camelCase and snake_case responses
      const accessToken =
        response.data.accessToken || response.data.access_token;
      const expiresIn = response.data.accessTokenExpiresAt
        ? new Date(response.data.accessTokenExpiresAt).getTime() - Date.now()
        : (response.data.expires_in || 3600) * 1000;

      this.accessToken = accessToken;
      this.tokenExpiresAt = Date.now() + expiresIn;

      logger.info("OAuth API client token obtained", {
        tokenPrefix: accessToken?.substring(0, 20) + "...",
        expiresIn: Math.round(expiresIn / 1000) + "s",
      });
      return accessToken;
    } catch (error: any) {
      logger.error("Failed to obtain OAuth client credentials token:", {
        error: error.message,
        status: error.response?.status,
      });
      throw new Error("Failed to authenticate with OAuth server");
    }
  }

  /**
   * Get user's role assignments from OAuth server
   * Returns array of role names
   * @param userId - The user ID to fetch roles for
   * @param organizationId - The organization ID (required for client credentials auth)
   */
  /**
   * Get all users with roles for an organization (cached for batch operations)
   */
  private orgUsersCache: {
    organizationId: string;
    users: any[];
    timestamp: number;
  } | null = null;
  private ORG_USERS_CACHE_TTL = 5000; // 5 seconds

  private async getOrgUsersWithRoles(organizationId: string): Promise<any[]> {
    // Return cached if valid
    if (
      this.orgUsersCache &&
      this.orgUsersCache.organizationId === organizationId &&
      Date.now() - this.orgUsersCache.timestamp < this.ORG_USERS_CACHE_TTL
    ) {
      return this.orgUsersCache.users;
    }

    const token = await this.getAccessToken();

    const response = await this.client.get(`/api/users/rbac`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        organizationId,
        limit: 500, // Get all users in org
      },
    });

    const users = response.data.users || [];
    logger.info("Fetched org users from OAuth", {
      organizationId,
      userCount: users.length,
    });

    // Cache the result
    this.orgUsersCache = { organizationId, users, timestamp: Date.now() };
    return users;
  }

  /**
   * Get all users in an organization with their basic info and roles
   * This is the source of truth for org membership
   * @param organizationId - The organization ID
   * @returns Array of users with id, username, email, firstName, lastName, isActive, createdAt, and roles
   */
  async getOrganizationUsers(organizationId: string): Promise<
    Array<{
      id: string;
      username: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      isActive: boolean;
      createdAt: string;
      roles: string[];
    }>
  > {
    try {
      const users = await this.getOrgUsersWithRoles(organizationId);

      return users.map((user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        isActive: user.isActive ?? true,
        createdAt: user.createdAt,
        roles: (user.userRoleAssignments || [])
          .map((ura: any) => ura.role?.name)
          .filter(Boolean),
      }));
    } catch (error: any) {
      logger.error("Failed to fetch organization users from OAuth:", {
        organizationId,
        error: error.message,
        status: error.response?.status,
      });
      return [];
    }
  }

  async getUserRoles(
    userId: string,
    organizationId: string,
  ): Promise<string[]> {
    try {
      const users = await this.getOrgUsersWithRoles(organizationId);
      const user = users.find((u: any) => u.id === userId);

      if (!user) {
        logger.warn("User not found in org users", { userId, organizationId });
        return [];
      }

      // Extract role names from userRoleAssignments
      const roleNames = (user.userRoleAssignments || [])
        .map((ura: any) => ura.role?.name)
        .filter(Boolean);
      return roleNames;
    } catch (error: any) {
      logger.error("Failed to fetch user roles from OAuth:", {
        userId,
        organizationId,
        error: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      return [];
    }
  }

  /**
   * Get user's role assignments with IDs
   * @param userId - The user ID to fetch roles for
   * @param organizationId - The organization ID (required for client credentials auth)
   */
  async getUserRolesWithIds(
    userId: string,
    organizationId: string,
  ): Promise<UserRoleInfo[]> {
    try {
      const users = await this.getOrgUsersWithRoles(organizationId);
      const user = users.find((u: any) => u.id === userId);

      if (!user) {
        return [];
      }

      return (user.userRoleAssignments || [])
        .filter((ura: any) => ura.role)
        .map((ura: any) => ({
          roleId: ura.role.id,
          roleName: ura.role.name,
        }));
    } catch (error: any) {
      logger.error("Failed to fetch user roles with IDs from OAuth:", {
        userId,
        organizationId,
        error: error.message,
        status: error.response?.status,
      });
      return [];
    }
  }

  /**
   * Get multiple users' roles in batch
   * @param userIds - Array of user IDs
   * @param organizationId - The organization ID (required for client credentials auth)
   */
  async getUsersRolesBatch(
    userIds: string[],
    organizationId: string,
  ): Promise<Record<string, string[]>> {
    const results: Record<string, string[]> = {};

    try {
      // Fetch all org users once (uses cache)
      const allOrgUsers = await this.getOrgUsersWithRoles(organizationId);

      // Map roles for requested user IDs
      for (const userId of userIds) {
        const user = allOrgUsers.find((u: any) => u.id === userId);
        if (user) {
          results[userId] = (user.userRoleAssignments || [])
            .map((ura: any) => ura.role?.name)
            .filter(Boolean);
        } else {
          results[userId] = [];
        }
      }
    } catch (error: any) {
      logger.error("Failed to fetch users roles batch from OAuth:", {
        userIds,
        organizationId,
        error: error.message,
      });
      // Return empty arrays for all users on error
      for (const userId of userIds) {
        results[userId] = [];
      }
    }

    return results;
  }

  /**
   * Get all roles for an organization
   */
  async getOrganizationRoles(
    organizationId: string,
  ): Promise<Array<{ id: string; name: string }>> {
    const token = await this.getAccessToken();

    try {
      const response = await this.client.get(`/api/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          organizationId,
        },
      });

      return (response.data.roles || []).map((r: any) => ({
        id: r.id,
        name: r.name,
      }));
    } catch (error: any) {
      logger.error("Failed to fetch organization roles from OAuth:", {
        organizationId,
        error: error.message,
        status: error.response?.status,
      });
      return [];
    }
  }

  /**
   * Update user's RBAC settings (roles and direct permissions)
   */
  async updateUserRBAC(
    userId: string,
    data: {
      organizationId?: string | null;
      roleIds?: string[];
      permissionIds?: string[];
    },
  ): Promise<boolean> {
    const token = await this.getAccessToken();

    try {
      await this.client.put(`/api/users/${userId}/rbac`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      logger.info("Updated user RBAC via OAuth API", { userId, ...data });
      return true;
    } catch (error: any) {
      logger.error("Failed to update user RBAC via OAuth:", {
        userId,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error("Failed to update user permissions");
    }
  }

  /**
   * Update user's team and role assignments
   * Removes existing university:team:* and university:role:* role assignments,
   * then adds the new ones while preserving other role assignments
   */
  async updateUserTeamAndRole(
    userId: string,
    newTeamRoleName: string | null,
    newUserRoleName: string | null,
    organizationId: string,
    currentRoles: UserRoleInfo[],
  ): Promise<boolean> {
    // Get all roles for the organization to find IDs by name
    const orgRoles = await this.getOrganizationRoles(organizationId);

    // Filter out existing team/role assignments, keep others
    const otherRoleIds = currentRoles
      .filter(
        (r) =>
          !r.roleName.startsWith("university:team:") &&
          !r.roleName.startsWith("university:role:"),
      )
      .map((r) => r.roleId);

    // Find role IDs for new team/role
    const newRoleIds = [...otherRoleIds];

    if (newTeamRoleName) {
      const teamRole = orgRoles.find((r) => r.name === newTeamRoleName);
      if (teamRole) {
        newRoleIds.push(teamRole.id);
      } else {
        logger.warn(`Team role not found: ${newTeamRoleName}`);
      }
    }

    if (newUserRoleName) {
      const userRole = orgRoles.find((r) => r.name === newUserRoleName);
      if (userRole) {
        newRoleIds.push(userRole.id);
      } else {
        logger.warn(`User role not found: ${newUserRoleName}`);
      }
    }

    return this.updateUserRBAC(userId, { roleIds: newRoleIds });
  }

  /**
   * Create a new user in the OAuth server
   * Used for team member invitations
   */
  async createUser(input: CreateUserInput): Promise<CreatedUser> {
    const token = await this.getAccessToken();

    try {
      const response = await this.client.post("/api/users", input, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      logger.info("Created user via OAuth API", {
        userId: response.data.user.id,
        email: input.email,
        organizationId: input.organizationId,
      });

      return response.data.user;
    } catch (error: any) {
      logger.error("Failed to create user via OAuth:", {
        email: input.email,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Preserve specific error messages from OAuth server
      if (error.response?.data?.error_description) {
        throw new Error(error.response.data.error_description);
      }
      throw new Error("Failed to create user in authentication server");
    }
  }

  /**
   * Create user and assign team/role in one operation
   * Returns the created user with assigned roles
   */
  async createUserWithTeamAndRole(
    input: {
      username: string;
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      organizationId: string;
    },
    teamRoleName: string | null,
    userRoleName: string | null,
  ): Promise<CreatedUser> {
    // Get role IDs for the team and role names
    const orgRoles = await this.getOrganizationRoles(input.organizationId);
    const roleIds: string[] = [];

    if (teamRoleName) {
      const teamRole = orgRoles.find((r) => r.name === teamRoleName);
      if (teamRole) {
        roleIds.push(teamRole.id);
      } else {
        logger.warn(
          `Team role not found during user creation: ${teamRoleName}`,
        );
      }
    }

    if (userRoleName) {
      const userRole = orgRoles.find((r) => r.name === userRoleName);
      if (userRole) {
        roleIds.push(userRole.id);
      } else {
        logger.warn(
          `User role not found during user creation: ${userRoleName}`,
        );
      }
    }

    const createUserInput: CreateUserInput = {
      ...input,
    };

    if (roleIds.length > 0) {
      createUserInput.roleIds = roleIds;
    }

    return this.createUser(createUserInput);
  }
}

// Export singleton instance
export const oauthApi = new OAuthApiClient();
