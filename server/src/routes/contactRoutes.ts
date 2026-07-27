import { Router } from 'express';
import { sendContactMessage } from '../controllers/contactController';
import { contactLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', contactLimiter, sendContactMessage);

export default router;
