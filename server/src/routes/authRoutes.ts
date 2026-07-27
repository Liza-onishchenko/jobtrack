import { Router } from 'express';
import { register, login, updateProfile } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.put('/profile', authMiddleware, updateProfile);

export default router;
