import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { listKitchenItems, setKitchenItemStatus } from '../controllers/kitchenController';

const router = Router();

router.use(authenticate, requireRole(['KITCHEN', 'ADMIN']));
router.get('/items', listKitchenItems);
router.put('/items/:id/status', setKitchenItemStatus);

export default router;

