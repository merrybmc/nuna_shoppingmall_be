import bcrypt from 'bcryptjs';
import User from '../User.Schema.js';

const userController = {};

userController.createUser = async (req, res) => {
  try {
    let { email, password, name, level = 'customer' } = req.body;
    const user = await User.findOne({ email });

    if (user) throw new Error('이미 가입된 이메일입니다.');

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ email, password, name, level });

    await newUser.save();

    return res.status(200).json({ status: 'success', data: newUser });
  } catch (e) {
    res.status(400).json({ status: 'fail', error: e.message });
  }
};

export default userController;
