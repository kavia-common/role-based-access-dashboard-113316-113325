//
// PUBLIC_INTERFACE
// Centralized permissions matrix for RBAC Team Dashboard (config-driven, flexible, org/global role mapping)
//
/**
 * Permission Matrix Structure
 * - Map roles (keys) to allowable actions (or feature flags).
 * - Extendable for org-specific or global roles.
 * - Features/components reference this for permission gating.
 */
const PERMISSIONS_MATRIX = {
  superadmin:   ['view_dashboard', 'manage_admins', 'manage_orgs', 'edit_profile', 'invite_user', 'view_users', 'feature_x', 'feature_y'],
  orgadmin:     ['view_dashboard', 'manage_orgs', 'edit_profile', 'invite_user', 'view_users', 'feature_x'],
  admin:        ['view_dashboard', 'edit_profile', 'invite_user', 'view_users'],
  user:         ['view_dashboard', 'edit_profile'],
  guest:        ['view_dashboard'],
};

/**
 * Check if a given role has a given permission.
 * @param {string|string[]} role - user's role or array of roles
 * @param {string} permission
 * @returns {boolean}
 */
export function hasPermission(role, permission) {
  if (Array.isArray(role)) {
    return role.some(r => PERMISSIONS_MATRIX[r]?.includes(permission));
  }
  return !!PERMISSIONS_MATRIX[role]?.includes(permission);
}

/**
 * Export full permissions matrix for UI rendering.
 */
export { PERMISSIONS_MATRIX };
