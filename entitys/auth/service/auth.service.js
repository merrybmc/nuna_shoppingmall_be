import User from '../../user/User.Schema.js';
import bcrypt from 'bcryptjs';

const authService = {};

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

authService.logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.statusCode = 200;
  } catch (e) {
    req.statusCode = 400;
    res.error = e.message;
  }
  next();
};

export default authService;
