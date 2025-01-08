import { Router } from 'express';
import ProductController from '../controllers/products.controller.js';

const router = Router();


router.post('/create/product', ProductController.createProduct);
router.get('/all/products', ProductController.getAllProducts);
router.get('/product/:id', ProductController.getProductById);
router.put('/update/product/:id', ProductController.updateProduct);
router.delete('/delete/product/:id', ProductController.deleteProduct);


export default router;