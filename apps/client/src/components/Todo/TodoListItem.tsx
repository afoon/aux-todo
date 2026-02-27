import type { Task } from '../../types';
import { Button } from '../ui/Button';

export interface TodoListItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TodoListItem({ task, onEdit }: TodoListItemProps) {
  return (
    <div className="todo-list-item">
      <div>
        <h2>{task.title}</h2>
        {task.description != null && task.description !== '' && <p>{task.description}</p>}
      </div>
      <Button type="button" onClick={() => onEdit(task)}>
        Edit
      </Button>
    </div>
  );
}
