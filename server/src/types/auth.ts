import { Role } from './rbac';

export interface DecodedToken {
  user_id: number;
  username: string;
  email?: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  user_id: number;
  username: string;
  email?: string;
  role: Role;
}