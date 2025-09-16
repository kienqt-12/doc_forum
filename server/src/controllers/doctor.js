import { DoctorModel } from '~/models/doctorModel'

export const doctorController = {
  async getRanking(req, res) {
    try {
      const { limit } = req.query
      const doctors = await DoctorModel.getRanking(Number(limit) || 10)
      return res.status(200).json({ doctors })
    } catch (error) {
      console.error('❌ Lỗi khi lấy ranking doctor:', error)
      return res.status(500).json({ error: error.message })
    }
  },

  async getByFilter(req, res) {
    try {
      const { city, tags } = req.query
      const tagArray = tags ? tags.split(',') : []

      const doctors = await DoctorModel.getByFilter(city, tagArray)
      return res.status(200).json({ doctors })
    } catch (error) {
      console.error('❌ Lỗi khi lọc doctor:', error)
      return res.status(500).json({ error: error.message })
    }
  },

  async findByName(req, res) {
    try {
      const { name } = req.params
      const doctor = await DoctorModel.findByName(name)

      if (!doctor) {
        return res.status(404).json({ message: 'Không tìm thấy bác sĩ' })
      }

      return res.status(200).json({ doctor })
    } catch (error) {
      console.error('❌ Lỗi khi tìm doctor:', error)
      return res.status(500).json({ error: error.message })
    }
  },

  async getPosts(req, res) {
    try {
      const { doctorId } = req.query
      if (!doctorId) {
        return res.status(400).json({ message: 'Thiếu doctorId' })
      }
      const posts = await DoctorModel.getPostsByDoctorId(doctorId)
      res.json({ posts })
    } catch (err) {
      console.error('❌ Lỗi getPosts:', err)
      res.status(500).json({ message: 'Lỗi server' })
    }
  }
}
