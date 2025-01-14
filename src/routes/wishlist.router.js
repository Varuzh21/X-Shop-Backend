import { Router } from "express";
import WishlistController from "../controllers/wishlist.controller.js";

const router = Router();

router.get('/:userId', WishlistController.getAllByUser);
router.post('/:userId', WishlistController.addWish);
router.delete('/', WishlistController.removeWish);

export default router;