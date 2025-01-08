import { Router } from 'express';
import CategoryController from "../controllers/category.controller.js";

const router = Router();

router.post('/create/category', CategoryController.createCategory);
router.get('/all/categories', CategoryController.getAllCategories);
router.get('/category/:id', CategoryController.getCategoryById);
router.put('/update/category/:id', CategoryController.updateCategory);
router.delete('/delete/category/:id', CategoryController.deleteCategory);


export default router;