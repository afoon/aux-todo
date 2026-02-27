export const STATUS_KEYS = {
    TODO: "todo",
    IN_PROGRESS: "in-progress",
    DONE: "done",
} as const;
export const STATUS_LABELS: Record<string, string> = {
    [STATUS_KEYS.TODO]: 'To Do',
    [STATUS_KEYS.IN_PROGRESS]: 'In Progress',
    [STATUS_KEYS.DONE]: 'Done',
  };