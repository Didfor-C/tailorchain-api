// middleware/authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 헤더에서 토큰을 가져온다고 가정 (Authorization: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 토큰에서 userId 추출
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token is invalid or expired' });
  }
}

module.exports = authMiddleware;
