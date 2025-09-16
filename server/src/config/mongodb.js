
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment.js' // Load environment variables

let docPlatDatabaseinstance = null

const MongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  // goi ket noi toi mongoDB
  await MongoClientInstance.connect()

  docPlatDatabaseinstance = MongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!docPlatDatabaseinstance) {
    throw new Error('Database not initialized. Call CONNECT_DB first.')
  }
  return docPlatDatabaseinstance
}