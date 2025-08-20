import { Router } from 'express';
import { listTables, createTable, updateTable } from '../controllers/tableController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listTables);
router.post('/', authenticate, requireRole('ADMIN'), createTable);
router.put('/:id', authenticate, requireRole('ADMIN'), updateTable);

export default router;

