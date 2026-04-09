import { useState, useEffect } from "react";
import { useUserPreferences } from "../hooks/use-user-preferences";
import { useTheme } from "../contexts/theme-context";
import { Switch, SwitchField } from "../ui-kits/switch";
import { Label } from "../ui-kits/fieldset";
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

export function SettingsPage() {
  const { preferences, loading, error, updatePreferences } =
    useUserPreferences();
  const { setTheme, actualTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    theme: preferences?.theme || "dark",
    language: preferences?.language || "english",
    currency: preferences?.currency || "usd",
    emailNotifications: preferences?.emailNotifications || true,
    pushNotifications: preferences?.pushNotifications || false,
    twoFactorEnabled: preferences?.twoFactorEnabled || false,
  });

  useEffect(() => {
    if (preferences) {
      setFormData({
        theme: preferences.theme,
        language: preferences.language,
        currency: preferences.currency,
        emailNotifications: preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications,
        twoFactorEnabled: preferences.twoFactorEnabled,
      });
    }
  }, [preferences]);

  const handleThemeChange = async (isDark: boolean) => {
    const newTheme = isDark ? "dark" : "light";
    setFormData((prev) => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
    await savePreferences({ theme: newTheme });
  };

  const handleLanguageChange = (language: string) => {
    setFormData((prev) => ({ ...prev, language }));
  };

  const handleCurrencyChange = (currency: string) => {
    setFormData((prev) => ({ ...prev, currency }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const savePreferences = async (updates = formData) => {
    try {
      setIsSaving(true);
      await updatePreferences(updates);
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error loading settings: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your preferences and account settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900 dark:text-green-200">
          {successMessage}
        </div>
      )}

      {/* Display Section */}
      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Display
        </h2>

        {/* Theme */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-gray-900 dark:text-white">
              Theme
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose between light and dark mode
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              color="orange"
              checked={actualTheme === "dark"}
              onChange={(checked) => handleThemeChange(checked)}
              title={
                actualTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {actualTheme === "dark" ? (
                <MoonIcon className="size-3 fill-blue-400" />
              ) : (
                <SunIcon className="size-3 fill-yellow-500" />
              )}
            </Switch>
          </div>
        </div>

        {/* Language */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <Label className="block font-medium text-gray-900 dark:text-white">
            Language
          </Label>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Select your preferred language
          </p>
          <select
            value={formData.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="english">English</option>
            <option value="khmer">Khmer</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
          </select>
        </div>

        {/* Currency */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <Label className="block font-medium text-gray-900 dark:text-white">
            Currency
          </Label>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Select your preferred currency for displaying prices
          </p>
          <select
            value={formData.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="usd">USD - US Dollar</option>
            <option value="khr">KHR - Cambodian Riel</option>
            <option value="eur">EUR - Euro</option>
            <option value="gbp">GBP - British Pound</option>
          </select>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <BellIcon className="h-5 w-5" />
          Notifications
        </h2>

        {/* Email Notifications */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
          <div>
            <Label className="font-medium text-gray-900 dark:text-white">
              Email Notifications
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive important updates via email
            </p>
          </div>
          <Switch
            color="orange"
            checked={formData.emailNotifications}
            onChange={(checked) =>
              handleNotificationChange("emailNotifications", checked)
            }
          />
        </div>

        {/* Push Notifications */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <Label className="font-medium text-gray-900 dark:text-white">
              Push Notifications
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get real-time alerts on your device
            </p>
          </div>
          <Switch
            color="orange"
            checked={formData.pushNotifications}
            onChange={(checked) =>
              handleNotificationChange("pushNotifications", checked)
            }
          />
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <LockClosedIcon className="h-5 w-5" />
          Security
        </h2>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-gray-900 dark:text-white">
              Two-Factor Authentication
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            color="orange"
            checked={formData.twoFactorEnabled}
            onChange={(checked) =>
              handleNotificationChange("twoFactorEnabled", checked)
            }
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => savePreferences()}
          disabled={isSaving}
          className="rounded-lg bg-orange-500 px-8 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
