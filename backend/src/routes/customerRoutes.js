import express from 'express';
import { createCustomer, listCustomers, updateCustomer } from '../controllers/customerController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, listCustomers);
router.post('/', authenticate, authorize('admin', 'staff'), createCustomer);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateCustomer);

export default router;
