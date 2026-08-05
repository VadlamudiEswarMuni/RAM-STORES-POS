import express from 'express';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, listProducts);
router.post('/', authenticate, authorize('admin', 'staff'), createProduct);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

export default router;
