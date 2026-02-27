import type { Task } from '../../types';
import { TodoListItem } from './TodoListItem';
import TodoListItemEdit from './TodoListItemEdit';
import { useState } from 'react';
export interface TodoListItemsProps {
  tasks: Task[];
  onSave: (task: Task) => void;
  onDelete: (task: Task) => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function TodoListItems({ tasks, onSave, onDelete, isSaving, isDeleting }: TodoListItemsProps) {
  const [editTask, setEditTask] = useState<Task | null>(null);

  const handleSave = async (task: Task) => {
    await onSave(task);
    setEditTask(null);
  };

  return (
    <>
      {tasks.map((task) => (
        <>
        { editTask?.id === task.id ? (<TodoListItemEdit key={task.id} task={task} onSave={handleSave} onDelete={onDelete} onCancel={() => setEditTask(null)} isSaving={isSaving} isDeleting={isDeleting} />) :
        (<TodoListItem key={task.id} task={task} onEdit={() => setEditTask(task)} /> )}
      </>))}
    </>
  );
}