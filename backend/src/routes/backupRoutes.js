import express from 'express';
import { createBackup, listBackups, restoreBackup } from '../controllers/backupController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), listBackups);
router.post('/create', authenticate, authorize('admin'), createBackup);
router.post('/restore', authenticate, authorize('admin'), restoreBackup);

export default router;
