import { Router } from "express";
import AuthRouter from "./auth.router.js";
import ProductsRouter from "./products.router.js";
import CategoryRouter from "./category.router.js";
import CartRouter from "./cart.router.js";
import CardRouter from "./card.router.js";

const router = Router();

router.use('/user', AuthRouter);
router.use('/products', ProductsRouter);
router.use('/category', CategoryRouter);
router.use('/cart', CartRouter);
router.use('/card', CardRouter);

export default router;