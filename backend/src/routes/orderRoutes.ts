import { Router } from 'express';
import { listOrders, createOrder, updateOrderStatus } from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, listOrders);
router.post('/', authenticate, createOrder);
router.put('/:id/status', authenticate, updateOrderStatus);

export default router;

