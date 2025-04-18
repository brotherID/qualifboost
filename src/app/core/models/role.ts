export interface Role {
  id: string;
  role: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissionList: string[];
}
