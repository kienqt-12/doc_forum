import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const USER_COLLECTION_NAME = 'users'

export const UserModel = {
  async createNew(data) {
    const newData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(newData)

    // ✅ Trả về user vừa được tạo
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: result.insertedId })
  },

  async findByEmail(email) {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
  },

  async findById(userId) {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
  }
}
