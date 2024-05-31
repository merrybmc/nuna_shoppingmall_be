import express from 'express';
import authController from './controller/auth.controller.js';
import userRepository from '../user/user.repository.js';
import authService from './service/auth.service.js';
import intercepter from '../../common/exception/http-exception.filter.js';

const router = express.Router();

// 이메일 로그인
router.post(
  '/emaillogin',
  userRepository.validEmail,
  authController.loginWithEmail,
  authService.loginWithEmail,
  intercepter
);

// 구글 로그인
router.post(
  '/googlelogin',
  authController.loginWithGoogle,
  authService.loginWithGoogle,
  intercepter
);

// 로그아웃
router.post('/logout', authController.logout, authService.logout, intercepter);

export default router;
