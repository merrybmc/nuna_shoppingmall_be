import express from 'express';
import userController from './controller/user.controller.js';
import userRepository from './user.repository.js';
import userService from './service/user.service.js';
import intercepter from './../../common/exception/http-exception.filter.js';
import authRepository from '../auth/auth.repository.js';

const router = express.Router();

// 회원가입
router.post(
  '/',
  userRepository.validEmail,
  userController.createUser,
  userService.createUser,
  intercepter
);

// 회원 정보 조회
router.get(
  '/',
  authRepository.authenticate,
  userController.getUserInfo,
  userService.getUserInfo,
  intercepter
);

// 이름 변경
router.post(
  '/changename',
  authRepository.authenticate,
  userController.changeName,
  userService.changeName,
  intercepter
);

// 비밀번호 변경
router.post(
  '/changepassword',
  authRepository.authenticate,
  userController.changePassword,
  userRepository.validPassword,
  userRepository.hasingPassword,
  userService.changePassword,
  intercepter
);

// 회원 탈퇴
router.post(
  '/deleteuser',
  authRepository.authenticate,
  userRepository.validPassword,
  userController.deleteUser,
  userService.deleteUser,
  intercepter
);

export default router;
