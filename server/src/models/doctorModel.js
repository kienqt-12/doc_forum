// src/models/doctor.js
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

const DOCTOR_COLLECTION_NAME = 'doctors'
const POST_COLLECTION_NAME = 'posts'

export const DoctorModel = {
  async createOrUpdate(data) {
    const db = GET_DB()
    const collection = db.collection(DOCTOR_COLLECTION_NAME)

    let doctor = await collection.findOne({ doctor: data.doctor })

    if (doctor) {
      const updatedTags = Array.from(new Set([...(doctor.tags || []), ...(data.tags || [])]))

      await collection.updateOne(
        { _id: new ObjectId(doctor._id) },
        {
          $set: {
            workplace: data.workplace || doctor.workplace,
            city: data.city || doctor.city,
            tags: updatedTags
          },
          $push: { ratings: data.rating }
        }
      )

      doctor = await collection.findOne({ _id: new ObjectId(doctor._id) })
      const ratings = doctor.ratings || []
      const avgRating = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0

      await collection.updateOne(
        { _id: new ObjectId(doctor._id) },
        { $set: { rating: avgRating } }
      )

      return doctor
    } else {
      const newDoctor = {
        doctor: data.doctor,
        workplace: data.workplace,
        city: data.city,
        rating: data.rating || 0,
        ratings: data.rating ? [data.rating] : [],
        tags: data.tags || [],
        createdAt: new Date()
      }

      const result = await collection.insertOne(newDoctor)
      return result
    }
  },

  async getRanking(limit = 5) {
    const db = GET_DB()
    return db.collection(DOCTOR_COLLECTION_NAME)
      .find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .toArray()
  },

  async findByName(name) {
    const db = GET_DB()
    return db.collection(DOCTOR_COLLECTION_NAME).findOne({ doctor: name })
  },

  async getByFilter(city, tags = []) {
    const db = GET_DB()
    const query = {}

    if (city) {
      query.city = city
    }

    if (tags.length > 0) {
      query.tags = { $in: tags }
    }

    return db.collection(DOCTOR_COLLECTION_NAME)
      .find(query)
      .sort({ rating: -1, createdAt: -1 })
      .toArray()
  },

  // 🆕 lấy danh sách bài viết của 1 bác sĩ theo id
  async getPostsByDoctorId(doctorId) {
    const db = GET_DB() // 👈 thêm dòng này

    const doctor = await db.collection(DOCTOR_COLLECTION_NAME).findOne({ _id: new ObjectId(doctorId) })
    if (!doctor) return []

    return await db.collection(POST_COLLECTION_NAME).find({ doctor: doctor.doctor }).toArray()
  }
}
