# React Frontend – RBAC Team Dashboard

A clean, minimal React app demonstrating Supabase-powered authentication with centralized roles/permissions, role-based dashboards, and strict RBAC protection.

---

## Features

- **Authentication**: Supabase email/password signup & login, modal-based flow, session persistence, logout.
- **RBAC (Role-Based Access Control):**  
  Profiles, role assignments, and permissions matrix defined in [`src/config/permissions.js`](./src/config/permissions.js)
- **Role-based UI:**  
  Dashboard, navigation, and interaction adapt to user’s role (`superadmin`, `orgadmin`, `admin`, `user`, `guest`).
- **Protected Routes:**  
  Using `<ProtectedRoute/>` for per-page RBAC enforcement.
- **Central AuthContext:**  
  Provides `user`, `role`, and `can(permission)` for convenient hooks/components use.
- **Organization-aware seeding:**  
  Demo org and user data ready for easy onboarding and RLS verification.
- **Modern, fully responsive UI:**  
  No external UI libraries—just React and CSS—branding set in `src/App.css`.

---

## Getting Started

1. **Configure Environment Variables**
   - Copy `.env.example` to `.env` (If not present, create a `.env` file):
     ```
     REACT_APP_SUPABASE_URL=https://<your-project>.supabase.co
     REACT_APP_SUPABASE_KEY=<your-anon-key>
     ```
   - Both must be valid and correspond to your Supabase dashboard [Project Settings > API].

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Start Dev Server**
   ```
   npm start
   ```
   - Runs on [http://localhost:3000](http://localhost:3000)

---

## RBAC & Permissions Matrix

- Permissions matrix declared in [`src/config/permissions.js`](./src/config/permissions.js):

| Role        | Permissions                                                                               |
|-------------|------------------------------------------------------------------------------------------|
| superadmin  | view_dashboard, manage_admins, manage_orgs, edit_profile, invite_user, view_users, ...    |
| orgadmin    | view_dashboard, manage_orgs, edit_profile, invite_user, view_users, ...                   |
| admin       | view_dashboard, edit_profile, invite_user, view_users                                     |
| user        | view_dashboard, edit_profile                                                              |
| guest       | view_dashboard (limited)                                                                  |

- All feature and navigation logic refer to this config.
- **UI Matrix:** Visualize the complete permissions model using the `<PermissionsMatrix />` component (found in the Super Admin dashboard).

**To update RBAC/permissions:**  
Update `src/config/permissions.js` only; changes propagate app-wide.

---

## Onboarding, Demo Users, & Seeding

- The app is demo-ready. See [`../assets/supabase-demo-seed-guide.md`](../assets/supabase-demo-seed-guide.md) for:
  - Registering demo users (UI or via Supabase dashboard)
  - Assigning orgs, roles, and running the SQL seed script for auto test/verification.
  - Explains expected dashboard results for each user role.
  - RLS walkthrough for real backend security verification.

---

## Environment Variables

The frontend consumes only these variables at build/runtime:

```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_KEY
```

Add these to `.env` (do NOT commit real values to the repo).

---

## Deployment

1. Build for production:
   ```
   npm run build
   ```
   Outputs to the `build/` directory for static hosting.
2. Deploy using Vercel, Netlify, Firebase, or your own server.
3. Set environment variables (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_KEY`) in your host’s settings/console.
4. Confirm that your Supabase DB is seeded and RLS is enabled before going live.

---

## Troubleshooting

- **Auth errors:**  
  - Double-check `.env` values.
  - Ensure your Supabase project allows email/password logins.
  - Check RLS policies if users can't access their dashboards.
- **Frontend issues:**  
  - Make sure all dependencies are installed (`npm ci`).
  - Clear browser cache or open private window for auth flow debugging.
- **RLS/Backend problems:**  
  - Use Supabase SQL Editor to validate data, log in as demo user roles for cross-checking.

---

## Frontend Customization

- **Brand Colors & Theme:**  
  Defined as CSS custom properties in [`src/App.css`](./src/App.css) for consistency.
- **Component Layering & Structure:**  
  See [Components Folder](./src/components/README.md) and code-level docstrings.

---

For full system, RBAC, schema, and demo data details, see the parent [`README.md`](../README.md) and Supabase guides under `assets/`.

