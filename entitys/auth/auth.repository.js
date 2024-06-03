import jwt from 'jsonwebtoken';
import User from '../user/User.Schema.js';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authRepository = {};

// 토큰 검증
authRepository.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies['token'];
    let result = '';

    if (!token) throw new Error('토큰이 유효하지 않습니다.');

    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) {
        throw new Error('토큰이 유효하지 않습니다.');
      } else {
        result = payload._id;
      }
    });

    req.validTokenId = result;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

authRepository.checkAdminPermission = async (req, res, next) => {
  try {
    const { validTokenId } = req;

    const user = await User.findById(validTokenId);

    if (user.level !== 'admin') throw new Error('admin 계정이 아닙니다.');

    req.user = user;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default authRepository;
