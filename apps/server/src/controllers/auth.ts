import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import type { SessionWithUser } from '../types/server.js';
dotenv.config();

const pool = new PrismaPg({ connectionString: process.env.DB_URL });
const prisma = new PrismaClient({ adapter: pool });

const USERNAME_MIN_LENGTH = 1;
const USERNAME_MAX_LENGTH = 32;

export const login = async (req: Request, res: Response) => {
  const { username } = req.body as { username?: string };
  const trimmed = typeof username === 'string' ? username.trim() : '';

  if (!trimmed || trimmed.length < USERNAME_MIN_LENGTH) {
    const err = new Error('Username is required') as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }
  if (trimmed.length > USERNAME_MAX_LENGTH) {
    const err = new Error(`Username must be at most ${USERNAME_MAX_LENGTH} characters`) as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }

  const user = await prisma.user.upsert({
    where: { username: trimmed },
    create: { username: trimmed },
    update: {},
  });

  const session = req.session as SessionWithUser;
  session.user = { id: user.id, username: user.username };
  res.json({ id: user.id, username: user.username });
};

export const getUser = async (req: Request, res: Response) => {
  const session = req.session as SessionWithUser;
  if (!session?.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  res.json(session.user);
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' });
      return;
    }
    res.status(204).send();
  });
};
