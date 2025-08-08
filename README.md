# RBAC Team Dashboard

A minimal, modern web application demonstrating **Role-Based Access Control** (RBAC) using Supabase for authentication, user management, and Row Level Security (RLS). Users are assigned roles that dictate their dashboard experience and permissions—including fine-grained access for super admins, organization admins, regular users, and guests.

---

## Key Features

- User registration and login via Supabase Auth.
- Centralized roles and permissions matrix (`react_frontend/src/config/permissions.js`).
- Dashboard and route protection using RBAC logic.
- Organization and role mapping for demo/testing.
- Super-admin, org-admin, user, and guest dashboards.
- Invitation flows and RLS-backed security.
- Minimal, responsive React UI (no heavy UI libraries).
- Easy demo-data seeding with onboarding script.

---

## Project Structure

- **Frontend:** [`react_frontend/`](./react_frontend) — React app (minimal) with role-based UI and Supabase integration.
- **Supabase Seed:** [`assets/supabase-seed-demo.sql`](./assets/supabase-seed-demo.sql) and [`assets/supabase-demo-seed-guide.md`](./assets/supabase-demo-seed-guide.md)
- **Supabase Integration & Auth:** Configuration and notes in [`assets/supabase.md`](./assets/supabase.md)
- **RBAC Permissions:** Matrix config at [`react_frontend/src/config/permissions.js`](./react_frontend/src/config/permissions.js)

---

## Prerequisites

- Node.js & npm
- [Supabase](https://supabase.com/) project

---

## Setup & Onboarding

1. **Clone this Repo**
   ```
   git clone <repo-url>
   cd role-based-access-dashboard-113316-113325
   ```

2. **Configure Supabase Project**
   - Create a new Supabase project.
   - Set up Auth: Enable email signups and logins.
   - [Optional] Add organizations and profiles tables using seed SQL below.

3. **Environment Variables**
   - Copy/rename `.env.example` (if present) to `.env` in `react_frontend/`
   - Set the following variables (get from your Supabase project dashboard):
     ```
     REACT_APP_SUPABASE_URL=https://<your-project>.supabase.co
     REACT_APP_SUPABASE_KEY=<your-anon-public-key>
     ```
   - (You can also set `REACT_APP_SITE_URL` for email redirects, if needed.)

4. **Install Frontend Dependencies**
   ```
   cd react_frontend
   npm install
   ```

5. **Seed Demo Data (Optional but recommended for demo/testing)**
   - See [`assets/supabase-demo-seed-guide.md`](./assets/supabase-demo-seed-guide.md) for:
       - Creating demo users
       - Assigning roles
       - Running the seed script
       - RLS verification workflow

6. **Run the Application**
   ```
   npm start
   ```
   - Open http://localhost:3000 to view the app.

---

## RBAC Model & Permissions

- **Roles:** `superadmin`, `orgadmin`, `admin`, `user`, `guest`
- **Config:** See [`react_frontend/src/config/permissions.js`](./react_frontend/src/config/permissions.js)

| Role         | Permissions (Actions Enabled)                                                                 |
|--------------|----------------------------------------------------------------------------------------------|
| superadmin   | All (view_dashboard, manage_admins, manage_orgs, edit_profile, invite_user, feature_x/y ...) |
| orgadmin     | org management, edit, invite, view users, feature_x                                          |
| admin        | view dashboard, edit profile, invite user, view users                                        |
| user         | view dashboard, edit profile                                                                 |
| guest        | view dashboard (limited)                                                                     |

- The full permissions matrix is viewable in the UI (`<PermissionsMatrix />` in Super Admin dashboard).

---

## Supabase Integration & RLS

- Backend uses `auth.users` and a linked `profiles` table with (at minimum) columns: `id` (PK, FK to auth.users), `role`, `organization_id`.
- Row Level Security (RLS) policies restrict data access by role.
- **Login/registration** handled via Supabase Auth API.
- **Invitations** (optional, for demos/enterprises) use Edge Function or backend-only logic—never expose the service role key.
- Full details and SQL examples in [`assets/supabase.md`](./assets/supabase.md).

---

## Demo Data & Testing

See [`assets/supabase-demo-seed-guide.md`](./assets/supabase-demo-seed-guide.md) for a full walkthrough on:

- Registering demo users
- Assigning users to organizations/roles
- Seeding example data with [`assets/supabase-seed-demo.sql`](./assets/supabase-seed-demo.sql)
- Verifying RLS and RBAC dashboards

---

## Deployment

1. **Frontend:** Deploy the contents of `react_frontend/` using your preferred host (Vercel, Netlify, custom server, etc).
2. **Environment:** Ensure the environment variables (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_KEY`) are set in production.
3. **Supabase:** Database, tables, and RLS policies must be pre-seeded or migrated.
4. **Adjust Site URL:** Set `REACT_APP_SITE_URL` in the environment if using email confirmation links.

---

## .env Example

```
REACT_APP_SUPABASE_URL=https://your.supabase.co
REACT_APP_SUPABASE_KEY=your-anon-key
```

---

## RLS Policy Verification Walkthrough

1. Complete seeding and onboarding.
2. Log in as different roles (superadmin, orgadmin, user, guest).
3. Attempt various dashboard actions (view users, invite, edit profile, etc).
4. Confirm that each role only sees and can access what they're authorized for in both the UI *and* via API requests (blocked by backend policies).
5. For RLS debugging, use Supabase SQL Editor to manually query as roles.

---

## Further Documentation

- [Frontend README](./react_frontend/README.md)
- [Supabase integration and schema details](./assets/supabase.md)
- [Demo data seeding and verification guide](./assets/supabase-demo-seed-guide.md)

---

**For troubleshooting, see Supabase and React logs, and check that environment variables are set and database migrations are complete.**
