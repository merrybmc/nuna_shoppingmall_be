import express from 'express';
import userController from './controller/user.controller.js';
import authController from '../auth/controller/auth.repository.js';

const router = express.Router();

// 회원가입
router.post('/', userController.createUser);

router.post('/logingoogle', authController.loginWithGoogle);

export default router;
