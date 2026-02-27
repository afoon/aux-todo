import type { Task } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const base = () => ({
  credentials: 'include' as RequestCredentials,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/api/tasks`, { ...base(), method: 'GET' });
  if (!res.ok) throw new Error(await res.text().catch(() => 'Failed to fetch tasks'));
  return res.json();
}

export type CreateTaskPayload = { title: string; description?: string | null };

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    ...base(),
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => 'Failed to create task'));
  return res.json();
}

export type UpdateTaskPayload = Partial<Pick<Task, 'title' | 'description' | 'status'>>;

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    ...base(),
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => 'Failed to update task'));
  return res.json();
}

export async function deleteTask(id: string): Promise<Task> {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    ...base(),
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text().catch(() => 'Failed to delete task'));
  return res.json();
}
