const baseUrl = process.env.AVATAR_API_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'X-API-Key': process.env.AVATAR_API_KEY ?? '',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export type CreateRoomResponse = {
  token: string;
  serverUrl: string;
};

export async function createRoom(avatar: string | null, avatarVersionId: string | null) {
  return request<CreateRoomResponse>('/rooms', {
    method: 'POST',
    body: JSON.stringify({
      avatarId: avatar && parseInt(avatar, 10),
      avatarVersionId: avatarVersionId && parseInt(avatarVersionId, 10),
    }),
    cache: 'no-store',
  });
}

export type Avatar = {
  id: number;
  name: string;
  thumbnail: string;
};

export async function getAvatars() {
  return request<Avatar[]>('/avatars', { cache: 'no-store' });
}
