# RBAC Team Dashboard - Full Application Documentation

## Overview

The Role-Based Access Control (RBAC) Team Dashboard is a modern, minimalistic web application that enables secure user registration, login, and dashboard views split by user role (admin, user, guest). It leverages Supabase for authentication and database, and a role-based `profiles` table for permission logic. The frontend is built using React, React Router, and vanilla CSS with a focus on clean, accessible, and fast UI/UX, making it well-suited for demonstration or rapid deployment.

---

## Architecture

### High-Level Architecture

```mermaid
graph TD
  A[React App Entry<br>(index.js)] --> B[App.js<br>Routing & Layout]
  B --> C1[AuthProvider<br>(contexts/AuthContext.js)]
  B --> C2[Header & Sidebar<br>Layout Components]
  B --> C3[Route Switching<br>+ProtectedRoute.js]
  C3 --> D1[Login/Register Modals]
  C3 --> D2[Dashboards:<br>Admin/User/Guest]
  C3 --> D3[ProfileDisplay]
  C1 --> E[Supabase Client<br>(config/supabase.js)]
  E --> F[Supabase SaaS<br>Auth & Database (profiles)]
```

### Major Layers & Components

- **Entry (index.js):** Boots up React, renders `<App />`.
- **App.js:** Sets up the Auth Provider, Router, Layout, and all page routing; implements dynamic rendering of role-based dashboard layouts.
- **Contexts/AuthContext.js:** Central place for user/session/auth state, role logic, Supabase calls, and auth utilities for the full app.
- **Config/supabase.js:** Initializes the Supabase client using environment variables; provides user/session helper functions.
- **Components:**
  - **Modals (LoginModal, RegisterModal):** Secure authentication flows.
  - **Dashboards:** 
    - **AdminDashboard:** Admin tools and user management.
    - **UserDashboard:** User stats and actions.
    - **GuestDashboard:** Limited features, profile info.
  - **ProfileDisplay:** Unified user info viewer.
  - **Layout/Header.js & Sidebar.js:** Navigation, logout, role-based sidebar with responsive and collapse behavior.
  - **ProtectedRoute.js:** Enforces authentication and role checks per route.

---

## Functional & Product Requirements

- **Authentication:**
  - User sign-up and sign-in via email/password (Supabase Auth).
  - Email confirmation and password reset (Supabase managed).
  - Session persistence and sign out.
- **RBAC (Role-Based Access Control):**
  - Roles: `admin`, `user`, `guest` (stored in Supabase `profiles` table, linked to `auth.users`).
  - Dashboard view and routing vary by user role.
  - Only admins access admin tools, only users/admins access user-things.
- **Profile Management:**
  - Profile display, role badge, and creation date.
  - Profile role is updatable only by admins.
- **Protected Routes:**
  - All main dashboards, user profile, and most content are protected by both authentication and role checks.
- **UI/UX:**
  - Responsive, accessible, mobile-supportive layout.
  - Collapsible sidebar; header with logo, user avatar, theme toggle, and logout.
  - Modal-based authentication: intuitive login/register/forgot with feedback.
  - Success/warning/error toasts and visual feedback.


---

## Supabase Integration & Required Environment

### Environment Required

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_KEY`
- `REACT_APP_SITE_URL` (for email redirects; often set in deployment)

### Supabase DB Schema & Security

- **Auth:** Uses Supabase's built-in email/password auth (`auth.users`).
- **Profiles Table:**

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guest')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS and policies as described in assets/supabase.md.
```

- **Role management:** Admin can update user roles (UI + update API through Supabase), enforced by table policies.
- **Row Level Security (RLS):** Strict access based on policies. Only users see their records; only admins can update other roles.

### Supabase Client Usage (config/supabase.js)

- Loads credentials from env.
- Provides helpers for current user/session and exports initialized client.

---

## Component & Feature Overview

### Core Components Tree

```mermaid
graph TD
  A[App.js]
  A --> B[AuthProvider (contexts/AuthContext.js)]
  A --> C[Header.js]
  A --> D[Sidebar.js]
  A --> E[<Routes> (react-router-dom)]
  E --> F1[ProtectedRoute]
  F1 --> G1[AdminDashboard]
  F1 --> G2[UserDashboard]
  F1 --> G3[GuestDashboard]
  F1 --> G4[ProfileDisplay]
  C --> H[Nav (role-based)]
```

### Auth Context (`src/contexts/AuthContext.js`)
Handles:
- User/session state and loading state.
- Supabase sign-in, sign-up, sign-out, and password reset.
- Profile creation (on sign-up) and role update (by admin).
- Role read helpers (getUserRole, isAdmin, hasRole).
- Exposes `isAuthenticated` and all role info to the app.

### Routing Structure & Role-Protection

- `/login` — (public) Modal-based auth interface.
- `/dashboard` — Authenticated, any role, routes to the right dashboard (automatic).
- `/admin` — Authenticated, admin only.
- `/user` — Authenticated, user or admin only.
- `/guest` — Authenticated, any role.
- `/profile` — Authenticated, any role (shows unified user info).
- `*` — 404, redirect to relevant entry point.

All protected routes use `<ProtectedRoute>` to enforce both authentication and (optionally) required roles.

### Role-Based Dashboards

#### AdminDashboard
- Shows user list, with role and creation date (all users).
- Allows admin to change user roles via dropdown (writes to Supabase).
- Displays quick stats: total users, admin/user/guest counts.
- Navigation to user/guest views and a refresh button.

#### UserDashboard
- Shows current user's profile (from auth and profiles), last sign-in, account age, and verification.
- Allows profile and activity overview, quick navigation, and account details.
- Admins accessing this see both user and admin capabilities.

#### GuestDashboard
- Minimal profile info.
- Welcome, time-of-day greeting, quick navigation, and limited feature set.
- Present for authenticated users without assigned roles (defaulted to guest).

#### ProfileDisplay
- Clean profile information: email, role, dates, status badges, refresh option.
- Pulls both auth info and `profiles` row.

### Modals: Login/Registration

- Modern centered modal with feedback for sign-in, registration, validation, password reset, and error handling.
- Covers the full authentication flow, including switching between sign-in and register modals.

### Layout: Header.js & Sidebar.js

#### Header
- Shows logo, page title, links based on user role, theme toggle, and logout.
- User avatar and basic dropdown for profile.

#### Sidebar
- Collapsible, responsive, role-aware.
- Shows navigation relevant for the user role.
- Includes "Current Role" badge in color.

---

## Role-Based Access Control Logic

- User session and role are checked on every protected route.
- AuthContext automatically loads/refreshes `profiles` info when session changes.
- All "admin" logic is visually and functionally separated; users cannot access admin UI or perform admin Supabase updates.
- Supabase-centric RLS ensures that even if a client attempts forbidden actions, backend enforces true permission boundaries.

---

## UI/UX Philosophy

- **Minimalist & Clean:** No external heavy UI frameworks, only vanilla CSS and some CSS variables. Layout responsive and simple to maintain brand consistency.
- **Accessible:** Clear color contrast, focus handling, and ARIA labels in components.
- **Modern:** Modals, animated loading, transitions, and feedback.
- **Consistent Branding:** Theme matches app (palette: primary=#eb8e24, secondary=#64748b, accent=#fbbf24), with light/dark theme toggle.
- **Mobile-Friendly:** Layout and sizing adapt on smaller screens.
- **Feedback-Forward:** All async actions (login, register, update, error) show success/warning/processing feedback.

---

## How it all connects

1. **App renders with AuthProvider and Router.**
2. User goes to `/login` and registers/signs in (modal flow, via Supabase).
3. After login, user lands on `/dashboard`. The app checks their role (`getUserRole`). Admin sees admin tools; user sees their dashboard; guest gets a basic welcome page.
4. All navigation is role-aware: users only see pages and controls they are entitled to.
5. Admins can change user roles; such changes update the `profiles` table in Supabase, thanks to secured API and RLS.
6. Profile info is available to each authenticated user, combining Auth and Supabase data.
7. UI adapts to modern device sizes, provides visual feedback, and is secure by design end-to-end.

---

## Further Development Opportunities

- Extend the dashboard with team/project management using the same RBAC strategy.
- Add audit logging and activity feed via additional Supabase tables.
- Integrate notifications or email reminders via Supabase's hooks.
- Expand theme customization, internationalization, or further accessibility auditing.

---

## Sources

- src/App.js
- src/contexts/AuthContext.js
- src/config/supabase.js
- src/components/ProtectedRoute.js
- src/components/Layout/Header.js
- src/components/Layout/Sidebar.js
- src/components/Dashboard/AdminDashboard.js
- src/components/Dashboard/UserDashboard.js
- src/components/Dashboard/GuestDashboard.js
- src/components/Profile/ProfileDisplay.js
- src/hooks/useAuth.js
- src/components/Auth/LoginModal.js
- src/components/Auth/RegisterModal.js
- assets/supabase.md

