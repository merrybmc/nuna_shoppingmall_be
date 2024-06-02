import bcrypt from 'bcryptjs';
import User from '../User.Schema.js';

const userController = {};

// 회원가입
userController.createUser = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    // const { password } = req.body;
    // const user = await User.findOne({ email });
    // if (user) throw new Error('이미 가입된 이메일입니다j.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 이름 변경
userController.changeName = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { validTokenId } = req;
    const { name } = req.body;

    if (name.length > 8) throw new Error('이름은 8자 이상 입력 불가능합니다.');

    const user = await User.findById(validTokenId);

    if (name === user.name) throw new Error('기존 이름과 변경할 이름이 동일합니다.');
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 비밀번호 변경
userController.changePassword = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();

    const { validTokenId } = req;
    const { newPassword, checkNewPassword } = req.body;

    if (newPassword !== checkNewPassword) throw new Error('새 비밀번호 확인이 일치하지 않습니다.');

    const user = await User.findById(validTokenId);

    if (!user) throw new Error('회원 정보를 조회할 수 없습니다.');

    const isMatch = bcrypt.compareSync(newPassword, user.password);

    if (isMatch) throw new Error('현재 비밀번호와 새 비밀번호가 일치합니다.');

    req.user = user;
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

// 회원 탈퇴
userController.deleteUser = async (req, res, next) => {
  try {
    if (req.statusCode === 400) return next();
  } catch (e) {
    req.statusCode = 400;
    req.error = e.message;
  }
  next();
};

export default userController;
