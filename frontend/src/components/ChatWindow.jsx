import { createPeerConnection, getMediaStream } from '../utils/webrtc'
import VideoCallWindow from './VideoCallWindow'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ChatBubble from './ChatBubble'
import MessageInput from './MessageInput'

export default function ChatWindow({ token }) {
  const socketRef = useRef(null)
  const scrollRef = useRef(null)
  const peerRef = useRef(null)

  const [messages, setMessages] = useState([])

  // CALL STATES
  const [incomingCall, setIncomingCall] = useState(null)
  const [stream, setStream] = useState(null)
  const [inCall, setInCall] = useState(false)
  const [remoteStream, setRemoteStream] = useState(null)

  /* ---------------- SOCKET ---------------- */
useEffect(() => {
  if (!token) return

socketRef.current = io(import.meta.env.VITE_SOCKET_URL)

socketRef.current.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socketRef.current.id)

  socketRef.current.emit('join-room', token)

})
  socketRef.current.on('ice-candidate', async ({ candidate }) => {
    try {
      console.log("ADDING ICE");

      if (peerRef.current && candidate) {
        await peerRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    } catch (err) {
      console.error("ICE ERROR:", err);
    }
  });

  // MESSAGE
  socketRef.current.on('receive-message', (message) => {
    setMessages((prev) => [...prev, message])
  })

  // CALL EVENTS
  socketRef.current.on('incoming-call', ({ offer }) => {
    console.log("📞 INCOMING CALL RECEIVED") // ADD
    setIncomingCall(offer)
  })

  socketRef.current.on('call-accepted', async ({ answer }) => {
    console.log("CALL ACCEPTED") //  ADD

    if (peerRef.current) {
      await peerRef.current.setRemoteDescription(answer)
    }
  })

  socketRef.current.on('call-ended', () => {
    console.log(" CALL ENDED") // 🔥 ADD
    endCall()
  })

  // 🔥 ADD THIS (VERY IMPORTANT FOR DEBUGGING ROOM ISSUE)
  socketRef.current.on('user-joined', (id) => {
    console.log(" USER JOINED:", id)
  })

  return () => {
    socketRef.current?.disconnect()
  }
}, [token])

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = (text, fileData) => {
    if ((!text || text.trim() === '') && !fileData) return

    const message = {
      id: Date.now(),
      text: text || '',
      file: fileData,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      mine: true,
    }

    setMessages((prev) => [...prev, message])

    socketRef.current.emit('send-message', {
      roomId: token,
      message: {
        id: message.id,
        text: message.text,
        file: message.file,
        time: message.time,
        mine: false,
      },
    })
  }

  /* ---------------- CALL FUNCTIONS ---------------- */

const startCall = async () => {
  setInCall(true) //  important

  console.log(" CALL BUTTON CLICKED") 
  console.log("ROOM ID:", token) 
  console.log(" EMIT DONE");

  const mediaStream = await getMediaStream(true)
  setStream(mediaStream)

  const newPeer = createPeerConnection(
    socketRef.current,
    token,
    (remoteStream) => {
      console.log("REMOTE STREAM RECEIVED")
      setRemoteStream(remoteStream)
    }
  )

  mediaStream.getTracks().forEach((track) => {
    newPeer.addTrack(track, mediaStream)
  })

  const offer = await newPeer.createOffer()
  await newPeer.setLocalDescription(offer)

  console.log(" SENDING CALL TO BACKEND") //  ADD

  socketRef.current.emit('call-user', {
    roomId: token,
    offer,
  })

  peerRef.current = newPeer
}

  const acceptCall = async () => {
    setInCall(true) //  important

    const mediaStream = await getMediaStream(true)
    setStream(mediaStream)

    const newPeer = createPeerConnection(
      socketRef.current,
      token,
      (remoteStream) => {
  console.log("REMOTE STREAM RECEIVED")
  setRemoteStream(remoteStream)
}
    )

    mediaStream.getTracks().forEach((track) => {
      newPeer.addTrack(track, mediaStream)
    })

    await newPeer.setRemoteDescription(incomingCall)

    const answer = await newPeer.createAnswer()
    await newPeer.setLocalDescription(answer)

    socketRef.current.emit('call-accepted', {
      roomId: token,
      answer,
    })

    peerRef.current = newPeer
    setIncomingCall(null)
  }

  const rejectCall = () => {
    socketRef.current.emit('reject-call', { roomId: token })
    setIncomingCall(null)
  }

  const endCall = () => {
    peerRef.current?.close()

    stream?.getTracks().forEach((track) => track.stop())

    socketRef.current.emit('end-call', { roomId: token })

    peerRef.current = null
    setStream(null)
    setInCall(false)
  }

  return (
    <section className="card flex h-full flex-col border border-gray-100 bg-white/50 shadow-soft dark:border-gray-800 dark:bg-gray-900/50">
    {inCall && (
      <VideoCallWindow
        stream={stream}
        remoteStream={remoteStream}
        onEndCall={endCall}
      />
    )}

      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="font-bold">Secure Conversation</h2>

        <button
          onClick={startCall}
          className="rounded-lg bg-blue-500 px-3 py-1 text-white text-xs"
        >
          🎥 Call
        </button>
      </div>

      {/* INCOMING CALL */}
      {incomingCall && (
        <div className="mx-6 mt-3 rounded-xl bg-yellow-100 p-3 text-center">
          <p className="text-sm font-bold">📞 Incoming Call</p>
          <div className="mt-2 flex justify-center gap-2">
            <button onClick={acceptCall} className="bg-green-500 px-3 py-1 text-white rounded">
              Accept
            </button>
            <button onClick={rejectCall} className="bg-red-500 px-3 py-1 text-white rounded">
              Reject
            </button>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div key={m.id}>
              <ChatBubble {...m} sender={m.mine ? 'Me' : 'Peer'} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* INPUT */}
      <div className="border-t p-4">
        <MessageInput onSend={sendMessage} />
      </div>
    </section>
  )
}