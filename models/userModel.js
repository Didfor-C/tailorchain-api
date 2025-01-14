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

  try {
    // 문서를 찾음
    const doc = await db.collection('users').findOne({ userId });

    if (!doc) {
      console.log(`User with ID ${userId} not found.`);
      return null; // 문서를 찾지 못한 경우 처리
    }

    // 문서 업데이트
    const updatedDoc = { ...doc, ...updateData };

    // 수정된 문서를 다시 업데이트
    await db.collection('users').updateOne({ userId }, { $set: updatedDoc });

    console.log("Updated User:", updatedDoc);
    return updatedDoc; // 업데이트된 데이터 반환
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // 호출한 함수에 오류 전달
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
};
