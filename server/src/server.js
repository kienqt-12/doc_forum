// src/server.js (bạn đã có)
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { CONNECT_DB, GET_DB } from '~/config/mongodb'
import cors from 'cors'
import { env } from '~/config/environment.js'
import { APIs_v1 } from '~/routes/v1/index.js'
import exitHook from 'async-exit-hook'
import { initSockets } from '~/sockets/chatsockets'

const START_server = async () => {
  const app = express()
  app.use(cors({ origin: 'http://localhost:5173' }))
  app.use(express.json())
  app.use('/v1', APIs_v1)

  const server = http.createServer(app)
  const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
  })

  initSockets(io)

  // tạo index messages (an toàn nếu đã tồn tại)
  try {
    const db = GET_DB()
    await db.collection('messages').createIndex({ senderId: 1, receiverId: 1, createdAt: 1 })
  } catch (e) { console.error(e) }

  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`🚀 Server chạy tại http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  exitHook(() => console.log('Exiting...'))
}

// IIFE
;(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB')
    await START_server()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
})()
