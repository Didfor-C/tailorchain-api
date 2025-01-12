// controllers/userController.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
} = require('../models/userModel');

let userCount = 0; 
// 실제로는 DB에서 count(*) 혹은 userId 중 가장 큰 값 + 1 을 가져와 세팅할 수도 있음.

// 회원가입 (비밀번호 해싱)
async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // 이메일 중복 체크
    const exist = await findUserByEmail(email);
    if (exist) {
      return res.status(400).json({ error: 'User already exists' });
    }

    userCount += 1;

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 최초 로그인 정보
    const loginUserData = {
      userId: userCount,
      email,
      password: hashedPassword,  // 해싱된 비밀번호 저장
      userName: `냥집사${userCount}`,
      profileImage: '/images/jelly.png',
      coinBalance: 0,
      darkMode: true,
      pushNotification: true,
    };

    const insertedId = await createUser(loginUserData);

    // 회원가입 후 즉시 로그인 토큰 발급(선택 사항)
    const token = jwt.sign({ userId: loginUserData.userId }, process.env.JWT_SECRET, {
      expiresIn: '1d', // 1일 유효
    });

    return res.json({
      _id: insertedId,
      userId: loginUserData.userId,
      email: loginUserData.email,
      userName: loginUserData.userName,
      profileImage: loginUserData.profileImage,
      coinBalance: loginUserData.coinBalance,
      darkMode: loginUserData.darkMode,
      pushNotification: loginUserData.pushNotification,
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// 로그인 (해싱된 비밀번호 대조 & JWT 발급)
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({
      _id: user._id,
      userId: user.userId,
      email: user.email,
      userName: user.userName,
      profileImage: user.profileImage,
      coinBalance: user.coinBalance,
      darkMode: user.darkMode,
      pushNotification: user.pushNotification,
      token,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// 특정 유저 정보 로드 (보호된 라우트 예시: authMiddleware 사용 권장)
async function getUserInfo(req, res) {
  try {
    // param이나 req.userId에서 가져올 수 있음 (authMiddleware 적용 시)
    // 여기서는 예시로 param 사용
    const { userId } = req.params; 
    const user = await findUserById(Number(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // 민감한 비밀번호 필드는 제외하고 전달
    delete user.password;
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// 로그인 정보 업데이트
async function updateUserInfo(req, res) {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // 비밀번호를 변경하는 경우 해싱 로직 추가
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await updateUserById(Number(userId), updateData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 민감한 비밀번호 필드는 제외하고 전달
    delete updatedUser.password;
    return res.json(updatedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  signup,
  login,
  getUserInfo,
  updateUserInfo,
};
