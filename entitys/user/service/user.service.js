import bcrypt from 'bcryptjs';
import User from '../User.Schema.js';
import userService from './user.service';

const userService = {};

// 회원가입
userService.createUser = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { email, password, name, level = 'customer' } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ email, password: hash, name, level, kind: 'email' });

    await newUser.save();

    req.statusCode = 200;
    req.data = newUser;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 회원 정보 조회
userService.getUserInfo = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { user } = req;

    req.statusCode = 200;
    req.data = user;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 이름 변경
userService.changeName = async (req, res, next) => {
  try {
  } catch (e) {
    e.statusCode = 400;
    e.error = e.message;
  }
  next();
};

// 비밀번호 변경
userService.changePassword = async (req, res, next) => {
  try {
  } catch (e) {
    e.statusCode = 400;
    e.error = e.message;
  }
  next();
};

// 회원 탈퇴
userService.deleteUser = async (req, res, next) => {
  try {
  } catch (e) {
    e.statusCode = 400;
    e.error = e.message;
  }
  next();
};

export default userService;
