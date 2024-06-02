import User from './User.Schema.js';
import bcrypt from 'bcryptjs';

const userRepository = {};

// 이메일 검증
userRepository.validEmail = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { originalUrl } = req;
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (originalUrl.includes('login')) {
      if (!user) throw new Error('이메일 혹은 비밀번호가 일치하지 않습니다.');
    } else if (!originalUrl.includes('login') && user) throw new Error('이미 가입된 이메일입니다.');

    req.user = user;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 비밀번호 검증
userRepository.validPassword = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { user } = req;
    const { password } = req.body;

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) throw new Error('비밀번호가 일치하지 않습니다.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 비밀번호 암호화
userRepository.hasingPassword = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { password, newPassword } = req.body;

    const setPassword = newPassword || password || '' + new Date();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(setPassword, salt);

    req.hash = hash;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default userRepository;
