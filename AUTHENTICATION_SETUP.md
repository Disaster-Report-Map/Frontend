# Authentication Setup Guide

## Folder Structure

```
src/
├── api/
│   ├── auth.ts          # Auth API endpoints
│   ├── client.ts        # Axios client with token injection
│   └── reports.ts       # Reports API
├── components/
│   └── auth/
│       ├── GoogleSignInButton.tsx
│       └── ProtectedRoute.tsx
├── hooks/
│   └── auth/
│       └── useAuth.ts   # Auth hook for Redux
├── middleware/
│   └── authMiddleware.ts # Redux middleware for token sync
├── stores/
│   ├── store.ts         # Redux store configuration
│   └── slices/
│       └── authSlice.ts # Auth state management
├── types/
│   └── auth.ts          # Auth TypeScript types
└── views/
    └── auth/
        ├── LoginView.tsx
        └── RegisterView.tsx
```

## Features

✅ **Redux State Management** - Centralized auth state
✅ **Token Storage** - Synced between Redux and localStorage
✅ **Auto Token Injection** - API client automatically adds token to requests
✅ **Google Sign-In** - Integrated with @react-oauth/google
✅ **Email/Password Auth** - Traditional login/register
✅ **Protected Routes** - Route protection (currently disabled for map)
✅ **Auto User Fetch** - Automatically fetches user on app load if token exists

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=https://disaster-report-map.onrender.com/api
VITE_GOOGLE_CLIENT_ID=455849152328-i6atf0i9isr8c4q4095ftiusnuvp1unv.apps.googleusercontent.com
```

## Usage

### Using Auth Hook

```tsx
import { useAuth } from './hooks/auth/useAuth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  // Use auth state and actions
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from './components/auth/ProtectedRoute'

<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <ProtectedComponent />
    </ProtectedRoute>
  }
/>
```

## Google Sign-In Note

Currently, the Google Sign-In uses access tokens. The backend expects ID tokens. 

**Option 1:** Update backend to accept access tokens and exchange them for user info
**Option 2:** Use Google Identity Services to get ID tokens directly (recommended)

For production, implement Google Identity Services for proper ID token flow.

## API Endpoints

- `POST /api/auth/login/` - Email/password login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/google/` - Google Sign-In
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Get current user

## Token Format

The API client uses `Token <token>` format for authentication headers.

