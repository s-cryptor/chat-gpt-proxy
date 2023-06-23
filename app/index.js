import 'dotenv/config'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('a user connected')

  // receive a message from the client
  socket.on('hello from client', (...args) => {
    console.log(args)
  })
})

export default server
