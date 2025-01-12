// models/catCardModel.js
const { connectDB } = require('../config/db');

async function createCatCard(catCardData) {
  const db = await connectDB();
  const result = await db.collection('catCards').insertOne(catCardData);
  return result.insertedId;
}

async function findCatCardsByUser(userId) {
  const db = await connectDB();
  return await db.collection('catCards').find({ userId }).toArray();
}

async function findCatCardById(catCardId) {
  const db = await connectDB();
  return await db.collection('catCards').findOne({ catCardId });
}

async function updateCatCardName(catCardId, newName) {
  const db = await connectDB();
  return await db.collection('catCards').findOneAndUpdate(
    { catCardId },
    { $set: { catCardName: newName } },
    { returnDocument: 'after' }
  );
}

module.exports = {
  createCatCard,
  findCatCardsByUser,
  findCatCardById,
  updateCatCardName,
};
