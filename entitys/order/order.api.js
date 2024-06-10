import express from 'express';
import authRepository from './../auth/auth.repository.js';
import intercepter from '../../common/exception/http-exception.filter.js';
import orderController from './controller/order.controller.js';
const router = express.Router();

// order 생성
router.post('/', authRepository.authenticate, orderController.createOrder, intercepter);

export default router;
