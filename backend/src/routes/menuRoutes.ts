import { Router } from 'express';
import { listMenu, createMenu, updateMenu, deleteMenu } from '../controllers/menuController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listMenu);
router.post('/', authenticate, requireRole('ADMIN'), createMenu);
router.put('/:id', authenticate, requireRole('ADMIN'), updateMenu);
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteMenu);

export default router;

