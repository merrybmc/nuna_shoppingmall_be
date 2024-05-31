import User from './User.Schema.js';

const userRepository = {};

userRepository.validEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) throw new Error('이미 가입된 이메일입니다.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default userRepository;
