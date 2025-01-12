// models/newsModel.js

const { connectDB } = require('../config/db');

async function getTodayNews() {
  // 단순히 DB에서 하나 가져온다고 가정
  const db = await connectDB();
  return await db.collection('news').findOne({}, { sort: { date: -1 } });
}

module.exports = {
  getTodayNews,
};
