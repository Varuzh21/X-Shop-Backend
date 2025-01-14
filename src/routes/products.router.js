import { Router } from 'express';
import ProductController from '../controllers/products.controller.js';

const router = Router();


router.post('/create', ProductController.createProduct);
router.get('/category/:categoryId', ProductController.getProductByCategoryId);
router.get('/all', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.put('/update/:id', ProductController.updateProduct);
router.delete('/delete/:id', ProductController.deleteProduct);


export default router;