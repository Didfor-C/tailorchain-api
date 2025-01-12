// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  signup,
  login,
  getUserInfo,
  updateUserInfo,
} = require('../controllers/userController');

// 회원가입, 로그인
router.post('/signup', signup);
router.post('/login', login);

// 회원 정보 (조회, 수정) - 인증이 필요한 라우트
router.get('/:userId', authMiddleware, getUserInfo);
router.put('/:userId', authMiddleware, updateUserInfo);

module.exports = router;
