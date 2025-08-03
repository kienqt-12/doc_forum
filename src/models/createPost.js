// src/models/createPost.js
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb';

const POST_COLLECTION_NAME = 'posts'

export const PostModel = {
  async createNew(data) {
    const newData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await GET_DB().collection(POST_COLLECTION_NAME).insertOne(newData)
    return result
  },
  async getAll() {
    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return result
  },
  async findByUserId(userId) {
    return await GET_DB().collection(POST_COLLECTION_NAME).find({ 'author._id': new ObjectId(userId) }).toArray();
  }
}
