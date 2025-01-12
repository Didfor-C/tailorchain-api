// 예: coinRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { watchAd, purchaseCoins } = require('../controllers/coinController');

// 광고 시청 => 냥코인 +1 (보호 라우트)
router.post('/:userId/watch-ad', authMiddleware, watchAd);
// 냥코인 현금 구매 (보호 라우트)
router.post('/:userId/purchase', authMiddleware, purchaseCoins);

module.exports = router;
