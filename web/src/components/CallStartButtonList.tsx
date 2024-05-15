import type { Dispatch, SetStateAction } from 'react';

export const CallStartButtonList = ({
  startCall,
  setIsViewingAvatarSelect,
}: {
  startCall: () => void;
  setIsViewingAvatarSelect: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center gap-6">
      <button onClick={startCall} className="flex w-36 items-center justify-center rounded-full bg-btn-action py-3">
        <p className="text-white">{`Start Call`}</p>
      </button>

      <button
        onClick={() => setIsViewingAvatarSelect(true)}
        className="flex w-36 items-center justify-center rounded-full bg-blue-800 py-3"
      >
        <p className="text-white">{`View Avatars`}</p>
      </button>
    </div>
  );
};
