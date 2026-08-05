import express from 'express';
import { getProfile, getUsers, login } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/users', authenticate, authorize('admin'), getUsers);

export default router;
