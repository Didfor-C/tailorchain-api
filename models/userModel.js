// models/userModel.js
const { connectDB } = require('../config/db');

async function createUser(userData) {
  const db = await connectDB();
  const result = await db.collection('users').insertOne(userData);
  return result.insertedId;
}

async function findUserByEmail(email) {
  const db = await connectDB();
  return await db.collection('users').findOne({ email });
}

async function findUserById(userId) {
  const db = await connectDB();
  return await db.collection('users').findOne({ userId }); 
}

async function updateUserById(userId, updateData) {
  const db = await connectDB();
  const result = await db.collection('users').findOneAndUpdate(
    { userId },
    { $set: updateData },
    { returnDocument: 'after' }
  );
  return result.value; // 업데이트 후 최종 값
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
};
