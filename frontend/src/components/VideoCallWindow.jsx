import { useEffect, useRef, useState } from 'react'

export default function VideoCallWindow({
  stream,
  remoteStream,
  onEndCall,
}) {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)

  /* ----------------
     SET LOCAL STREAM
  ---------------- */
  useEffect(() => {
    if (localVideoRef.current && stream) {
      console.log("SETTING LOCAL STREAM") //  added

      localVideoRef.current.srcObject = null //  reset first
      localVideoRef.current.srcObject = stream

      localVideoRef.current.play().catch(() => {})
    }
  }, [stream])

  /* ----------------
     SET REMOTE STREAM
  ---------------- */
  useEffect(() => {
    if (remoteVideoRef.current) {
      if (remoteStream) {
        console.log("SETTING REMOTE STREAM") //  added

        remoteVideoRef.current.srcObject = null //  reset first
        remoteVideoRef.current.srcObject = remoteStream

        remoteVideoRef.current.play().catch(() => {})
      } else {
        console.log("NO REMOTE STREAM YET") //  added
        remoteVideoRef.current.srcObject = null
      }
    }
  }, [remoteStream])

  /* ----------------
     AUDIO TOGGLE
  ---------------- */
  const toggleMute = () => {
    if (!stream) return

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
    })

    setIsMuted((prev) => !prev)
  }

  /* ----------------
     VIDEO TOGGLE
  ---------------- */
  const toggleCamera = () => {
    if (!stream) return

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
    })

    setIsCameraOff((prev) => !prev)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 text-white">
        <h2 className="font-bold">Video Call</h2>
        <button
          onClick={onEndCall}
          className="bg-red-600 px-4 py-2 rounded"
        >
          End Call
        </button>
      </div>

      {/* VIDEO AREA */}
      <div className="flex-1 flex items-center justify-center gap-4 p-4">

        {/* REMOTE VIDEO */}
        {remoteStream ? (
          <video
            key={remoteStream?.id || "remote-video"} // 🔥 improved key
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-[60%] rounded-xl bg-black"
          />
        ) : (
          <div className="w-[60%] h-[300px] flex items-center justify-center text-white opacity-50">
            Waiting for other user...
          </div>
        )}

        {/* LOCAL VIDEO */}
        <video
          key={stream?.id || "local-video"} // 🔥 improved key
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-[30%] rounded-xl border border-white scale-x-[-1]"
        />
      </div>

      {/* CONTROLS */}
      <div className="flex justify-center gap-4 pb-6">

        {/* MUTE */}
        <button
          onClick={toggleMute}
          className={`px-4 py-2 rounded text-white ${
            isMuted ? 'bg-yellow-600' : 'bg-gray-700'
          }`}
        >
          {isMuted ? '🔇 Unmute' : '🎤 Mute'}
        </button>

        {/* CAMERA */}
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded text-white ${
            isCameraOff ? 'bg-yellow-600' : 'bg-gray-700'
          }`}
        >
          {isCameraOff ? '📷 Turn On' : '📷 Turn Off'}
        </button>
      </div>

      {/* FOOTER */}
      <div className="p-4 text-center text-white text-sm opacity-70">
        Secure Peer-to-Peer Connection
      </div>
    </div>
  )
}