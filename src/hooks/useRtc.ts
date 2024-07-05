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
  const isCreatingOfferRef = useRef(false);

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
      if (!event.candidate) {
        const response = await fetch('http://localhost:4000/sdp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ offer: pc.localDescription }),
        });

        const { answer } = await response.json();
        pc.setRemoteDescription(answer);
      }
    }

    pc.addEventListener('track', handleTrack);
    pc.addEventListener('icecandidate', handleIceCandidate);

    if (!isCreatingOfferRef.current) {
      isCreatingOfferRef.current = true;
      pc.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      }).then((offer) => pc.setLocalDescription(offer));
    }

    return () => {
      pc.removeEventListener('track', handleTrack);
      pc.removeEventListener('icecandidate', handleIceCandidate);
    };
  }, []);

  return { video, audio };
};

if (typeof window === 'undefined') {
  useRtc = () => {
    return { video: undefined, audio: undefined };
  };
}

export { useRtc };
