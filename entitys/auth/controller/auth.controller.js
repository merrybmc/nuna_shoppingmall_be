import { OAuth2Client } from 'google-auth-library';
import User from '../../user/User.Schema';
import { bcrypt } from 'bcryptjs';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const authController = {};

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

    const sessionToken = await user.generateToken();
    res.status(200).json({ status: 'success', data: user, token: sessionToken });
  } catch (e) {
    res.status(400).json({ status: 'fail', error: e.message });
  }
};

export default authController;
