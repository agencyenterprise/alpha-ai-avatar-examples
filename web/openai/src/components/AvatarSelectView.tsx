import Image from 'next/image';

import type { Avatar } from '@/lib/api';

export const AvatarSelectView = ({
  avatars,
  closeView,
  switchAvatar,
}: {
  avatars: Avatar[];
  closeView: () => void;
  switchAvatar: (avatarId: number) => void;
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex justify-center bg-overlay backdrop-blur-lg">
      <div className="hide-scrollbar md:pt-18 h-full max-h-dvh w-full max-w-800 overflow-y-scroll p-4 pt-16 drop-shadow-2xl backdrop-blur-sm">
        <div className="grid grid-flow-row grid-cols-2 sm:grid-cols-4">
          {avatars.map((avatar, index) => (
            <AvatarListItem key={index} avatar={avatar} switchAvatar={() => switchAvatar(avatar.id)} />
          ))}
        </div>
      </div>

      <button
        className="absolute right-4 top-4 h-10 w-10 cursor-pointer rounded-full p-3 transition-all hover:bg-overlay-hover"
        onClick={closeView}
      >
        <Image className="h-full object-contain" src={'/close_icon.svg'} width={60} height={60} alt="Close" />
      </button>
    </div>
  );
};

const AvatarListItem = ({ avatar, switchAvatar }: { avatar: Avatar; switchAvatar: () => void }) => {
  return (
    <button
      onClick={switchAvatar}
      className="flex flex-col items-center gap-2 rounded-lg p-4 transition-all hover:bg-overlay-hover"
    >
      <Image
        src={avatar.thumbnail}
        alt=""
        className="aspect-square h-full w-36 object-cover"
        height={144}
        width={160}
      />
      <p className="text-center text-white md:text-lg">{avatar.name}</p>
    </button>
  );
};
