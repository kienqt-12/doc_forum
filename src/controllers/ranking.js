// src/controllers/topRankController.js
import { PostModel } from '~/models/postModel'
import { UserModel } from '~/models/user'

export const topRankController = {
  async getTopRank(req, res) {
    try {
      const [posts, doctors, users] = await Promise.all([
        PostModel.getTopPosts(5),
        PostModel.getTopDoctors(5),
        UserModel.getTopUsersByPosts(5)
      ])

      res.status(200).json({
        posts,
        doctors,
        users
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Lỗi khi lấy bảng xếp hạng' })
    }
  }
}
