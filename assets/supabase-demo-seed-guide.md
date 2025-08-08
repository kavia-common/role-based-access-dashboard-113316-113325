# Supabase Demo Data Seed Guide: RBAC Team Dashboard

## Overview

This guide will help you set up demo organizations, users, and role assignments in your Supabase project for the RBAC Team Dashboard.

---

## Step-by-step Instructions

### 1. Create Demo Auth Users

- Use the frontend registration page or Supabase Auth UI ("Users" tab) to register these emails:

  - `<YOUR_EMAIL_HERE>` (your own account, to be assigned super_admin)
  - `admin1@acme.com`
  - `alice@acme.com`
  - `bob@acme.com`
  - `admin@globex.com`
  - `sal@globex.com`
  - `jeff@globex.com`

*Ensure you verify their email addresses or mark as "confirmed" in Supabase Auth if needed.*

---

### 2. Get Auth User IDs

- For each user above, fetch their user id from `auth.users` table in Supabase.

---

### 3. Edit and Run the SQL Seed Script

- Open `assets/supabase-seed-demo.sql` and replace:
  - `<YOUR_SUPABASE_AUTH_USER_ID>` with your own Auth user id.
  - `<YOUR_EMAIL_HERE>` with your own email.

- Replace all other `*-uid` values with actual user ids for each demo user.

- Run the script in the Supabase SQL Editor or Supabase CLI.

---

### 4. Verify Organizational and Role Assignments

- Confirm that the `profiles` table (or whatever table you use for roles/org mapping) now contains demo orgs/users/assignments.
- Check that your account has role `super_admin`.

---

### 5. RLS Verification & App Testing

- Log in as different users to verify correct dashboard view and access:
  - Super admin (should see everything)
  - Org admin (should see only their org)
  - Regular user/guest

---

### 6. (Optional) Automate with JavaScript

- You may automate user/role assignment using your frontend with the Supabase JS client (see documentation for `insert` usage and RLS auth).
- Example: use `/src/config/supabase.js` with admin API credentials to batch-create/update users and roles if desired.

---

## Reminder

**Due to Supabase Auth security, you cannot insert directly into `auth.users` via SQL! Always create users either via your app or Supabase UI, and only then assign profile/role/org info in your own tables.**

---

## For Further Reference

- For more info, view `assets/supabase.md` for auth/role table integration details.

---

**RBAC Demo Data seed complete!**
