import { Router } from 'express';
import { login, getUser, logout } from '../controllers/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.post('/login', asyncHandler(login));
router.get('/', asyncHandler(getUser));
router.post('/logout', asyncHandler(logout));

export default router;
