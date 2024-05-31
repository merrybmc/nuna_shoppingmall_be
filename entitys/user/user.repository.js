import User from './User.Schema';

const userRepository = {};

userRepository.validEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) throw new Error('이미 가입된 이메일입니다.');
  } catch (e) {
    res.status(400).json({ status: 'fail', error: e.message });
  }
  next();
};
