import express from 'express';
import userApi from '../entitys/user/user.api.js';

const router = express.Router();

router.use('/user', userApi);

export default router;
