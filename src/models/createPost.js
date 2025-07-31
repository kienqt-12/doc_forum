import { GET_DB } from '~/config/mongodb'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  doctor: Joi.string().allow(''),
  workplace: Joi.string().allow(''),
  city: Joi.string().allow(''),
  rating: Joi.number().min(0).max(5),
  tags: Joi.array().items(Joi.string()),
  author: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    avatar: Joi.string().required()
  }),
  createdAt: Joi.date().default(new Date())
});

export const PostModel = {
  async createNew(data) {
    try {
      const validatedData = await postSchema.validateAsync(data, { abortEarly: false });

      const result = await GET_DB().collection('posts').insertOne(validatedData);
      return result.ops ? result.ops[0] : await GET_DB().collection('posts').findOne({ _id: result.insertedId });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getAll() {
    return await GET_DB().collection('posts').find({}).sort({ createdAt: -1 }).toArray();
  }
};
