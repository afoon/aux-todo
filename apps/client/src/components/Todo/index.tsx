import { STATUS_KEYS } from '../../constants';
import { useTask } from '../../hooks/useTask';
import { TodoListItems } from './TodoListCard';
import TodoNewTaskForm from './TodoNewTaskForm';
import { STATUS_LABELS } from '../../constants';
import './styles.css';


const COLUMN_STATUSES = [STATUS_KEYS.TODO, STATUS_KEYS.IN_PROGRESS, STATUS_KEYS.DONE] as const;

export default function Todo() {
  const {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTask();

  const STATUS_COLORS = {
    [STATUS_KEYS.TODO]: 'var(--color-todo)',
    [STATUS_KEYS.IN_PROGRESS]: 'var(--color-progress)',
    [STATUS_KEYS.DONE]: 'var(--color-done)',
  };

  const tasksByStatus = COLUMN_STATUSES.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    tasks: tasks.filter((t) => t.status === status),
  }));

  function handleAddTask(title: string, description: string) {
    addTask({ title, description: description || undefined, status: STATUS_KEYS.TODO });
  }

  if (error) {
    return (
      <div className="container">
        <p>Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="board-container">
        <h1>To-do List</h1>
          <>
            <div className="board-columns">
              {tasksByStatus.map(({ status, label, tasks: columnTasks }) => (
                <div
                  key={status}
                  className="container board-column"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                >
                  <h2>{label}</h2>
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    <TodoListItems tasks={columnTasks} onSave={updateTask} onDelete={deleteTask} isSaving={isUpdating} isDeleting={isDeleting} />
                  )}
                </div>
              ))}
            </div>
            <div className="container">
              <h2>Add a new task</h2>
              <TodoNewTaskForm onSubmit={handleAddTask} isCreating={isCreating} />
            </div>
          </>
      </div>
    </>
  );
}
