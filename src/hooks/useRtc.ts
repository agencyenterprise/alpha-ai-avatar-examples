import { useEffect, useRef, useState } from 'react';

let useRtc = () => {
  const pcRef = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    }),
  );

  const [video, setVideo] = useState<MediaStream>();
  const [audio, setAudio] = useState<MediaStream>();

  useEffect(() => {
    const pc = pcRef.current;

    function handleTrack(event: RTCTrackEvent) {
      if (event.track.kind === 'video') {
        setVideo(event.streams[0]);
      } else {
        setAudio(event.streams[0]);
      }
    }

    async function handleIceCandidate(event: RTCPeerConnectionIceEvent) {
      if (event.candidate === null) {
        const response = await fetch('http://localhost:4000/sdp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offer: pc.localDescription,
          }),
        });

        const { answer } = await response.json();
        pc.setRemoteDescription(answer);
      }
    }

    function handleIceConnectionStateChange() {
      console.log('ice connection state: ', pc.iceConnectionState);
    }

    pc.addEventListener('track', handleTrack);
    pc.addEventListener('icecandidate', handleIceCandidate);
    pc.addEventListener('iceconnectionstatechange', handleIceConnectionStateChange);

    if (pc.getTransceivers().length === 0) {
      pc.addTransceiver('video', { direction: 'sendrecv' });
      pc.addTransceiver('audio', { direction: 'sendrecv' });
      pc.createOffer().then((d) => pc.setLocalDescription(d));
    }

    return () => {
      pc.removeEventListener('track', handleTrack);
      pc.removeEventListener('icecandidate', handleIceCandidate);
      pc.removeEventListener('iceconnectionstatechange', handleIceConnectionStateChange);
    };
  }, []);

  return { video, audio };
}

if (typeof window === 'undefined') {
  useRtc = () => {
    return { video: undefined, audio: undefined };
  }
}

export { useRtc };
