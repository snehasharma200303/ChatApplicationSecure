import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ChatBubble from './ChatBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ token }) {
  const socketRef = useRef(null)
  const scrollRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)

  /* --------------------------------
     SOCKET CONNECT + ROOM JOIN
  ----------------------------------*/
  useEffect(() => {
    console.log(import.meta.env.VITE_SOCKET_URL)

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

    if (token) {
      socketRef.current.emit('join-room', token)
    }

    socketRef.current.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [token])

  /* --------------------------------
     AUTO SCROLL
  ----------------------------------*/
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, typing])

  /* --------------------------------
     SEND MESSAGE (STEP-4 ✅)
  ----------------------------------*/
  const sendMessage = (text, fileData) => {
    if (!text.trim() && !fileData) return

    const message = {
      id: Date.now(),
      text,
      file: fileData,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      mine: true,
    }

    // show instantly
    setMessages((prev) => [...prev, message])

    // send to backend
    socketRef.current.emit('send-message', {
      roomId: token,
      message: { ...message, mine: false },
    })
  }

  return (
    <section className="card flex h-full flex-col border border-gray-100 bg-white/50 shadow-soft dark:border-gray-800 dark:bg-gray-900/50">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/80">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Secure Conversation
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Session: {token?.substring(0, 8)}...
            </p>
          </div>
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
          <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
            MEMORY ONLY
          </span>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-6 py-6 scrollbar-hide"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-40">
            <div className="mb-4 text-4xl">🛡️</div>
            <p className="text-sm">
              Start a conversation.
              <br />
              History is wiped on refresh.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubble
                mine={m.mine}
                text={m.text}
                file={m.file}
                time={m.time}
                sender={m.mine ? 'Me' : 'Peer'}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && <TypingIndicator name="Peer" />}
      </div>

      {/* INPUT */}
      <div className="border-t border-gray-100 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-900/80">
        <MessageInput onSend={sendMessage} />
        <p className="mt-2 text-center text-[10px] text-gray-400">
          Messages are never stored on a server or database.
        </p>
      </div>
    </section>
  )
}
