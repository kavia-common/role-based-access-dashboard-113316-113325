# Supabase Integration and RBAC Schema

This project leverages **Supabase** for robust authentication, RBAC (Role-Based Access Control), user/organization management, and fine-grained row-level access using RLS (Row Level Security). The integration is securely handled with environment-based configuration and is demo-ready with seed scripts.

---

## Core Integration

- **Supabase Client Initialization**:  
  Client is set up in [`react_frontend/src/config/supabase.js`](../react_frontend/src/config/supabase.js) using:
  - `REACT_APP_SUPABASE_URL`
  - `REACT_APP_SUPABASE_KEY` (anon/public, never the service role key)
- Do _not_ expose service role keys in browser or client config.

---

## Database Schema & Tables

- **`auth.users`**  
  Default Supabase authentication users table (handles email/password signups, email confirmation, sessions, etc).

- **`profiles`** (RBAC extension):  
  ```sql
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('superadmin','orgadmin','admin','user','guest')),
    organization_id TEXT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ```
- **Organizations:**
  ```sql
  CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );
  ```

> See the provided seed SQL in [`assets/supabase-seed-demo.sql`](./supabase-seed-demo.sql) for example inserts and migrations.

---

## RBAC Role/Permissions Model

- **Central Permissions Matrix:**  
  Defined in [`react_frontend/src/config/permissions.js`](../react_frontend/src/config/permissions.js).
  - Supports: `superadmin`, `orgadmin`, `admin`, `user`, `guest`
- **All per-feature permissions are checked in the frontend** using `can(permission)` and **enforced in the backend** by RLS.

---

## Row Level Security (RLS) Policies

- **`profiles` table RLS example:**
  ```sql
  -- Only allow a user to view/edit their own profile, unless superadmin/orgadmin
  CREATE POLICY "Allow user or admin access to own row" ON profiles
    FOR SELECT USING (
      auth.uid() = id
      OR role IN ('superadmin','orgadmin')
    );

  -- Allow only superadmins/orgadmins to update roles
  CREATE POLICY "Allow admin role updates" ON profiles
    FOR UPDATE USING (
      role IN ('superadmin','orgadmin')
    );
  ```
- RLS ensures that the client cannot circumvent security, even with crafted requests.

---

## Demo Data & Seeding

- Follow [`assets/supabase-demo-seed-guide.md`](./supabase-demo-seed-guide.md) for human steps on:
  - Registering users (via UI or Supabase Auth).
  - Assigning orgs/roles.
  - Editing and executing the provided SQL for demo orgs/profiles.

  **Reminder:** Always create users through your app or the Supabase Auth UI first. You cannot insert directly into `auth.users` with SQL.

---

## Edge Functions – Secure User Invitation (Optional)

- Implement an Edge Function (`invite_user`) to safely allow only backend-initiated invitations (and to protect the service role key).
- Frontend integration:
  ```js
  fetch('/functions/v1/invite_user', {
    method: 'POST',
    body: JSON.stringify({ email, role, org_id }),
    headers: { 'Content-Type': 'application/json' }
  })
  ```
- Only backend or Edge Functions should perform privileged operations.
- **Never** expose the service role key to the client.

---

## Verification & Testing

- Use seed guide and demo SQL to load users/orgs and assign roles.
- Log in as various users and confirm dashboard/feature access matches their RBAC.
- For backend verification or RLS policy testing, query the database from the SQL Editor as different roles, or attempt forbidden API calls.

---

For details of the permissions matrix, onboarding, and setup, see:
- [`react_frontend/README.md`](../react_frontend/README.md)
- [`assets/supabase-demo-seed-guide.md`](./supabase-demo-seed-guide.md)

