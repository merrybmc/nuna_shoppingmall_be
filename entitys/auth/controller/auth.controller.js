import { OAuth2Client } from 'google-auth-library';
import User from '../../user/User.Schema.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';

dotenv.config();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const KAKAO_API_KEY = process.env.KAKAO_API_KEY;
const REDIRECT_KAKAO_CALLBACK = process.env.REDIRECT_KAKAO_CALLBACK;

const authController = {};

// 이메일 로그인
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

// 구글 로그인
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

// 카카오 로그인
authController.loginWithKakao = async (req, res, next) => {
  try {
    console.log(1);
    const kakaoToken = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: KAKAO_API_KEY,
        redirectUri: REDIRECT_KAKAO_CALLBACK,
        code: req.query.code,
      }),
    });
    const kakaoUser = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoToken.data.access_token}`,
      },
    });
    // console.log(token.data, user.data);
    console.log(2);
    const email = 'kakao' + kakaoUser.data.id;
    const user = await User.findOne({ email });

    req.user = user;
    req.email = email;
    req.kakaoAccessToken = kakaoToken.data.access_token;
    req.kakaoId = kakaoUser.data.id;
    req.name = kakaoUser.data.properties.nickname;
    req.connectedAt = kakaoUser.data.connected_at;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 로그아웃
authController.logout = async (req, res, next) => {
  try {
    const token = req.cookies['token'];

    if (!token) throw new Error('로그인 상태가 아닙니다.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default authController;
