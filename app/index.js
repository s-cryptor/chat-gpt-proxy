import 'dotenv/config'

// import { WebSocketServer } from 'ws'
// import http from 'http'
// const server = http.createServer()
// const wsServer = new WebSocketServer({ server })

// const clients = {}

// // A new client connection request received
// wsServer.on('connection', function (connection) {
//   // Generate a unique code for every user
//   const userId = Math.random()
//   console.log(`Recieved a new connection.`)

//   // Store the new connection and handle messages
//   clients[userId] = connection
//   console.log(`${userId} connected.`)
// })

import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import openaiController from './controllers/openai.controller.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'https://cp2.gkorbut.dev.beget',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  allowEIO3: true,
})

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>')
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('chat', (msg) => {
    openaiController.sendMessage(msg, io)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

export default server
