"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.checkPermission = exports.authenticateUser = void 0;
const rbac_1 = require("../types/rbac");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
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
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid token');
    }
}
const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
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
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
            return;
        }
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.authenticateUser = authenticateUser;
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userRole = req.user.role;
        const permissions = rbac_1.rolePermissions[userRole];
        const hasPermission = permissions.some(permission => permission.action === requiredPermission.action &&
            permission.resource === requiredPermission.resource);
        if (!hasPermission) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
};
exports.checkPermission = checkPermission;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, {
        expiresIn: '24h', // Token expires in 24 hours
    });
};
exports.generateToken = generateToken;
