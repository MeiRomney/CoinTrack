# Account Feature Implementation Guide

## Overview

This document describes the complete account management feature that has been added to both the backend and frontend of the CoinTrack application.

## Features Implemented

### 1. Backend Account Service (`backend/src/services/account-service.ts`)

A comprehensive service for managing user profiles and preferences with in-memory storage (ready for database integration).

**Key Methods:**

- `getProfile(userId)` - Retrieve user profile information
- `updateProfile(userId, updates)` - Update user profile (name, photo)
- `getPreferences(userId)` - Get user preferences (theme, language, currency, notifications)
- `updatePreferences(userId, updates)` - Update user preferences
- `deactivateAccount(userId)` - Soft-delete user account
- `isValidTheme()`, `isValidLanguage()`, `isValidCurrency()` - Validation methods

**Data Models:**

```typescript
interface UserProfile {
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

interface UserPreferences {
  userId: string;
  theme: "light" | "dark";
  language: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
}
```

### 2. Backend Account Routes (`backend/src/routes/account-routes.ts`)

RESTful API endpoints for account operations:

**Endpoints:**

- `GET /api/account/profile` - Get current user's profile
- `PUT /api/account/profile` - Update current user's profile
- `GET /api/account/preferences` - Get current user's preferences
- `PUT /api/account/preferences` - Update current user's preferences
- `POST /api/account/deactivate` - Deactivate user account

**Authentication:**
All endpoints require authentication via the `ensureAuthenticated` middleware.

**Validation:**

- Theme: must be "light" or "dark"
- Language: english, khmer, spanish, french
- Currency: usd, khr, eur, gbp
- Notifications: boolean values
- Two-factor: boolean value

### 3. Frontend Custom Hooks

#### `use-user-profile.ts`

Hook for managing user profile data:

```typescript
const { profile, loading, error, updateProfile, refetch } = useUserProfile();
```

**Features:**

- Automatic profile fetching when user changes
- Update profile with validation
- Error handling and loading states
- Refetch capability

#### `use-user-preferences.ts`

Hook for managing user preferences:

```typescript
const { preferences, loading, error, updatePreferences, refetch } =
  useUserPreferences();
```

**Features:**

- Auto-fetch preferences on user change
- Update preferences with server validation
- Preference persistence across sessions
- Loading and error states

### 4. Frontend Pages

#### Profile Page (`frontend/src/pages/profile-page.tsx`)

A full-featured profile management interface with:

- Read-only fields: email, username, organization, roles
- Editable fields: first name, last name, profile photo URL
- Avatar display with upload indicator
- Account metadata (created/updated dates)
- Edit/Save/Cancel functionality
- Responsive design with dark mode support

**Features:**

- Full CRUD operations for profile data
- Real-time form state management
- Success/error feedback
- Loading states during API calls
- Mobile-responsive layout

#### Settings Page (`frontend/src/pages/settings-page.tsx`)

A comprehensive settings interface organized into sections:

**Display Section:**

- Theme toggle (light/dark mode synced with theme context)
- Language selector (English, Khmer, Spanish, French)
- Currency selector (USD, KHR, EUR, GBP)

**Notifications Section:**

- Email notifications toggle
- Push notifications toggle

**Security Section:**

- Two-factor authentication toggle

**Features:**

- Real-time theme updates
- Success notifications on save
- Grouped settings by category
- Icon-based navigation hints
- Dark mode support

### 5. Route Registration

Updated `backend/src/routes/index.ts` to register the account router:

```typescript
app.use("/api/account", accountRouter);
```

### 6. Frontend Routing

Updated `frontend/src/App.tsx` to include new routes:

```typescript
<Route path="profile" element={<ProfilePage />} />
<Route path="settings" element={<SettingsPage />} />
```

## Backend Integration

### Database Setup (TODO)

The current implementation uses in-memory storage for demo purposes. To integrate with a database:

1. Replace Map structures with database queries
2. Update AccountService methods to use your database client
3. Add database schema for users and preferences tables
4. Implement transaction handling for profile updates

### Example Database Schema (PostgreSQL)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_photo_url VARCHAR,
  organization_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  theme VARCHAR DEFAULT 'dark',
  language VARCHAR DEFAULT 'english',
  currency VARCHAR DEFAULT 'usd',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Frontend API Integration

### Authentication

All API calls automatically include credentials:

```typescript
fetch(getApiUrl("/api/account/profile"), {
  credentials: "include",
});
```

### Error Handling

All hooks provide error states for proper UI feedback:

```typescript
if (error) {
  return <div>Error: {error}</div>;
}
```

## Navigation Integration

The navbar already includes links to these new pages:

- "Your profile" → `/profile`
- "Settings" → `/settings`

These links are in the dropdown menu accessible via the avatar icon in the navbar.

## Demo Data

The backend includes demo users for testing:

- **User 1**: admin@example.com (username: admin)
  - Full profile data
  - Dark theme, English, USD
  - Admin role
- **User 2**: user@example.com (username: user)
  - Standard profile
  - Light theme, English, USD
  - User role

## API Response Examples

### Get Profile Response

```json
{
  "success": true,
  "user": {
    "id": "user-1",
    "email": "admin@example.com",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "profilePhotoUrl": "https://...",
    "organizationId": "org-1",
    "roles": ["admin"],
    "scopes": ["read", "write"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-12-09T10:30:00Z"
  }
}
```

### Update Preferences Response

```json
{
  "success": true,
  "preferences": {
    "userId": "user-1",
    "theme": "dark",
    "language": "khmer",
    "currency": "usd",
    "emailNotifications": true,
    "pushNotifications": false,
    "twoFactorEnabled": false
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200**: Success
- **400**: Invalid input
- **401**: Unauthorized
- **404**: Resource not found
- **500**: Internal server error

## Next Steps

1. **Database Integration**: Replace in-memory storage with actual database
2. **Email Verification**: Add email confirmation for profile updates
3. **Photo Upload**: Implement S3 integration for profile photo uploads
4. **Audit Logging**: Track profile changes for security
5. **Two-Factor Authentication**: Implement TOTP/SMS 2FA
6. **Password Management**: Add password change endpoint
7. **Account Deletion**: Implement complete account deletion (currently soft-delete)
8. **Activity History**: Track login and account activity

## Testing

### Backend Testing

```bash
# Test profile endpoint
curl -X GET http://localhost:3000/api/account/profile \
  -H "Cookie: SESSION_ID=..."

# Test preferences update
curl -X PUT http://localhost:3000/api/account/preferences \
  -H "Content-Type: application/json" \
  -H "Cookie: SESSION_ID=..." \
  -d '{"theme":"light","language":"khmer"}'
```

### Frontend Testing

1. Navigate to `/profile` to test profile management
2. Navigate to `/settings` to test preferences
3. Test theme changes apply globally
4. Verify all API calls include proper error handling

## Files Modified/Created

### Backend

- ✅ `src/services/account-service.ts` - NEW
- ✅ `src/routes/account-routes.ts` - NEW
- ✅ `src/routes/index.ts` - MODIFIED (added account router registration)
- ✅ Compiled to `src/services/account-service.js` and `.d.ts`
- ✅ Compiled to `src/routes/account-routes.js` and `.d.ts`

### Frontend

- ✅ `src/hooks/use-user-profile.ts` - NEW
- ✅ `src/hooks/use-user-preferences.ts` - NEW
- ✅ `src/pages/profile-page.tsx` - NEW
- ✅ `src/pages/settings-page.tsx` - NEW
- ✅ `src/App.tsx` - MODIFIED (added profile and settings routes)

## Architecture Notes

### Separation of Concerns

- **Service Layer**: Business logic in `account-service.ts`
- **Route Layer**: API handling in `account-routes.ts`
- **Hook Layer**: React state management in custom hooks
- **Component Layer**: UI rendering in page components

### State Management

- Account data flows from backend API through custom hooks to components
- Theme preference synced with global theme context
- Preferences automatically persisted on update

### Error Handling

- Try-catch blocks in all API operations
- User-friendly error messages
- Validation at both API and UI levels
- Loading states for all async operations

## Security Considerations

### Current Implementation

- ✅ Authentication required for all endpoints
- ✅ Role-based access control ready
- ✅ HTTPS/CORS support
- ✅ Input validation

### Future Improvements

- [ ] Rate limiting on preference updates
- [ ] Audit logging of profile changes
- [ ] Profile visibility permissions
- [ ] Data encryption for sensitive fields
- [ ] CSRF token validation
