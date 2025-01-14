import { Router } from 'express';
import CardController from '../controllers/card.controller.js';

const router =  Router();

router.post('/create', CardController.createCard);
router.get('/:userId', CardController.getUserCards);
router.delete('/:id', CardController.deleteCard);

export default router;