import { PermissionType, Roles } from '@prisma/client';

export interface ITokenPayload {
  name: string;
  email: string;
  rg: string;
  role: Roles;
  sub: string;
  permissions: (string | any)[];
  userPermissions: PermissionType[];
}
