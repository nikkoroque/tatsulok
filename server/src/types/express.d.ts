import { Role } from './rbac';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: number;
        username: string;
        email?: string;
        role?: Role;
      };
    }
  }
}

export {};