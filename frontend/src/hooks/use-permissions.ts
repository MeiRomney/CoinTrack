import { useState, useEffect } from "react";
import { getApiUrl } from "../lib/auth-utils";

export interface UserPermissions {
  userRole: string | null;
  companyTeam: string | null;
  userType: string | null;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch(getApiUrl("/api/profile"), {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPermissions({
          userRole: data.user?.userRole || null,
          companyTeam: data.user?.companyTeam || null,
          userType: data.user?.userType || null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user permissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if user has access based on role and/or team.
   * All arguments must match (AND operation).
   * Chain multiple calls with || for OR operations.
   *
   * @example
   * hasAccess('Admin') // User must be Admin
   * hasAccess('Finance') // User must be in Finance team
   * hasAccess('Admin', 'Finance') // User must be Admin AND in Finance team
   * hasAccess('Owner') || hasAccess('Admin', 'Full_Access') // Owner OR (Admin AND Full_Access)
   */
  const hasAccess = (...requirements: string[]): boolean => {
    if (!permissions || requirements.length === 0) return false;

    return requirements.every((requirement) => {
      return (
        permissions.userRole === requirement ||
        permissions.companyTeam === requirement
      );
    });
  };

  return {
    permissions,
    isLoading,
    hasAccess,
  };
}
