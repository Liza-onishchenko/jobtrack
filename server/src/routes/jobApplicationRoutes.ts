import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  getStats,
} from '../controllers/jobApplicationController';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getStats);
router.post('/', createApplication);
router.get('/', getApplications);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
