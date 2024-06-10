'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { ReplyClassification, useChatGPT } from '@/hooks/useChatGPT';
import { useLiveKitRoom } from '@/hooks/useLiveKitRoom';
import { useMic } from '@/hooks/useMic';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

import { AudioPlaybackWarning } from './AudioPlaybackWarning';
import { AvatarSelectView } from './AvatarSelectView';
import { CallControlButtonRow } from './CallControlButtonRow';
import { CallStartButtonList } from './CallStartButtonList';
import { ChatWindow } from './ChatWindow';

import type { Avatar } from '@/lib/api';

export type ConversationRoomProps = React.ComponentPropsWithoutRef<'div'> & {
  token: string;
  serverUrl: string;
  avatarId: string | null;
  avatars: Avatar[];
};

export function ConversationRoom({ className, token, serverUrl, avatarId, avatars, ...rest }: ConversationRoomProps) {
  useMic();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { sendMessage, classifyIfNeedAssistantResponse, addMessageWithoutReply, chatHistory, clearChatHistory } =
    useChatGPT();
  const [messagesQueue, setMessagesQueue] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isViewingAvatarSelect, setIsViewingAvatarSelect] = useState(false);

  const onSpeechRecognized = useCallback(
    async (transcript: string) => {
      console.log('User: "', transcript, '"');
      if (!isCallActive || isMicMuted || isViewingAvatarSelect) {
        console.log('Ignoring transcript: ', {
          isCallActive,
          isMicMuted,
          isViewingAvatarSelect,
        });
        return;
      }

      setMessagesQueue((prev) => [...prev, transcript]);
    },
    [isCallActive, isMicMuted, isViewingAvatarSelect],
  );

  const { isConnected, isAvatarSpeaking, canPlaybackAudio, handleConfirmAudioPlayback, say, stop, disconnect } =
    useLiveKitRoom({
      videoRef,
      audioRef,
      token,
      serverUrl,
      onSpeechRecognized,
    });

  const { startRecognizing, stopRecognizing } = useSpeechRecognition({
    onSpeechRecognized,
  });

  const readQueue = useCallback(async () => {
    if (messagesQueue.length === 0) {
      return;
    }

    const [message, ...rest] = messagesQueue;
    setMessagesQueue(rest);

    const should_reply = await classifyIfNeedAssistantResponse(message);
    console.log({ classification: should_reply });

    switch (should_reply) {
      case ReplyClassification.UNCLEAR_TEXT:
      case ReplyClassification.ERROR:
        return;
      case ReplyClassification.STOP:
        addMessageWithoutReply(message);
        stop();
        return;
      case ReplyClassification.VALID_TEXT:
        if (isAvatarSpeaking) {
          stop();
        }
        const response = await sendMessage(message);
        say(response);
    }
  }, [
    isAvatarSpeaking,
    messagesQueue,
    say,
    sendMessage,
    stop,
    addMessageWithoutReply,
    classifyIfNeedAssistantResponse,
  ]);

  const startCall = () => {
    setIsCallActive(true);
    setIsMicMuted(false);
  };

  const stopCall = () => {
    setIsCallActive(false);
    clearChatHistory();
    if (isAvatarSpeaking) {
      stop();
    }
  };

  const switchAvatar = (avatarId: number) => {
    setIsViewingAvatarSelect(false);
    clearChatHistory();
    disconnect();
    const current = new URLSearchParams(searchParams);
    current.delete('avatarVersionId');
    current.set('avatar', String(avatarId));

    const search = current.toString();
    router.push(`${pathname}?${search}`);
  };

  useEffect(() => {
    readQueue();
  }, [readQueue, messagesQueue, isAvatarSpeaking]);

  useEffect(() => {
    if (isConnected) {
      startRecognizing();
    }
    return () => {
      stopRecognizing();
    };
  }, [isConnected, startRecognizing, stopRecognizing]);

  return (
    <div
      className={twMerge('max-w-dvw flex h-full max-h-dvh w-full overflow-hidden bg-slate-100 lg:flex-row')}
      {...rest}
    >
      <audio ref={audioRef} className="hidden" autoPlay playsInline muted />

      {isViewingAvatarSelect && (
        <AvatarSelectView
          avatars={avatars}
          switchAvatar={switchAvatar}
          closeView={() => setIsViewingAvatarSelect(false)}
        />
      )}

      <div className="max-w-dvh relative flex h-dvh w-full flex-1 items-center justify-center bg-slate-950">
        <div className="flex flex-col">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-[100%] w-[100%] md:h-[512px] md:w-[512px]"
            style={{
              aspectRatio: 1,
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center">
          {isCallActive && (
            <CallControlButtonRow
              isCallActive={isCallActive}
              isMicMuted={isMicMuted}
              stopCall={stopCall}
              setIsViewingAvatarSelect={setIsViewingAvatarSelect}
              setIsMicMuted={setIsMicMuted}
            />
          )}
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 md:relative md:bottom-0 md:h-dvh md:w-[40vw] md:max-w-512 md:bg-slate-950">
        {isCallActive ? (
          <ChatWindow chatHistory={chatHistory} />
        ) : (
          <CallStartButtonList startCall={startCall} setIsViewingAvatarSelect={setIsViewingAvatarSelect} />
        )}
      </div>

      {!canPlaybackAudio && <AudioPlaybackWarning onConfirm={handleConfirmAudioPlayback} />}
    </div>
  );
}
