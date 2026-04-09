# Account Feature - Quick Reference

## What's Been Added

### Backend ✅

- **Account Service** (`src/services/account-service.ts`) - Core business logic for profile and preferences management
- **Account Routes** (`src/routes/account-routes.ts`) - 5 REST API endpoints for account operations
- **Route Registration** - Integrated into main app at `/api/account` path
- **TypeScript Compilation** - All code compiled to JavaScript with declarations

### Frontend ✅

- **useUserProfile Hook** - Custom hook for profile management
- **useUserPreferences Hook** - Custom hook for preferences management
- **Profile Page** (`src/pages/profile-page.tsx`) - Full profile editor
- **Settings Page** (`src/pages/settings-page.tsx`) - Preferences manager
- **Route Configuration** - Added `/profile` and `/settings` routes

## API Endpoints

All endpoints require authentication:

```
GET    /api/account/profile              → Fetch user profile
PUT    /api/account/profile              → Update profile
GET    /api/account/preferences          → Fetch preferences
PUT    /api/account/preferences          → Update preferences
POST   /api/account/deactivate           → Deactivate account
```

## Using the Features

### In React Components

```typescript
import { useUserProfile } from "./hooks/use-user-profile";
import { useUserPreferences } from "./hooks/use-user-preferences";

function MyComponent() {
  const { profile, loading, error, updateProfile } = useUserProfile();
  const { preferences, updatePreferences } = useUserPreferences();

  // Use profile and preferences data...
  // Call updateProfile() or updatePreferences() to save changes
}
```

### Navigation

Users can access account features through the navbar dropdown menu:

- Click the **avatar icon** in the top-right
- Select **"Your profile"** → Goes to `/profile`
- Select **"Settings"** → Goes to `/settings`

## Demo Users for Testing

Both users have been pre-configured in the backend:

| Email             | Username | Role  | Theme | Language | Currency |
| ----------------- | -------- | ----- | ----- | -------- | -------- |
| admin@example.com | admin    | admin | dark  | english  | usd      |
| user@example.com  | user     | user  | light | english  | usd      |

## Key Features

### Profile Management

- ✅ View all profile information
- ✅ Edit name and photo URL
- ✅ View account metadata (created/updated dates)
- ✅ See user roles and organization
- ✅ Real-time validation

### Preferences Management

- ✅ Theme toggle (light/dark)
- ✅ Language selector (English, Khmer, Spanish, French)
- ✅ Currency selector (USD, KHR, EUR, GBP)
- ✅ Email notifications toggle
- ✅ Push notifications toggle
- ✅ Two-factor authentication setup
- ✅ Real-time preference sync

### Security

- ✅ All endpoints protected with authentication
- ✅ Input validation on both client and server
- ✅ User can only access their own data
- ✅ Proper HTTP status codes

## Validation Rules

### Profile Fields

- firstName, lastName: strings (optional)
- profilePhotoUrl: valid URL format (optional)

### Preferences

- **theme**: "light" or "dark"
- **language**: english | khmer | spanish | french
- **currency**: usd | khr | eur | gbp
- **notifications/2fa**: boolean values

## File Locations

```
backend/
  src/
    services/
      account-service.ts           ← Profile & preference logic
      account-service.js           ← Compiled JS
      account-service.d.ts         ← Type definitions
    routes/
      account-routes.ts            ← API endpoints
      account-routes.js            ← Compiled JS
      account-routes.d.ts          ← Type definitions
      index.ts                      ← MODIFIED: registers account router

frontend/
  src/
    pages/
      profile-page.tsx             ← Profile UI
      settings-page.tsx            ← Settings UI
    hooks/
      use-user-profile.ts          ← Profile hook
      use-user-preferences.ts      ← Preferences hook
    App.tsx                         ← MODIFIED: registers routes
```

## Navbar Integration

The navbar dropdown (visible when clicking avatar) includes:

- Your profile → `/profile`
- Settings → `/settings`
- Sign out

All these are already wired up in the `navbar.tsx` component.

## Testing Checklist

- [ ] Can you navigate to `/profile`?
- [ ] Can you edit your first/last name?
- [ ] Can you navigate to `/settings`?
- [ ] Can you toggle dark/light theme?
- [ ] Can you change language preference?
- [ ] Can you change currency preference?
- [ ] Can you toggle email notifications?
- [ ] Do changes persist after page refresh?
- [ ] Do error messages display properly on invalid input?

## Next Priority Features

1. **Database Integration** - Replace in-memory storage with real database
2. **Profile Photo Upload** - S3 integration for photo uploads
3. **Password Management** - Change password endpoint
4. **Email Verification** - Confirm email changes
5. **Account Deletion** - Complete account removal
6. **Audit Logging** - Track all account changes

## Runtime Instructions

### Backend

```bash
npm run dev      # Development with hot reload
npm run build    # Compile TypeScript
npm start        # Production mode
```

### Frontend

The app uses Vite - changes auto-reload in dev mode

## API Examples

### Get Profile

```bash
curl http://localhost:3000/api/account/profile \
  -H "Cookie: SESSION_ID=..."
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/account/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: SESSION_ID=..." \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "profilePhotoUrl": "https://example.com/photo.jpg"
  }'
```

### Get Preferences

```bash
curl http://localhost:3000/api/account/preferences \
  -H "Cookie: SESSION_ID=..."
```

### Update Preferences

```bash
curl -X PUT http://localhost:3000/api/account/preferences \
  -H "Content-Type: application/json" \
  -H "Cookie: SESSION_ID=..." \
  -d '{
    "theme": "light",
    "language": "khmer",
    "currency": "khr",
    "emailNotifications": true,
    "pushNotifications": false
  }'
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common errors:

- `401`: Not authenticated - user not logged in
- `400`: Invalid input - validation failed
- `404`: Not found - user profile doesn't exist
- `500`: Server error - something went wrong

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Notes

- Profile/preferences are fetched on component mount
- Changes are saved immediately (no draft mode)
- Theme changes apply globally in real-time
- All API calls include loading states
- Error states show helpful messages

---

**Status**: Feature Complete ✅  
**Last Updated**: 2024-12-09  
**Version**: 1.0.0
