import User from './User.Schema.js';

const userRepository = {};

userRepository.validEmail = async (req, res, next) => {
  try {
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

export default userRepository;
