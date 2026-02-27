import {useState} from 'react';
import type { Task } from '../../types';
import { Button } from '../ui/Button';
import { Trash } from '@boxicons/react';
import { STATUS_KEYS, STATUS_LABELS } from '../../constants';

interface TodoListItemEditProps {
    task: Task;
    onSave: (task: Task) => void | Promise<void>;
    onDelete: (task: Task) => void;
    onCancel: () => void;
    isSaving?: boolean;
    isDeleting?: boolean;
  }
  

export default function TodoListItemEdit({ task, onSave, onDelete, onCancel, isSaving, isDeleting }: TodoListItemEditProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? '');
    const [status, setStatus] = useState(task.status);
  
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      onSave({ ...task, title, description: description || undefined, status });
    }
  
    return (
      <form className="todo-list-item edit" onSubmit={handleSubmit}>
        <div className="edit-content-container">
          <label htmlFor="edit-title">Title</label>
          <input
            id="edit-title"
            className="edit-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="edit-description">Description</label>
          <input
            id="edit-description"
            className="edit-input"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="edit-status">Status</label>
          <select
            id="edit-status"
            className="edit-input"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
          >
            <option value={STATUS_KEYS.TODO}>{STATUS_LABELS[STATUS_KEYS.TODO]}</option>
            <option value={STATUS_KEYS.IN_PROGRESS}>{STATUS_LABELS[STATUS_KEYS.IN_PROGRESS]}</option>
            <option value={STATUS_KEYS.DONE}>{STATUS_LABELS[STATUS_KEYS.DONE]}</option>
          </select>
        </div>
        <div className="edit-button-container">
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={() => {}} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" onClick={() => onDelete(task)} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : <Trash />}
          </Button>
        </div>
      </form>
    );
  }