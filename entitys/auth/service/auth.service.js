import User from '../../user/User.Schema.js';

const authService = {};

authService.loginWithEmail = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { user } = req;
    const token = await user.generateToken();

    req.statusCode = 200;
    req.token = token;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

authService.loginWithGoogle = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { name, email, user } = req;

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
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default authService;
