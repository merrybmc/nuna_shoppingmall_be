import express from 'express';
import userApi from '../entitys/user/user.api.js';
import authApi from '../entitys/auth/auth.api.js';
import productApi from '../entitys/product/product.api.js';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);
router.use('/product', productApi);

export default router;
