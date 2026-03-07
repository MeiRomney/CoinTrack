import React, { useEffect } from "react";
import { useAuth } from "../../contexts/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredScopes?: string[];
  requiredRoles?: string[];
}

/**
 * Protected route component that redirects unauthenticated users to OAuth
 * For OAuth flow, users are sent directly to OAuth server (not /login page)
 */
export function ProtectedRoute({
  children,
  requiredScopes,
  requiredRoles,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    isProcessingCallback,
    hasScope,
    hasRole,
    redirectToAuth,
  } = useAuth();

  // Redirect to OAuth if not authenticated
  // BUT don't redirect if we're processing a login callback (race condition prevention)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isProcessingCallback) {
      // Store current URL so user returns here after auth
      redirectToAuth(window.location.href);
    }
  }, [isLoading, isAuthenticated, isProcessingCallback, redirectToAuth]);

  // Show loading while checking auth OR processing callback
  if (isLoading || isProcessingCallback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show loading while redirect happens
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Check scope requirements
  if (requiredScopes && !hasScope(requiredScopes)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Required scopes: {requiredScopes.join(", ")}
          </p>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You don't have the required role to access this page.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Required roles: {requiredRoles.join(", ")}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
