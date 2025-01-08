import { Router } from 'express';
import CardController from '../controllers/card.controller.js';

const router =  Router();

router.post('/create/card', CardController.createCard);
router.get('/cards/:userId', CardController.getUserCards);
router.delete('/cards/:id', CardController.deleteCard);

export default router;