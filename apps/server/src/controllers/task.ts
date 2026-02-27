import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../../generated/prisma/client.js';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import type { Task } from '../../generated/prisma/client.js';
import type { Server as SocketIoServer } from 'socket.io';
dotenv.config();

const pool = new PrismaPg({ connectionString: process.env.DB_URL });
const prisma = new PrismaClient({ adapter: pool });

function getIo(req: Request): SocketIoServer | undefined {
  return req.app.get('io') as SocketIoServer | undefined;
}

export const getTasks = async (req: Request, res: Response) => {
    const tasks: Task[] = await prisma.task.findMany();
    res.json(tasks);
}

export const createTask = async (req: Request, res: Response) => {
    const { title, description } = req.body as { title?: string; description?: string };
    if (!title || typeof title !== 'string' || !title.trim()) {
        const err = new Error('Title is required') as Error & { statusCode: number };
        err.statusCode = 400;
        throw err;
    }
    const task: Task = await prisma.task.create({
        data: { title: title.trim(), description, status: 'todo' },
    });
    res.json(task);
    const io = getIo(req);
    if (io) io.emit('task:created', task);
}

export const updateTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid task id' });
        return;
    }
    const task: Task = await prisma.task.update({
        where: { id },
        data: req.body as Prisma.TaskUpdateInput,
    });
    res.json(task);
    const io = getIo(req);
    if (io) io.emit('task:updated', task);
}

export const deleteTask = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid task id' });
        return;
    }
    const task = await prisma.task.delete({ where: { id } });
    res.json(task);
    const io = getIo(req);
    if (io) io.emit('task:deleted', { id: task.id });
}