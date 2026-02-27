import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Task } from "../types";
import { z } from "zod";
import * as tasksApi from "../api/tasks";
import { useSocket, useAuth } from "../contexts";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
});

const newTaskSchema = taskSchema.omit({ id: true });
const updateTaskSchema = taskSchema.partial();

const TASKS_QUERY_KEY = ["tasks"];

export const useTask = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { user } = useAuth();
  const currentUsername = user?.username ?? null;

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: tasksApi.fetchTasks,
  });

  useEffect(() => {
    if (!socket) return;

    const onTaskCreated = (payload: { task: Task; username?: string }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      if (payload.username !== currentUsername) {
        toast.info(`${payload.username ?? "Someone"} created a task"`);
      }
    };
    const onTaskUpdated = (payload: { task: Task; username?: string }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      if (payload.username !== currentUsername) {
        toast.info(`${payload.username ?? "Someone"} updated a task"`);
      }
    };
    const onTaskDeleted = (payload: { id: string; username?: string }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      if (payload.username !== currentUsername) {
        toast.info(`${payload.username ?? "Someone"} deleted a task"`);
      }
    };

    socket.on("task:created", onTaskCreated);
    socket.on("task:updated", onTaskUpdated);
    socket.on("task:deleted", onTaskDeleted);

    return () => {
      socket.off("task:created", onTaskCreated);
      socket.off("task:updated", onTaskUpdated);
      socket.off("task:deleted", onTaskDeleted);
    };
  }, [socket, queryClient, currentUsername]);

  const createMutation = useMutation({
    mutationFn: (payload: tasksApi.CreateTaskPayload) => tasksApi.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast.info("Task created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: tasksApi.UpdateTaskPayload }) =>
      tasksApi.updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast.info("Task updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      toast.info("Task deleted");
    },
  });

  function addTask(task: Omit<Task, "id">) {
    const validated = newTaskSchema.parse(task);
    createMutation.mutate({ title: validated.title, description: validated.description });
  }

  function updateTask(task: Task) {
    const validated = updateTaskSchema.parse(task);
    const payload: tasksApi.UpdateTaskPayload = {};
    if (validated.title !== undefined) payload.title = validated.title;
    if (validated.description !== undefined) payload.description = validated.description;
    if (validated.status !== undefined) payload.status = validated.status;
    return updateMutation.mutateAsync({ id: task.id, payload });
  }

  function deleteTask(task: Task) {
    deleteMutation.mutate(task.id);
  }


  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
