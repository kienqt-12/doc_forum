/* eslint-disable no-console */

import express from 'express'
import { CONNECT_DB, GET_DB } from '~/config/mongodb'

import exitHook from 'async-exit-hook'
import cors from 'cors' // ✅ Thêm dòng này

import { env } from '~/config/environment.js' // Load environment variables
import { APIs_v1 } from '~/routes/v1/index.js'


const START_server = () => {
  const app = express()
  app.use(cors({ origin: 'http://localhost:5173' })) // ✅ Cho phép frontend truy cập

  app.use(express.json()) // ✅ thêm dòng này để xử lý JSON body

  app.use('/v1', APIs_v1)
  
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  exitHook(() => {
    console.log('Exiting... Closing MongoDB connection...')
  })
}

// IIFE
(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB')

    START_server()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
})()