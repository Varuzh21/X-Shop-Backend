import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const router = Router();

router.post('/add/item',  CartController.addItem);
router.put('/update/quantity', CartController.updateQuantity);
router.delete('/remove', CartController.removeItem);
router.get('/:userId', CartController.getCart);
router.delete('/clear', CartController.clearCart);

export default router;