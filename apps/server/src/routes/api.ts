import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router({ mergeParams: true });

router.get('/tasks', asyncHandler(getTasks));
router.post('/tasks', asyncHandler(createTask));
router.patch('/tasks/:id', asyncHandler(updateTask));
router.delete('/tasks/:id', asyncHandler(deleteTask));

export default router;