export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer';
export function canManageMember(role: OrgRole): boolean {
  if (role === 'owner' || role === 'admin') {
    return true;
  }
  return false;
}
export function canDeleteOrg(role: OrgRole): boolean {
  if (role === 'owner') {
    return true;
  }
  return false;
}
export function canEditContent(role: OrgRole): boolean {
  if (role === 'owner' || role === 'admin' || role === 'member') {
    return true;
  }
  return false;
}
