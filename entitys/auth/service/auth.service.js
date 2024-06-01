import User from '../../user/User.Schema.js';
import bcrypt from 'bcryptjs';

const authService = {};

// 이메일 로그인
authService.loginWithEmail = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { user } = req;
    const token = await user.generateToken();

    req.statusCode = 200;
    req.token = token;
    req.data = user;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 구글 로그인
authService.loginWithGoogle = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { name, email } = req;
    let { user } = req;

    if (!user) {
      const randomPassword = '' + new Date();
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(randomPassword, salt);

      user = new User({
        email,
        password: hash,
        name,
      });

      await user.save();
    }

    const token = await user.generateToken();

    req.statusCode = 200;
    req.token = token;
    req.data = user;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

authService.loginWithKakao = async (req, res, next) => {
  try {
    const { email, kakaoAccessToken, kakaoId, name, connectedAt } = req;
    let { user } = req;

    if (!user) {
      const randomPassword = '' + new Date();
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(randomPassword, salt);
      user = new User({
        email,
        password: hash,
        name,
        kakaoAccessToken,
        kakaoId,
        connectedAt,
      });

      await user.save();
    }
    const token = await user.generateToken();

    req.statusCode = 200;
    req.token = token;
    req.data = user;
    req.social = true;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 로그아웃
authService.logout = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    req.statusCode = 200;
    req.data = 'success';
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default authService;
