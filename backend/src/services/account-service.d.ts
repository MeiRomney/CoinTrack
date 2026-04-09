export interface UserProfile {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profilePhotoUrl?: string;
    organizationId?: string;
    roles?: string[];
    scopes?: string[];
    createdAt?: string;
    updatedAt?: string;
}
export interface UserPreferences {
    userId: string;
    theme: "light" | "dark";
    language: string;
    currency: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    twoFactorEnabled: boolean;
}
export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    profilePhotoUrl?: string;
}
export interface UpdatePreferencesRequest {
    theme?: "light" | "dark";
    language?: string;
    currency?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
}
/**
 * Account Service
 * Handles all user profile and preference operations
 */
export declare class AccountService {
    /**
     * Get user profile by ID
     */
    static getProfile(userId: string): UserProfile | null;
    /**
     * Get all user profiles (admin only)
     */
    static getAllProfiles(): UserProfile[];
    /**
     * Update user profile
     */
    static updateProfile(userId: string, updates: UpdateProfileRequest): UserProfile | null;
    /**
     * Get user preferences
     */
    static getPreferences(userId: string): UserPreferences | null;
    /**
     * Update user preferences
     */
    static updatePreferences(userId: string, updates: UpdatePreferencesRequest): UserPreferences | null;
    /**
     * Delete user account (soft delete - keep data for recovery)
     */
    static deactivateAccount(userId: string): boolean;
    /**
     * Validate theme preference
     */
    static isValidTheme(theme: string): boolean;
    /**
     * Validate language preference
     */
    static isValidLanguage(language: string): boolean;
    /**
     * Validate currency preference
     */
    static isValidCurrency(currency: string): boolean;
}
export default AccountService;
//# sourceMappingURL=account-service.d.ts.map