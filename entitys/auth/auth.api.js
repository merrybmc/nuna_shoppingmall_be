import express from 'express';
import authController from './controller/auth.controller.js';
import userRepository from '../user/user.repository.js';
import authService from './service/auth.service.js';
import intercepter from '../../common/exception/http-exception.filter.js';

const router = express.Router();

router.post(
  '/loginemail',
  userRepository.validEmail,
  authController.loginWithEmail,
  authService.loginWithEmail,
  intercepter
);

router.post(
  '/logingoogle',
  authController.loginWithGoogle,
  authService.loginWithGoogle,
  intercepter
);

export default router;
