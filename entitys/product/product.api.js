import express from 'express';
import authRepository from '../auth/auth.repository.js';
import productController from './controller/product.controller.js';
import intercepter from './../../common/exception/http-exception.filter.js';
import upload from '../../multerConfig.js';
import productService from './service/product.service.js';

const router = express.Router();

// 상품 생성
router.post(
  '/',
  authRepository.authenticate,
  authRepository.checkAdminPermission,
  productController.createProduct,
  upload.array('images', 5),
  productService.createProduct,
  intercepter
);

// 상품 조회
router.get('/', productController.getProducts, productService.getProducts, intercepter);

// 상품 수정
router.put(
  '/:id',
  authRepository.authenticate,
  authRepository.checkAdminPermission,
  upload.array('images', 5),
  productController.updateProduct,
  intercepter
);

export default router;
