import express from 'express';
import { createInvoice, getInvoices } from '../controllers/billingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/invoices', authenticate, getInvoices);
router.post('/invoice', authenticate, authorize('admin', 'staff'), createInvoice);

export default router;
