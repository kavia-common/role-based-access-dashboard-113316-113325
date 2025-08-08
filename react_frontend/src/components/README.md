# Components

Various components for the RBAC Team Dashboard app.

- `Dashboard/SuperAdminDashboard.js`: For super admins to manage orgs/admins/invites.
- `Dashboard/OrgAdminDashboard.js`: For org admins to manage their org users/invites.
- `Dashboard/InviteAdminDashboard.js`: For managing invite requests and invites.
- `Roles/RoleBadge.js`: Color-coded badge for displaying user roles.
- `UI/Dialog.js`: Minimal modal/dialog for editing users/invites.
- `UI/ToastContext.js`: Toast message system.
- `UI/Skeleton.js`: Loading skeleton UI.
- `UI/EmptyState.js`: Empty state UI for lists.

All RBAC admin screens require correct roles/permissions and are connected to AuthContext and Supabase.
