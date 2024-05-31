import express from 'express';
import userApi from '../entitys/user/user.api.js';
import authApi from '../entitys/auth/auth.api.js';

const router = express.Router();

router.use('/user', userApi);
router.use('/auth', authApi);

export default router;
