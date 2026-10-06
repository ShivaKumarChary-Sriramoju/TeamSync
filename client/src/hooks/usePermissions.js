export default function usePermissions(role) {
  return {
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isMember: role === 'member',
    canManageMembers: role === 'admin',
    canDeleteWorkspace: role === 'admin',
    canManageTasks: role === 'admin' || role === 'manager',
  };
}
