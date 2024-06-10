'use client';

import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { useLiveKitRoom } from '@/hooks/useLiveKitRoom';

import { AudioPlaybackWarning } from './AudioPlaybackWarning';
import { MessageBox } from './MessageBox';

export type MessageRoomProps = React.ComponentPropsWithoutRef<'div'> & {
  token: string;
  serverUrl: string;
};

export function MessageRoom({ className, token, serverUrl, ...rest }: MessageRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { canPlaybackAudio, handleConfirmAudioPlayback, say } = useLiveKitRoom({
    videoRef,
    audioRef,
    token,
    serverUrl,
  });

  return (
    <div className={twMerge('flex h-dvh items-center justify-center', className)} {...rest}>
      <video ref={videoRef} autoPlay playsInline muted />
      <audio ref={audioRef} className="hidden" autoPlay playsInline muted />
      <div className="absolute bottom-4 left-4 right-4 flex justify-center">
        <MessageBox onSay={say} />
      </div>
      {!canPlaybackAudio && <AudioPlaybackWarning onConfirm={handleConfirmAudioPlayback} />}
    </div>
  );
}
