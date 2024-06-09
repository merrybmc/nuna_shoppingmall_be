import express from 'express';
import intercepter from '../../common/exception/http-exception.filter.js';
import authRepository from '../auth/auth.repository.js';
import cartController from './controller/cart.controller.js';
const router = express.Router();

router.post('/', authRepository.authenticate, cartController.addItemToCart, intercepter);
router.get('/', authRepository.authenticate, cartController.getCart, intercepter);

export default router;
