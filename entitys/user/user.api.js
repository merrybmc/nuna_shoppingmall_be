import express from 'express';
import userController from './controller/user.controller.js';

const router = express.Router();

// 회원가입
router.post('/', userController.createUser);

export default router;
