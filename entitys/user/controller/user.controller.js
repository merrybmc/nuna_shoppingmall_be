import bcrypt from 'bcryptjs';
import User from '../User.Schema.js';

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    // const { password } = req.body;
    // const user = await User.findOne({ email });
    // if (user) throw new Error('이미 가입된 이메일입니다j.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default userController;
