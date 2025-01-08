import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const router = Router();

router.post('/add/item', CartController.addItem);
router.put('/update/quantity', CartController.updateQuantity);
router.delete('/remove/item', CartController.removeItem);
router.get('/cart/:userId', CartController.getCart);
router.delete('/clear/cart', CartController.clearCart);

export default router;