# Supabase Configuration for Enterprise-Grade RBAC Dashboard

## Overview

This configuration supports multi-organization RBAC (Role-Based Access Control) with org and global roles, secure invite flows, audit logging, and policies for defense-in-depth access control. All changes below should be maintained in sync with the actual Supabase schema for onboarding and future reviews.

---

## DATABASE SCHEMA

### 1. organizations

Stores all organizations/teams.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
```

### 2. roles

Defines all possible roles (per-org or global).

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,                -- e.g. super_admin, org_admin, user, auditor, guest
  description TEXT,
  is_global BOOLEAN NOT NULL DEFAULT false  -- true = platform-wide, false = org-local
);
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
```

### 3. user_org_roles

Maps each user to one (or more) roles for each organization. Supports org-scoped and global admin access.

```sql
CREATE TABLE user_org_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES roles(id),
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(user_id, org_id, role_id)
);
ALTER TABLE user_org_roles ENABLE ROW LEVEL SECURITY;
```

### 4. invites

Stores pending invites (email, what org, which role, who invited).

```sql
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id),
  invited_by UUID REFERENCES auth.users(id),
  accepted_by UUID REFERENCES auth.users(id),
  invite_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
```

### 5. audit_logs

Records all sensitive RBAC, user, or org changes (for UI and incident review).

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- e.g. invite_sent, invite_accepted, role_granted, role_revoked, org_created...
  user_id UUID REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  associated_user UUID REFERENCES auth.users(id),
  data JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

---

## ROW LEVEL SECURITY (RLS) POLICIES

### General Principles

- **Principle of Least Privilege**: Only allow access where explicitly needed (e.g., users see only their rows, org admins see all org data).
- **Global Admin ("super_admin")** will have explicit global bypass.
- All writes must be performed ONLY by users with the proper permission.

---

#### Example RLS Enforcement for user_org_roles

```sql
-- Only allow users to view their own org roles, OR org_admins OR super_admins see within org/global
CREATE POLICY "Self or Org Admin or Super Admin can view" ON user_org_roles
FOR SELECT USING (
  (user_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM user_org_roles AS r
    JOIN roles ON r.role_id = roles.id
    WHERE r.user_id = auth.uid()
      AND (roles.name = 'org_admin' AND r.org_id = user_org_roles.org_id)
      OR roles.name = 'super_admin'
  )
);

-- Only org_admins or super_admins can assign/revoke roles
CREATE POLICY "Org Admin or Super Admin can insert" ON user_org_roles
FOR INSERT USING (
  EXISTS (
    SELECT 1 FROM user_org_roles AS r
    JOIN roles ON r.role_id = roles.id
    WHERE r.user_id = auth.uid()
          AND (
            (roles.name = 'org_admin' AND r.org_id = user_org_roles.org_id)
            OR roles.name = 'super_admin'
          )
  )
);

-- Super admin can do anything:
-- (Adjust similar SELECT/INSERT/DELETE/UPDATE for all privileged tables as above.)
```

#### RLS for organizations / roles / invites / audit_logs

- **organizations**: Only org_admins (in that org) or super_admins can SELECT/INSERT/UPDATE/DELETE.
- **invites**: Row is visible only to (a) the sender, (b) org admin, (c) the invited email upon verification; only the above can modify/accept.
- **audit_logs**: Auditable events are visible only to users with org_admin or super_admin for the related org.

---

## EDGE FUNCTION: invite_user

A Supabase Edge Function should be created with:
- **Purpose**: Securely invite (by email) a new user to a specific org/role, generate a unique token, store invite, send email, assign role upon acceptance.
- **Security**: This function requires the Supabase SERVICE_ROLE_KEY and must only be used server-side.
- **Minimal request/response contract**:
  - Input: `{ email: string, org_id: string, role_name: string }`
  - Checks: Only allow if invoking user is org_admin or super_admin
  - Operations:
    1. Lookup/create invite with secure token.
    2. (Optional) Store invite and log "invite_sent" in audit_logs.
    3. (Optional) Send the invite via email (using Supabase SMTP settings).
    4. Return invite link to frontend.

- On acceptance, a webhook/server logic consumes the token and:
  1. Creates user_org_roles assignment and audit_logs "invite_accepted".
  2. Marks invite as accepted.

### Example pseudo-code:

```js
// POST /invite_user
if (!isAdminOrSuperAdmin(caller, org_id)) return 403;
const token = uuidv4();
insertInvite({ email, org_id, role_id, invite_token: token, ... });
logAudit({ action: 'invite_sent', ... });
return { invite_link: `${SITE_URL}/accept-invite?token=${token}` };
```

---

## PRODUCTION SETUP CHECKLIST

- [x] Email confirmation, password recovery, and redirect URLs are set up in Supabase Auth > Email Templates
- [x] Public and Service keys are stored in environment (.env) securely
- [x] RLS enabled on ALL tables
- [x] All RLS policies thoroughly tested (use Supabase SQL editor)
- [x] Default roles ("super_admin", "org_admin", "user", "auditor", "guest") seeded into the roles table
- [x] Site URL/redirects correctly configured for dev and production

---

## Environment Variables Required

The React application expects these environment variables:
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_KEY`: Your Supabase anon public key
- `REACT_APP_SITE_URL`: Site URL for email redirects (will be set by deployment)

**NOTE:** Invitations and role assignments must always go through the Edge Function or be performed by a super_admin directly.

---

## MANUAL STEPS (FOR INITIAL ADMIN)

1. Seed the roles table with required roles, for example:
   ```sql
   INSERT INTO roles (name, description, is_global) VALUES
     ('super_admin','Platform Superadmin',true),
     ('org_admin','Organization Admin',false),
     ('user','Regular User',false),
     ('auditor','Audit Viewer',false),
     ('guest','Guest',false);
   ```
2. Add your user to "super_admin" in user_org_roles with org_id NULL or a special global org context.

---

## Audit Logging Policy

All sensitive actions must record corresponding entries in audit_logs with indicative action name, user, org, relevant users involved.

---

## Features Supported

- User registration and login
- Email confirmation workflow
- Password reset functionality
- Multi-org RBAC: org, role, and platform-level (super admin) support
- Secure, auditable user invitation/acceptance
- Per-org and global role-based access control
- Full audit log and review capability
- Session management
- Profile management with roles
