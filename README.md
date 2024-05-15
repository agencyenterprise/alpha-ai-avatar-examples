# Integration

If you're wondering how to integrate with the avatar you're in the right place!

## Overview

The API was created using Golang and we use [LikeKit](https://livekit.io/) for streaming audio, video, and data over the network. LiveKit offers SDKs in several languages to facilitate integration.

Inside this folder there's an example of a web client integrated using the JS SDK. More examples will be added soon, feel free to contribute!

## Instructions

First thing is to talk to the Avatar team to get yourself an `API key`. Keep it secret!

Send your `API key` in the header of every request to our API:

```
[Header] X-API-Key: ...
```

### 1. Get all avatars available

Get the list of avatars available to your account.

#### Request

```
GET /avatars
```

#### Response

```javascript
{
  "id": 1,
  "name": "Marie Curie",
  "thumbnail": "https://alpha-avatar-thumbnail.s3.us-west-2.amazonaws.com/marie_curie.png",
  "createdAt": "2024-05-03T14:44:04.278774Z",
  "updatedAt": "2024-05-03T14:44:04.278774Z",
  "deletedAt": null,
  "Applications": null,
  "avatarVersions": null
}
```

### 2. Create Room

From your backend, ask the avatar to join a new [LiveKit Room](https://docs.livekit.io/realtime/concepts/api-primitives/#Room). This room is where the avatar's video and audio will be transmitted.

**PS:** If no one else is in the room for 30 seconds, the avatar will leave and you will need to create a new room.

#### Request

```
POST /rooms
```

| Body       | Type  | Description                                  |
| :--------- | :---- | :------------------------------------------- |
| `avatarId` | `int` | **Required**. ID that identifies your avatar |

#### Response

```javascript
{
  "token": string,
  "serverUrl": string,
  "roomId": int
}
```

### 3. Join Room

From your frontend, join the room using the [LiveKit SDK](https://docs.livekit.io/realtime/) of your choice.

Use the `token` and `serverUrl` provided in the previous step to connect to the correct room.

### 4. Ask the Avatar to say something

Use [LiveKit's Publish Data](https://docs.livekit.io/realtime/client/data-messages/#Data-messages) feature to send a **reliable** message to the avatar to make it say something. The avatar will read your message in the room.

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(JSON.stringify({ message: 'Hello, World!' }));
room.localParticipant.publishData(data, { reliable: true });
```

To change the voice and voice style of an avatar using one of Azure's supported options, include the `voiceName` and `voiceStyle` parameters in the encoded text.

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(
  JSON.stringify({
    message: 'Hello, World!',
    voiceName: 'en-US-DavisNeural',
    voiceStyle: 'angry',
  }),
);
room.localParticipant.publishData(data, { reliable: true });
```

Note that not all voices support `voiceStyle`. You can retrieve a list of available voices and styles by making a GET request."

```
GET /supported-voices
```

### 5. Send an action to the avatar to stop talking

To "interrupt" the avatar from an ongoing sentence, send an `avatarAction` = 1.

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(JSON.stringify({ message: '', avatarAction: 1 }));
roomRef.current?.localParticipant?.publishData(data, { reliable: true });
```

## Test

Before using the production server and API Key, please use our staging environment to integrate and perform the first tests.

```
https://staging.avatar.alpha.school
```
