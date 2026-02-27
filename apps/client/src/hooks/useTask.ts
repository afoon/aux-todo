import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types";
import { z } from "zod";
import * as tasksApi from "../api/tasks";

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

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: tasksApi.fetchTasks,
  });

  const createMutation = useMutation({
    mutationFn: (payload: tasksApi.CreateTaskPayload) => tasksApi.createTask(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: tasksApi.UpdateTaskPayload }) =>
      tasksApi.updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
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
    const validated = taskSchema.parse(task);
    deleteMutation.mutate(validated.id);
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
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};
