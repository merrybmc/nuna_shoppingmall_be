import bcrypt from 'bcryptjs';
import User from '../User.Schema.js';

const userService = {};

userService.createUser = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { email, password, name, level = 'customer' } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ email, password: hash, name, level });

    await newUser.save();

    req.statusCode = 200;
    req.data = newUser;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default userService;
