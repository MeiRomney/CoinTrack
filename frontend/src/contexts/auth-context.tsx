import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { getAuthUrl } from "../lib/auth-utils";

// Session check interval (60 seconds)
const SESSION_CHECK_INTERVAL = 60 * 1000;

// Get OAuth server URL from env (API)
const getOAuthServerUrl = () =>
  import.meta.env.VITE_OAUTH_SERVER_URL || "http://localhost:4000";

// Get OAuth frontend URL from env (UI for redirects)
const getOAuthFrontendUrl = () =>
  import.meta.env.VITE_OAUTH_FRONTEND_URL ||
  import.meta.env.VITE_OAUTH_SERVER_URL ||
  "http://localhost:4000";

export interface Impersonator {
  id: string;
  email: string;
  username: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  organizationId?: string;
  roles?: string[];
  scopes?: string[];
  profilePhotoUrl?: string;
  isImpersonation?: boolean;
  impersonator?: Impersonator | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isImpersonation: boolean;
  impersonator: Impersonator | null;
  /** True while processing an OAuth callback - prevents redirect races */
  isProcessingCallback: boolean;
  login: (options?: { returnUrl?: string; prompt?: string }) => void;
  logout: (options?: { returnUrl?: string }) => Promise<void>;
  checkAuth: () => Promise<void>;
  hasScope: (scope: string | string[]) => boolean;
  hasRole: (role: string | string[]) => boolean;
  redirectToAuth: (returnUrl?: string) => void;
  endImpersonation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImpersonation, setIsImpersonation] = useState(false);
  const [impersonator, setImpersonator] = useState<Impersonator | null>(null);
  const sessionCheckInterval = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Track if we're processing a login callback to prevent race conditions
  // with ProtectedRoute redirects
  const [isProcessingCallback, setIsProcessingCallback] = useState(() => {
    // Check on initial render if we're landing from a callback
    const params = new URLSearchParams(window.location.search);
    return params.get("login") === "success";
  });

  const isAuthenticated = !!user;

  /**
   * Redirect directly to OAuth server for authentication
   * @param returnUrl - URL to return to after successful auth (defaults to current page)
   */
  const redirectToAuth = useCallback(async (returnUrl?: string) => {
    const finalReturnUrl = returnUrl || window.location.href;

    // Get the auth URL from backend and redirect
    // Pass returnUrl to backend so it can redirect there after callback
    try {
      const loginUrl = new URL(
        getAuthUrl("/auth/login"),
        window.location.origin,
      );
      loginUrl.searchParams.set("returnUrl", finalReturnUrl);

      const response = await fetch(loginUrl.toString(), {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
          return;
        }
      }
    } catch (error) {
      console.error("Failed to get auth URL:", error);
    }

    // Fallback: redirect to backend login route directly (will handle OAuth redirect)
    window.location.href =
      getAuthUrl("/auth/login") +
      `?returnUrl=${encodeURIComponent(finalReturnUrl)}`;
  }, []);

  /**
   * Handle session expiry - logout and redirect back to current page after re-auth
   */
  const handleSessionExpiry = useCallback(async () => {
    console.log("[SESSION] Session expired - redirecting to auth");
    setUser(null);

    // Try to clear backend session (ignore errors)
    try {
      await fetch(getAuthUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore - session is already invalid
    }

    // Clear OAuth session then redirect back to current location
    const oauthServerUrl = getOAuthServerUrl();
    // Return to current page after re-auth (via callback which will redirect back)
    const returnUrl = window.location.href;
    // Store return URL in sessionStorage so callback can use it
    sessionStorage.setItem("auth_return_url", returnUrl);
    window.location.href = `${oauthServerUrl}/oauth2/logout?redirect_uri=${encodeURIComponent(window.location.origin + "/auth/callback?reauth=true")}`;
  }, []);

  // Periodic session check
  const startSessionCheck = useCallback(() => {
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
    }

    sessionCheckInterval.current = setInterval(async () => {
      if (!user) return;

      try {
        const response = await fetch(getAuthUrl("/auth/me"), {
          credentials: "include",
        });

        if (!response.ok || response.status === 401) {
          handleSessionExpiry();
        } else {
          const data = await response.json();
          if (!data.authenticated) {
            handleSessionExpiry();
          }
        }
      } catch (error) {
        console.error("[SESSION] Session check failed:", error);
        // Don't logout on network errors - could be temporary
      }
    }, SESSION_CHECK_INTERVAL);
  }, [user, handleSessionExpiry]);

  // Start/stop session check based on authentication state
  useEffect(() => {
    if (isAuthenticated) {
      startSessionCheck();
    } else if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }

    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [isAuthenticated, startSessionCheck]);

  // Check authentication status on mount and handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get("login");
    const logoutParam = urlParams.get("logout");

    // If we just logged out, clear everything
    if (logoutParam === "true" || logoutParam === "success") {
      console.log("[AUTH] Logout detected, clearing state");
      setUser(null);
      setIsImpersonation(false);
      setImpersonator(null);
      setIsLoading(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Handle OAuth callback success
    // Backend now redirects directly to the intended URL with ?login=success
    if (loginSuccess === "success") {
      // Clean up the URL (remove login=success param)
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search,
      );

      // Verify auth and clear processing flag
      checkAuth()
        .then(() => {
          setIsProcessingCallback(false);
        })
        .catch(() => {
          setIsProcessingCallback(false);
        });
    } else {
      checkAuth();
    }
  }, []);

  const checkAuth = async (redirectIfUnauthenticated = false) => {
    try {
      setIsLoading(true);
      const response = await fetch(getAuthUrl("/auth/me"), {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || data.user.username,
            organizationId: data.user.organizationId,
            roles: data.user.roles || [],
            scopes: data.user.scopes || [],
          });
          setIsImpersonation(
            data.isImpersonation || data.user.isImpersonation || false,
          );
          setImpersonator(data.impersonator || data.user.impersonator || null);
        } else {
          setUser(null);
          setIsImpersonation(false);
          setImpersonator(null);
          if (redirectIfUnauthenticated) {
            redirectToAuth();
          }
        }
      } else {
        setUser(null);
        if (redirectIfUnauthenticated) {
          redirectToAuth();
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initiate login flow
   * @param options.returnUrl - URL to return to after auth (defaults to current page)
   * @param options.prompt - 'login' to force re-authentication
   */
  const login = async (options?: { returnUrl?: string; prompt?: string }) => {
    const returnUrl = options?.returnUrl || window.location.href;

    // If not forcing re-auth, check if already authenticated
    if (!options?.prompt) {
      try {
        const meResponse = await fetch(getAuthUrl("/auth/me"), {
          credentials: "include",
        });

        if (meResponse.ok) {
          const meData = await meResponse.json();
          if (meData.authenticated && meData.user) {
            setUser({
              id: meData.user.id,
              email: meData.user.email,
              name: meData.user.name || meData.user.username,
              organizationId: meData.user.organizationId,
              roles: meData.user.roles || [],
              scopes: meData.user.scopes || [],
            });
            return;
          }
        }
      } catch {
        // Continue to OAuth flow
      }
    }

    // Get auth URL from backend (pass returnUrl so backend can redirect there after callback)
    try {
      const loginUrl = new URL(
        getAuthUrl("/auth/login"),
        window.location.origin,
      );
      loginUrl.searchParams.set("returnUrl", returnUrl);
      if (options?.prompt) {
        loginUrl.searchParams.set("prompt", options.prompt);
      }

      const response = await fetch(loginUrl.toString(), {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
          return;
        }
      }
    } catch (error) {
      console.error("Login initiation failed:", error);
    }

    // Fallback to direct OAuth redirect
    redirectToAuth(returnUrl);
  };

  /**
   * Logout user
   * @param options.returnUrl - URL to return to after logout (defaults to portal root)
   */
  const logout = async (options?: { returnUrl?: string }) => {
    const returnUrl = options?.returnUrl || window.location.origin;

    try {
      // Clear backend session and get OAuth logout URL
      const response = await fetch(getAuthUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        setUser(null);
        setIsImpersonation(false);
        setImpersonator(null);

        // If backend provided OAuth logout URL, use it
        if (data.oauthLogoutUrl) {
          window.location.href = data.oauthLogoutUrl;
          return;
        }
      }
    } catch {
      // Continue with logout even if backend call fails
    }

    setUser(null);
    setIsImpersonation(false);
    setImpersonator(null);

    // Clear OAuth session then redirect to return URL with logout flag
    const oauthServerUrl = getOAuthServerUrl();
    window.location.href = `${oauthServerUrl}/oauth2/logout?redirect_uri=${encodeURIComponent(returnUrl + "?logout=success")}`;
  };

  /**
   * End impersonation and return to admin session
   * Redirects to OAuth UI which has the session cookie with impersonation state
   */
  const endImpersonation = async () => {
    if (!isImpersonation) {
      console.warn("Not currently impersonating");
      return;
    }

    // Clear local impersonation state
    setIsImpersonation(false);
    setImpersonator(null);

    // Clear portal session (don't wait, don't redirect to OAuth logout)
    fetch(getAuthUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
    }).catch(() => {});

    // Redirect to OAuth UI management page
    // The OAuth UI has the session cookie and will auto-end impersonation
    const oauthFrontendUrl = getOAuthFrontendUrl();
    window.location.href = `${oauthFrontendUrl}/management/organizations?action=end-impersonation`;
  };

  const hasScope = (scope: string | string[]): boolean => {
    if (!user?.scopes) return false;
    const scopes = Array.isArray(scope) ? scope : [scope];
    return scopes.some((s) => user.scopes?.includes(s) ?? false);
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user?.roles) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.some((r) => user.roles?.includes(r) ?? false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isImpersonation,
        impersonator,
        isProcessingCallback,
        login,
        logout,
        checkAuth,
        hasScope,
        hasRole,
        redirectToAuth,
        endImpersonation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Higher-order component for protecting routes
 * Unauthenticated users are redirected directly to OAuth
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredScopes?: string[];
    requiredRoles?: string[];
    fallback?: React.ComponentType;
  },
) {
  return function AuthenticatedComponent(props: P) {
    const {
      isAuthenticated,
      isLoading,
      isProcessingCallback,
      hasScope,
      hasRole,
      redirectToAuth,
    } = useAuth();

    useEffect(() => {
      // Don't redirect while processing a login callback (race condition prevention)
      if (!isLoading && !isAuthenticated && !isProcessingCallback) {
        // Redirect to OAuth with return to current page
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
      if (options?.fallback) {
        const Fallback = options.fallback;
        return <Fallback />;
      }
      // Show loading while redirect happens
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    if (options?.requiredScopes && !hasScope(options.requiredScopes)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              You don't have the required permissions to access this page.
            </p>
          </div>
        </div>
      );
    }

    if (options?.requiredRoles && !hasRole(options.requiredRoles)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Access Denied
            </h2>
            <p className="text-muted-foreground">
              You don't have the required role to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export function useScopes() {
  const { hasScope, user } = useAuth();
  return {
    hasScope,
    scopes: user?.scopes || [],
    checkScopes: (scopes: string | string[]) => hasScope(scopes),
  };
}

export function useRoles() {
  const { hasRole, user } = useAuth();
  return {
    hasRole,
    roles: user?.roles || [],
    checkRoles: (roles: string | string[]) => hasRole(roles),
  };
}
