import { getLogger } from "../utils/logger.js";
const logger = getLogger();
// In-memory storage for demo (replace with database in production)
const userProfiles = new Map();
const userPreferences = new Map();
// Initialize with demo data
const initializeDemoData = () => {
    const demoProfile = {
        id: "user-1",
        email: "admin@example.com",
        username: "admin",
        firstName: "Admin",
        lastName: "User",
        profilePhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        organizationId: "org-1",
        roles: ["admin"],
        scopes: ["read", "write"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const demoPreferences = {
        userId: "user-1",
        theme: "dark",
        language: "english",
        currency: "usd",
        emailNotifications: true,
        pushNotifications: false,
        twoFactorEnabled: false,
    };
    userProfiles.set("user-1", demoProfile);
    userPreferences.set("user-1", demoPreferences);
    const demoProfile2 = {
        id: "user-2",
        email: "user@example.com",
        username: "user",
        firstName: "Regular",
        lastName: "User",
        organizationId: "org-1",
        roles: ["user"],
        scopes: ["read"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const demoPreferences2 = {
        userId: "user-2",
        theme: "light",
        language: "english",
        currency: "usd",
        emailNotifications: true,
        pushNotifications: true,
        twoFactorEnabled: false,
    };
    userProfiles.set("user-2", demoProfile2);
    userPreferences.set("user-2", demoPreferences2);
};
initializeDemoData();
/**
 * Account Service
 * Handles all user profile and preference operations
 */
export class AccountService {
    /**
     * Get user profile by ID
     */
    static getProfile(userId) {
        const profile = userProfiles.get(userId);
        if (!profile) {
            logger.warn(`Profile not found for user: ${userId}`);
            return null;
        }
        return profile;
    }
    /**
     * Get all user profiles (admin only)
     */
    static getAllProfiles() {
        return Array.from(userProfiles.values());
    }
    /**
     * Update user profile
     */
    static updateProfile(userId, updates) {
        const profile = userProfiles.get(userId);
        if (!profile) {
            logger.warn(`Cannot update profile - user not found: ${userId}`);
            return null;
        }
        const updatedProfile = {
            ...profile,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        userProfiles.set(userId, updatedProfile);
        logger.info(`Profile updated for user: ${userId}`, { updates });
        return updatedProfile;
    }
    /**
     * Get user preferences
     */
    static getPreferences(userId) {
        const preferences = userPreferences.get(userId);
        if (!preferences) {
            // Return default preferences if not found
            const defaultPrefs = {
                userId,
                theme: "dark",
                language: "english",
                currency: "usd",
                emailNotifications: true,
                pushNotifications: false,
                twoFactorEnabled: false,
            };
            userPreferences.set(userId, defaultPrefs);
            return defaultPrefs;
        }
        return preferences;
    }
    /**
     * Update user preferences
     */
    static updatePreferences(userId, updates) {
        let preferences = userPreferences.get(userId);
        if (!preferences) {
            // Create default preferences if not found
            preferences = {
                userId,
                theme: "dark",
                language: "english",
                currency: "usd",
                emailNotifications: true,
                pushNotifications: false,
                twoFactorEnabled: false,
            };
        }
        const updatedPreferences = {
            ...preferences,
            ...updates,
        };
        userPreferences.set(userId, updatedPreferences);
        logger.info(`Preferences updated for user: ${userId}`, { updates });
        return updatedPreferences;
    }
    /**
     * Delete user account (soft delete - keep data for recovery)
     */
    static deactivateAccount(userId) {
        const profile = userProfiles.get(userId);
        if (!profile) {
            logger.warn(`Cannot deactivate account - user not found: ${userId}`);
            return false;
        }
        // In production, mark as deleted rather than removing
        const deactivatedProfile = {
            ...profile,
            updatedAt: new Date().toISOString(),
        };
        userProfiles.set(userId, deactivatedProfile);
        logger.info(`Account deactivated for user: ${userId}`);
        return true;
    }
    /**
     * Validate theme preference
     */
    static isValidTheme(theme) {
        return ["light", "dark"].includes(theme);
    }
    /**
     * Validate language preference
     */
    static isValidLanguage(language) {
        const validLanguages = ["english", "khmer", "spanish", "french"];
        return validLanguages.includes(language.toLowerCase());
    }
    /**
     * Validate currency preference
     */
    static isValidCurrency(currency) {
        const validCurrencies = ["usd", "khr", "eur", "gbp"];
        return validCurrencies.includes(currency.toLowerCase());
    }
}
export default AccountService;
//# sourceMappingURL=account-service.js.map