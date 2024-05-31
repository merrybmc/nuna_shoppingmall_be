import express from 'express';
import authController from './controller/auth.controller.js';

const router = express.Router();

router.post('/loginemail', authController.loginWithEmail);
router.post('/logingoogle', authController.loginWithGoogle);

export default router;
