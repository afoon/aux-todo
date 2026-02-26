import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.js';

const router = Router({ mergeParams: true });

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;