import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getSettings);
router.put('/', authenticate, authorize('admin'), updateSettings);

export default router;
