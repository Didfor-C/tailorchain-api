// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
// const coinRoutes = require('./routes/coinRoutes');
// const cardRoutes = require('./routes/cardRoutes');
// const communityRoutes = require('./routes/communityRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // public 폴더 내 정적 파일

// 라우팅
app.use('/user', userRoutes);         // /user/signup, /user/login, ...
// app.use('/coin', coinRoutes);         // /coin/:userId/watch-ad, /coin/:userId/purchase
// app.use('/card', cardRoutes);         // /card/:userId/cat, ...
// app.use('/community', communityRoutes); // /community/news, ...

// // 서버 상태 확인용
// app.get('/', (req, res) => {
//   res.send('TailorChain API Running with JWT Auth');
// });

// 404 처리
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// 에러 처리 미들웨어 (500)
app.use((err, req, res, next) => {
  // console.error(err.stack); // 로그 남기기 <-- 서버비를 위해 주석처리
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
