import { useState } from 'react';
import { Button } from '../ui/Button';

export default function TodoNewTaskForm({
    onSubmit,
    isCreating,
  }: {
    onSubmit: (title: string, description: string) => void;
    isCreating?: boolean;
  }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
  
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (!title.trim()) return;
      onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    }
  
    return (
      <form className="todo-list-item" onSubmit={handleSubmit}>
        <div className="edit-content-container">
          <label htmlFor="new-title">Title</label>
          <input
            id="new-title"
            className="edit-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="new-description">Description</label>
          <input
            id="new-description"
            className="edit-input"
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="submit" onClick={() => {}} disabled={isCreating}>
          {isCreating ? 'Adding...' : 'Add task'}
        </Button>
      </form>
    );
  }