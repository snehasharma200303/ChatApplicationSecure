// utils/webrtc.js

export const createPeerConnection = (socket, roomId, onTrack) => {
  const peer = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" } // 🔥 required
    ]
  });

  // 🔥 SEND ICE CANDIDATES
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("SENDING ICE");

      socket.emit("ice-candidate", {
        roomId,
        candidate: event.candidate,
      });
    }
  };

  // 🔥 RECEIVE REMOTE STREAM
  peer.ontrack = (event) => {
    console.log("REMOTE STREAM RECEIVED");

    if (event.streams && event.streams[0]) {
      onTrack(event.streams[0]);
    }
  };

  return peer;
};

// 🔥 GET CAMERA + MIC
export const getMediaStream = async () => {
  return await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};