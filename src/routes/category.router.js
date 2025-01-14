import { Router } from 'express';
import CategoryController from "../controllers/category.controller.js";

const router = Router();

router.post('/create', CategoryController.createCategory);
router.get('/all', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.put('/update/:id', CategoryController.updateCategory);
router.delete('/delete/:id', CategoryController.deleteCategory);


export default router;