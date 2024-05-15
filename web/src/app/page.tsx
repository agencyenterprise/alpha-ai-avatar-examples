import { ConversationRoom } from '@/components/ConversationRoom';
import { createRoom, getAvatars } from '@/lib/api';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const avatarParam = searchParams?.avatar ?? null;
  const avatarVersionIdParam = searchParams?.avatarVersionId ?? null;

  const avatar = Array.isArray(avatarParam) ? avatarParam[0] : avatarParam;
  const avatarVersionId = Array.isArray(avatarVersionIdParam) ? avatarVersionIdParam[0] : avatarVersionIdParam;

  const avatars = await getAvatars();
  const { token, serverUrl } = await createRoom(avatar, avatarVersionId);
  return <ConversationRoom token={token} serverUrl={serverUrl} avatarId={avatar} avatars={avatars} />;
}
