import { MessageRoom } from '@/components/MessageRoom';
import { createRoom } from '@/lib/api';

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const avatarParam = searchParams?.avatar ?? null;
  const avatarVersionIdParam = searchParams?.avatarVersionId ?? null;

  const avatar = Array.isArray(avatarParam) ? avatarParam[0] : avatarParam;
  const avatarVersionId = Array.isArray(avatarVersionIdParam) ? avatarVersionIdParam[0] : avatarVersionIdParam;

  const { token, serverUrl } = await createRoom(avatar, avatarVersionId);
  return <MessageRoom token={token} serverUrl={serverUrl} />;
}
