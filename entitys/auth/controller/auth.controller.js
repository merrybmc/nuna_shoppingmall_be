import { OAuth2Client } from 'google-auth-library';
import User from '../../user/User.Schema.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new Error('이메일 혹은 비밀번호가 일치하지 않습니다.');

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) throw new Error('이메일 혹은 비밀번호가 일치하지 않습니다.');

    const token = await user.generateToken();

    const options = {
      httpOnly: true,
      sameSite: 'none',
      secure: 'true',
    };

    res.status(200).cookie('token', token, options).json({ status: 'success' });
  } catch (e) {
    res.status(400).json({ status: 'fail', error: e.message });
  }
};

authController.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = '' + new Date();
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(randomPassword, salt);
      user = new User({
        name,
        email,
        password: hash,
      });
      await user.save();
    }

    const options = {
      httpOnly: true,
      sameSite: 'none',
      secure: 'true',
    };

    const token = await user.generateToken();

    res.status(200).cookie('token', token, options).json({ status: 'success' });
  } catch (e) {
    res.status(400).json({ status: 'fail', error: e.message });
  }
};

export default authController;
