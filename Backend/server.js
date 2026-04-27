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
})

// Store users in rooms (optional but useful)
const roomUsers = {}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // 🔹 JOIN ROOM
  socket.on('join-room', (roomId) => {
    socket.join(roomId)

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = []
    }

    roomUsers[roomId].push(socket.id)

    console.log(`User ${socket.id} joined room ${roomId}`)

    // Notify others
    socket.to(roomId).emit('user-joined', socket.id)
  })

  // 🔹 CHAT MESSAGE FIX APPLIED HERE ONLY)
  socket.on('send-message', ({ roomId, message }) => {
    console.log("BACKEND RECEIVED:", message) // debug

    socket.to(roomId).emit('receive-message', {
      id: message.id,
      text: message.text || '',   //  FIX
      file: message.file || null,
      time: message.time,
      mine: false,
    })
  })

  //CALL USER (send offer)
socket.on('call-user', ({ roomId, offer }) => {
  console.log("📥 CALL RECEIVED IN BACKEND:", roomId) // 🔥 ADD
  socket.to(roomId).emit('incoming-call', {
    offer, // ✅ ONLY THIS
  })
})

  //ACCEPT CALL (send answer)
socket.on('call-accepted', ({ roomId, answer }) => {
  console.log("✅ CALL ACCEPTED IN BACKEND") // 🔥 ADD
  socket.to(roomId).emit('call-accepted', {
    answer, // ✅ ONLY THIS
  })
})

  // REJECT CALL
socket.on('reject-call', ({ roomId }) => {
  socket.to(roomId).emit('call-rejected', {})
})

socket.on('ice-candidate', ({ roomId, candidate }) => {
  console.log("ICE RECEIVED IN BACKEND") // add this

  socket.to(roomId).emit('ice-candidate', {
    candidate, // ONLY candidate
  })
})
  // END CALL
socket.on('end-call', ({ roomId }) => {
  socket.to(roomId).emit('call-ended', {})
})

  // 🔹 DISCONNECT
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)

    // Remove user from rooms
    for (const roomId in roomUsers) {
      roomUsers[roomId] = roomUsers[roomId].filter(
        (id) => id !== socket.id
      )

      // Notify others
      socket.to(roomId).emit('user-left', socket.id)

      // Clean empty room
      if (roomUsers[roomId].length === 0) {
        delete roomUsers[roomId]
      }
    }
  })
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Socket server running on port ${PORT}`)
})