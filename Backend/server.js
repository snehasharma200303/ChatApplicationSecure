import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join room using token
  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  // Receive & broadcast message
  socket.on('send-message', ({ roomId, message }) => {
    socket.to(roomId).emit('receive-message', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`)
});
