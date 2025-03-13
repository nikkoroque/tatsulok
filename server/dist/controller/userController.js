"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.users.findMany({
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma.users.findUnique({
            where: { user_id: Number(id) },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email, role } = req.body;
        // Validate required fields
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }
        // Check if username already exists
        const existingUser = yield prisma.users.findUnique({
            where: { username },
        });
        if (existingUser) {
            res.status(409).json({ error: 'Username already exists' });
            return;
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new user
        const newUser = yield prisma.users.create({
            data: {
                username,
                password: hashedPassword,
                email,
                role: role || 'Staff',
                created_at: new Date(),
            },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { username, email, role, password } = req.body;
        const updateData = {
            username,
            email,
            role: role,
        };
        // If password is provided, hash it
        if (password) {
            updateData.password = yield bcrypt_1.default.hash(password, 10);
        }
        const updatedUser = yield prisma.users.update({
            where: { user_id: Number(id) },
            data: updateData,
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.users.delete({
            where: { user_id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteUser = deleteUser;
const validateUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
    }
    try {
        const existingUser = yield prisma.users.findFirst({
            where: { username: { equals: username, mode: 'insensitive' } },
        });
        if (existingUser) {
            res.status(409).json({ error: 'Username already exists' });
            return;
        }
        res.status(200).json({ message: 'Username is available' });
    }
    catch (error) {
        console.error('Error validating username:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.validateUsername = validateUsername;
