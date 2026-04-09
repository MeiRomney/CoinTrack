import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth-context";
import { getApiUrl } from "../lib/auth-utils";

export interface UserPreferences {
  userId: string;
  theme: "light" | "dark";
  language: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
}

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = async () => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(getApiUrl("/api/account/preferences"), {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch preferences");
      }

      const data = await response.json();
      setPreferences(data.preferences);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch preferences";
      setError(message);
      setPreferences(null);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (
    updates: Partial<UserPreferences>,
  ): Promise<UserPreferences> => {
    try {
      const response = await fetch(getApiUrl("/api/account/preferences"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      const data = await response.json();
      setPreferences(data.preferences);
      setError(null);
      return data.preferences;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update preferences";
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences,
  };
}
