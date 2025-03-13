import { Request, Response, NextFunction } from 'express';
import { Role, Permission, rolePermissions } from '../types/rbac';
import { DecodedToken } from '../types/auth';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Augment the Express Request type
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

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is not set!');
  console.warn('Please create a .env file in the server directory with:');
  console.warn('JWT_SECRET=your_secure_secret_here');
  console.warn('Using an insecure default secret for development...');
}

// Use environment variable or fallback to a development secret
const SECRET = JWT_SECRET || 'development_secret_do_not_use_in_production';

function verifyToken(token: string): DecodedToken {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as unknown as DecodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decodedUser = verifyToken(token);
    
    // Set user in request object
    req.user = {
      user_id: decodedUser.user_id,
      username: decodedUser.username,
      email: decodedUser.email,
      role: decodedUser.role,
    };
    
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const checkPermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userRole = req.user.role as Role;
    const permissions = rolePermissions[userRole];
    
    const hasPermission = permissions.some(
      permission => 
        permission.action === requiredPermission.action && 
        permission.resource === requiredPermission.resource
    );

    if (!hasPermission) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};

export const generateToken = (payload: {
  user_id: number;
  username: string;
  email?: string;
  role: Role;
}): string => {
  return jwt.sign(payload, SECRET, {
    expiresIn: '24h', // Token expires in 24 hours
  });
};