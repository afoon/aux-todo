import { STATUS_KEYS } from "./constants";

export type StatusKeysType = typeof STATUS_KEYS[keyof typeof STATUS_KEYS];

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: StatusKeysType;
}
export interface TaskListType {
    status: StatusKeysType;
    tasks: Task[];
}

export interface StatusType {
    id: string;
    index: number;
    label: string;
    color: string;
}

export type User = { id: string; username: string };