# Components Documentation

## ProtectedRoute Component

The `ProtectedRoute` component provides authentication and role-based access control for React Router routes. It integrates seamlessly with the Supabase authentication system.

### Features

- **Authentication Check**: Verifies user is logged in before allowing access
- **Role-Based Access**: Restricts access based on user roles (admin, user, guest)
- **Multiple Role Support**: Accepts single role or array of allowed roles
- **Custom Fallbacks**: Configurable loading, access denied, and redirect components
- **Automatic Redirects**: Redirects unauthenticated users to login page
- **State Preservation**: Saves attempted route for redirect after login

### Basic Usage

```jsx
import { ProtectedRoute } from './components';

// Protect route for any authenticated user
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />

// Protect route for admin users only
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminPanel />
  </ProtectedRoute>
} />

// Protect route for multiple roles
<Route path="/user" element={
  <ProtectedRoute requiredRole={['user', 'admin']}>
    <UserContent />
  </ProtectedRoute>
} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The protected content to render |
| `requiredRole` | `string \| string[]` | `null` | Required role(s) to access the route |
| `redirectTo` | `string` | `'/login'` | Path to redirect if not authenticated |
| `fallback` | `React.ReactNode` | Loading component | Custom loading component |
| `accessDenied` | `React.ReactNode` | Access denied message | Custom access denied component |

### Examples

#### Basic Authentication Protection
```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

#### Role-Specific Access
```jsx
<ProtectedRoute requiredRole="admin">
  <AdminSettings />
</ProtectedRoute>
```

#### Multiple Roles
```jsx
<ProtectedRoute requiredRole={['user', 'admin']}>
  <SharedContent />
</ProtectedRoute>
```

#### Custom Redirect
```jsx
<ProtectedRoute redirectTo="/signin">
  <ProtectedContent />
</ProtectedRoute>
```

#### Custom Loading Component
```jsx
<ProtectedRoute fallback={<CustomSpinner />}>
  <SlowLoadingComponent />
</ProtectedRoute>
```

#### Custom Access Denied
```jsx
<ProtectedRoute 
  requiredRole="admin"
  accessDenied={<CustomAccessDenied />}
>
  <AdminOnly />
</ProtectedRoute>
```

### Integration with Authentication Context

The `ProtectedRoute` component uses the following methods from the authentication context:

- `isAuthenticated()`: Checks if user is logged in
- `getUserRole()`: Gets the current user's role
- `loading`: Shows loading state during authentication check

### Role Hierarchy

The system supports three main roles:
- **guest**: Basic access (all authenticated users)
- **user**: Standard user access
- **admin**: Full administrative access

### Error Handling

- **Not Authenticated**: Redirects to login page with return URL
- **Insufficient Role**: Shows access denied message with current role
- **Loading State**: Shows loading indicator during authentication check
- **Missing Role**: Treats as no role assigned, shows in access denied message

### Security Notes

- Always wrap sensitive routes with `ProtectedRoute`
- Use specific roles rather than relying on client-side checks alone
- Ensure backend APIs also validate user roles
- Consider using route guards at the application level for additional security
