-- Supabase Seed Script: Demo RBAC Setup for Team Dashboard
-- NOTE: Replace '<YOUR_EMAIL_HERE>' with your Supabase (requester) email to be given 'super_admin'

-- 1. Insert demo organizations
insert into organizations (id, name)
values 
  ('org-001', 'Acme Corp'),
  ('org-002', 'Globex Ltd');

-- 2. Insert users
-- NOTE: You CANNOT insert directly into auth.users via SQL—must use Supabase Auth API.
-- After user signup via UI/API, manually update relevant user profile/roles below.

-- 3. Insert profiles for users (assuming user IDs as returned by auth; update UID placeholders)
-- Replace these IDs with actual auth.users IDs after user signup, or use Supabase CLI/admin API

-- Requester's account as super_admin (update user_id and email accordingly!)
insert into profiles (id, email, full_name, organization_id, role)
values
  ('<YOUR_SUPABASE_AUTH_USER_ID>', '<YOUR_EMAIL_HERE>', 'Requester Super Admin', null, 'super_admin');

-- Acme Org Admin
insert into profiles (id, email, full_name, organization_id, role)
values
  ('acme-admin-uid', 'admin1@acme.com', 'Acme Admin', 'org-001', 'org_admin');

-- Acme Org Regular User
insert into profiles (id, email, full_name, organization_id, role)
values
  ('acme-user-01-uid', 'alice@acme.com', 'Alice Example', 'org-001', 'user'),
  ('acme-user-02-uid', 'bob@acme.com', 'Bob Builder', 'org-001', 'guest');

-- Globex Admin
insert into profiles (id, email, full_name, organization_id, role)
values
  ('globex-admin-uid', 'admin@globex.com', 'Globex Admin', 'org-002', 'org_admin');

-- Globex Regular Users
insert into profiles (id, email, full_name, organization_id, role)
values
  ('globex-user-01-uid', 'sal@globex.com', 'Sally Intern', 'org-002', 'user'),
  ('globex-user-02-uid', 'jeff@globex.com', 'Jeff IT', 'org-002', 'guest');

-- 4. Optional: Preload some teams or permissions here, if you have other tables.

-- 5. For email invitations or password login:
-- Use your app or Supabase UI to create these accounts so auth.users table is properly setup.

-- 6. To verify RLS policies, test users in different roles via frontend. You can check access for:
--  - super_admin (should see all)
--  - org_admin (sees only their org)
--  - user/guest (limited access)

-- NOTE: Be sure to update Supabase 'profiles' table PK/FK constraints to match your schema.

-- 7. After running this script, use Supabase dashboard or SQL Editor to verify data.
