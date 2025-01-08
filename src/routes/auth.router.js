import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', AuthController.createUser);
router.post('/login', AuthController.loginUser);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;