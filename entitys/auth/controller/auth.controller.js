import { OAuth2Client } from 'google-auth-library';
import User from '../../user/User.Schema.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const authController = {};

authController.loginWithEmail = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { user } = req;
    const { password } = req.body;

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) throw new Error('이메일 혹은 비밀번호가 일치하지 않습니다.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

authController.loginWithGoogle = async (req, res, next) => {
  try {
    const { token } = req.body;

    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    req.email = email;
    req.name = name;
    req.user = user;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default authController;
