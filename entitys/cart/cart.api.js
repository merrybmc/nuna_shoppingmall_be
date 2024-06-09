import express from 'express';
import intercepter from '../../common/exception/http-exception.filter.js';
import authRepository from '../auth/auth.repository.js';
import cartController from './controller/cart.controller.js';
const router = express.Router();

// 카트 추가
router.post('/', authRepository.authenticate, cartController.addItemToCart, intercepter);

// 카트 조회
router.get('/', authRepository.authenticate, cartController.getCart, intercepter);

// 카트 삭제
router.delete('/:id', authRepository.authenticate, cartController.deleteCartItem, intercepter);

export default router;
