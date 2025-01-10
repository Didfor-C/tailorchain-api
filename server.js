// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function main() {
  await client.connect();
  const db = client.db('nf-cat');      // 원하는 DB 이름
  const users = db.collection('users'); // 원하는 콜렉션 이름

  const app = express();
  app.use(cors());
  app.use(express.json());

  // 회원가입 예시 (비밀번호 해시 없이 단순 저장)
  app.post('/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const exist = await users.findOne({ email });
      if (exist) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const result = await users.insertOne({ email, password });
      return res.json({ _id: result.insertedId, email });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 로그인 예시 (단순 이메일/비번 검사)
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = await users.findOne({ email, password });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      return res.json({ _id: user._id, email: user.email });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // 연결 확인
  app.get('/', (req, res) => {
    res.send('Mongo Login Server Running');
  });

  // 서버 실행
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

main().catch(console.error);
