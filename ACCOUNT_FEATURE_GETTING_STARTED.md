# Account Feature - Getting Started Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm run build    # Compile TypeScript (includes new account files)
npm run dev      # Start development server
```

The backend will be available at `http://localhost:3000` with these new endpoints:

- GET/PUT `/api/account/profile`
- GET/PUT `/api/account/preferences`
- POST `/api/account/deactivate`

### 2. Frontend Setup

```bash
cd frontend
npm run dev      # Start development server
```

The frontend will be available at `http://localhost:5173` (or similar)

### 3. Access the Features

Once both servers are running:

1. **Register/Login** - Go through normal auth flow
2. **Navigate to Profile** - Click avatar icon in navbar → "Your profile" → `/profile`
3. **Navigate to Settings** - Click avatar icon in navbar → "Settings" → `/settings`

## Testing with Demo Users

The backend includes two demo users:

**Admin User:**

- Email: admin@example.com
- Username: admin
- Role: admin

**Regular User:**

- Email: user@example.com
- Username: user
- Role: user

Both have demo profiles and preferences already configured.

## What You Can Do Now

### Profile Page (`/profile`)

- View your full profile information
- Edit your first and last name
- Update your profile photo URL
- View account metadata (when created, last updated)
- See your roles and organization

### Settings Page (`/settings`)

- **Display Settings**:
  - Toggle between light and dark theme (syncs with app theme)
  - Select language (English, Khmer, Spanish, French)
  - Select currency (USD, KHR, EUR, GBP)

- **Notification Settings**:
  - Enable/disable email notifications
  - Enable/disable push notifications

- **Security Settings**:
  - Toggle two-factor authentication

## API Endpoints Reference

### Get Your Profile

```bash
GET /api/account/profile
Response: { success: true, user: {...} }
```

### Update Your Profile

```bash
PUT /api/account/profile
Body: {
  firstName?: string,
  lastName?: string,
  profilePhotoUrl?: string
}
Response: { success: true, user: {...} }
```

### Get Your Preferences

```bash
GET /api/account/preferences
Response: { success: true, preferences: {...} }
```

### Update Your Preferences

```bash
PUT /api/account/preferences
Body: {
  theme?: "light" | "dark",
  language?: string,        // english, khmer, spanish, french
  currency?: string,        // usd, khr, eur, gbp
  emailNotifications?: boolean,
  pushNotifications?: boolean,
  twoFactorEnabled?: boolean
}
Response: { success: true, preferences: {...} }
```

### Deactivate Account

```bash
POST /api/account/deactivate
Response: { success: true, message: "Account deactivated successfully" }
```

## Component Locations

### Custom Hooks

- `frontend/src/hooks/use-user-profile.ts` - Profile data management
- `frontend/src/hooks/use-user-preferences.ts` - Preferences data management

### Pages

- `frontend/src/pages/profile-page.tsx` - Profile editor UI
- `frontend/src/pages/settings-page.tsx` - Preferences manager UI

### Backend Services

- `backend/src/services/account-service.ts` - Profile/preferences logic
- `backend/src/routes/account-routes.ts` - API endpoints

## Usage Examples

### Using Profile Hook in Components

```typescript
import { useUserProfile } from "../hooks/use-user-profile";

export function MyComponent() {
  const { profile, loading, error, updateProfile } = useUserProfile();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleUpdateName = async () => {
    await updateProfile({
      firstName: "John",
      lastName: "Doe"
    });
  };

  return (
    <div>
      <p>Welcome, {profile?.firstName}</p>
      <button onClick={handleUpdateName}>Update Name</button>
    </div>
  );
}
```

### Using Preferences Hook in Components

```typescript
import { useUserPreferences } from "../hooks/use-user-preferences";

export function MyComponent() {
  const { preferences, loading, updatePreferences } = useUserPreferences();

  const handleThemeChange = async (isDark: boolean) => {
    await updatePreferences({
      theme: isDark ? "dark" : "light"
    });
  };

  return (
    <div>
      Current theme: {preferences?.theme}
      <button onClick={() => handleThemeChange(true)}>Dark Mode</button>
    </div>
  );
}
```

## File Import Paths

### From Inside a Page Component

```typescript
// Correct paths from pages/
import { useUserProfile } from "../hooks/use-user-profile";
import { Label } from "../ui-kits/fieldset";
import { Switch } from "../ui-kits/switch";
import { useTheme } from "../contexts/theme-context";
```

### From Inside a Hook

```typescript
// Correct paths from hooks/
import { useAuth } from "../contexts/auth-context";
import { getApiUrl } from "../lib/auth-utils";
```

## Troubleshooting

### "Cannot find module" errors

- Check import paths use correct relative paths
- Frontend paths go from `src/` directory
- E.g., from `pages/profile-page.tsx` → `../hooks/` or `../ui-kits/`

### API returns 401 Unauthorized

- User is not authenticated
- Check that user is properly logged in
- Session/cookies might have expired

### Profile data not updating

- Check browser console for API errors
- Verify the request body is correct JSON
- Ensure all required fields are provided

### Theme changes not persisting

- Theme context updates are provided by useTheme
- Preferences API call must complete successfully
- Check browser DevTools Network tab for errors

## Production Checklist

Before deploying to production:

- [ ] Replace in-memory storage with database
- [ ] Add environment variables for API base URL
- [ ] Set up CORS for production domains
- [ ] Enable HTTPS for all API calls
- [ ] Add rate limiting to API endpoints
- [ ] Set up email verification for profile changes
- [ ] Implement proper error logging
- [ ] Add test coverage for API endpoints
- [ ] Set up monitoring/alerting for API errors
- [ ] Document all new API endpoints in Swagger

## Performance Optimization Ideas

1. **Caching**: Cache profile/preferences on client
2. **Debouncing**: Debounce preference updates while user is typing
3. **Pagination**: If adding more profile data
4. **Image Optimization**: Compress profile photos before upload
5. **GraphQL**: Consider migrating from REST to GraphQL

## Security Considerations

✅ Already Implemented:

- Authentication required on all endpoints
- Input validation on client and server
- User can only access their own data
- Proper HTTP status codes

🔐 Should Add:

- Rate limiting on preference updates
- CSRF token validation
- Audit logging for profile changes
- Data encryption for sensitive fields
- Two-factor authentication enforcement

## Next Steps

1. **Test the feature** - Use the demo users to test functionality
2. **Add database** - Replace in-memory storage with real database
3. **Photo upload** - Implement S3 integration for profile photos
4. **Email verification** - Add email confirmation for changes
5. **Enhanced security** - Add 2FA, audit logs, rate limiting

## Support & Documentation

- **Detailed Guide**: See `ACCOUNT_FEATURE_GUIDE.md`
- **Quick Reference**: See `ACCOUNT_FEATURE_QUICK_REFERENCE.md`
- **Implementation Status**: See `ACCOUNT_FEATURE_IMPLEMENTATION_COMPLETE.md`

## Summary

You now have a complete, fully functional account management system with:

- ✅ User profile management
- ✅ Preference settings (theme, language, currency)
- ✅ Notification preferences
- ✅ Security settings interface
- ✅ Full frontend UI
- ✅ Complete REST APIs
- ✅ Ready for database integration

Everything is wired up and ready to use! 🎉

---

**Last Updated**: 2024-12-09
**Status**: Ready to Use ✅
