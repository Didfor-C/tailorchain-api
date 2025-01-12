// models/aiCardModel.js
const { connectDB } = require('../config/db');

async function createAiCard(aiCardData) {
  const db = await connectDB();
  const result = await db.collection('aiCards').insertOne(aiCardData);
  return result.insertedId;
}

async function findAiCardsByUser(userId) {
  const db = await connectDB();
  return await db.collection('aiCards').find({ userId }).toArray();
}

async function findAiCardsByUserAndRegistered(userId, isRegistered) {
  const db = await connectDB();
  return await db.collection('aiCards').find({ userId, isRegistered }).toArray();
}

async function findAllRegisteredAiCards() {
  const db = await connectDB();
  return await db.collection('aiCards').find({ isRegistered: true }).toArray();
}

async function findAiCardById(aiCardId) {
  const db = await connectDB();
  return await db.collection('aiCards').findOne({ aiCardId });
}

async function updateAiCardName(aiCardId, newName) {
  const db = await connectDB();
  return await db.collection('aiCards').findOneAndUpdate(
    { aiCardId },
    { $set: { aiCardName: newName } },
    { returnDocument: 'after' }
  );
}

async function updateAiCardRegistration(aiCardId, isRegistered) {
  const db = await connectDB();
  return await db.collection('aiCards').findOneAndUpdate(
    { aiCardId },
    { $set: { isRegistered } },
    { returnDocument: 'after' }
  );
}

async function updateAiCardLikeDislike(aiCardId, likeCount, dislikeCount) {
  const db = await connectDB();
  return await db.collection('aiCards').findOneAndUpdate(
    { aiCardId },
    { $set: { likeCount, dislikeCount } },
    { returnDocument: 'after' }
  );
}

module.exports = {
  createAiCard,
  findAiCardsByUser,
  findAiCardsByUserAndRegistered,
  findAllRegisteredAiCards,
  findAiCardById,
  updateAiCardName,
  updateAiCardRegistration,
  updateAiCardLikeDislike,
};
