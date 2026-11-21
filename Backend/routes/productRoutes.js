import express from 'express';
import { createProducts, getProducts, getProductById, updateProducts, deleteProduct } from '../controllers/productControllers.js';

const router = express.Router();

router.post('/add', createProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/update/:id', updateProducts);
router.delete('/delete/:id', deleteProduct);

export default router;
