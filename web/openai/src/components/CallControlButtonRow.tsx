import Image from 'next/image';

import type { Dispatch, SetStateAction } from 'react';

interface CallControlProps {
  isCallActive: boolean;
  isMicMuted: boolean;
  stopCall: () => void;
  setIsMicMuted: Dispatch<SetStateAction<boolean>>;
  setIsViewingAvatarSelect: Dispatch<SetStateAction<boolean>>;
}

export const CallControlButtonRow = ({
  isMicMuted,
  stopCall,
  setIsViewingAvatarSelect,
  setIsMicMuted,
}: CallControlProps) => {
  return (
    <div className="relative flex h-12 w-full flex-row items-center justify-center gap-2">
      <button className="h-full" onClick={() => setIsViewingAvatarSelect(true)}>
        <Image className="h-full object-contain" src={'/change_avatar.svg'} width={60} height={60} alt="" />
      </button>
      <button className="h-full" onClick={() => setIsMicMuted((m) => !m)}>
        <Image
          className="h-full object-contain"
          src={isMicMuted ? '/mic_muted.svg' : '/mic_on.svg'}
          width={60}
          height={60}
          alt=""
        />
      </button>
      <button className="h-full" onClick={stopCall}>
        <Image className="h-full object-contain" src={'/end_call.svg'} width={84} height={60} alt="" />
      </button>
    </div>
  );
};
