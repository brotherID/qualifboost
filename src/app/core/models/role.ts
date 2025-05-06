export interface Role {
  role: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissionsDto: string[];
}
