import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { listPending, getBill, finalizeBill } from '../controllers/billingController';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));
router.get('/pending', listPending);
router.get('/:id', getBill);
router.put('/:id/finalize', finalizeBill);

export default router;

