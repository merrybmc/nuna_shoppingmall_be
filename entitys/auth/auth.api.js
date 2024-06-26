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

// 카카오 로그인
router.get(
  '/callback/kakao',
  authController.loginWithKakao,
  authService.loginWithKakao,
  intercepter
);

// 깃허브 로그인
router.get('/githublogin', authController.loginWithGithub);
router.get(
  '/githublogin/callback',
  authController.loginWithGithubCallback,
  authService.loginWithGithubCallback,
  intercepter
);

// 로그아웃
router.post('/logout', authController.logout, authService.logout, intercepter);

export default router;
