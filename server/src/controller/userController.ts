import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Role } from '../types/rbac';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany({
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
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
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email, role } = req.body;

    // Validate required fields
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    // Check if username already exists
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role: role as Role || 'Staff',
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
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, role, password } = req.body;

    const updateData: any = {
      username,
      email,
      role: role as Role,
    };

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
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
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.users.delete({
      where: { user_id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  try {
    const existingUser = await prisma.users.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });

    if (existingUser) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    res.status(200).json({ message: 'Username is available' });
  } catch (error) {
    console.error('Error validating username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};