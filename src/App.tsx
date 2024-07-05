import { useEffect, useRef } from 'react';
import { useRtc } from './hooks/useRtc';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { video, audio } = useRtc();

  useEffect(() => {
    if (videoRef.current && video) {
      videoRef.current.srcObject = video;
    }
  }, [video]);

  useEffect(() => {
    if (audioRef.current && audio) {
      audioRef.current.srcObject = audio;
    }
  }, [audio]);

  return (
    <div className="h-full flex items-center justify-center">
      <video className="size-96" ref={videoRef} autoPlay playsInline muted />
      <audio ref={audioRef} autoPlay muted />
    </div>
  );
}
