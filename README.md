# Integration

If you're wondering how to integrate with the avatar you're in the right place!

## Overview

The API was created using Golang and we use [LikeKit](https://livekit.io/) for streaming audio, video, and data over the network. LiveKit offers SDKs in several languages to facilitate integration.

Inside this folder there are a few examples of a web client integrated using the JS SDK. More examples will be added soon, feel free to contribute!

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
const data = encoder.encode(JSON.stringify({ message: "Hello, World!" }));
room.localParticipant.publishData(data, { reliable: true });
```

To change the voice and voice style of an avatar using one of Azure's supported options, include the `voiceName` and `voiceStyle` parameters in the encoded text.

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(
  JSON.stringify({
    message: "Hello, World!",
    voiceName: "en-US-DavisNeural",
    voiceStyle: "angry",
  })
);
room.localParticipant.publishData(data, { reliable: true });
```

Note that not all voices support `voiceStyle`. You can retrieve a list of available voices and styles by making a GET request."

```
GET /supported-voices
```

### 5. Send an action to the avatar to stop talking (Optional)

To "interrupt" the avatar from an ongoing sentence, send an `avatarAction` = 1.

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(JSON.stringify({ message: "", avatarAction: 1 }));
roomRef.current?.localParticipant?.publishData(data, { reliable: true });
```

### 6. Change prosody (Optional)

You can use the prosody config to specify changes to pitch, contour, range, rate, and volume for the text to speech output. For a comprehensive list of possible values for each attribute, please refer to the [Azure documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#adjust-prosody)

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(
  JSON.stringify({
    message: "Hello, World!",
    prosody: {
      contour: "(0%,+20Hz) (10%,-2st) (40%,+10Hz)",
      pitch: "high",
      range: "50%",
      rate: "x-fast",
      volume: "loud",
    },
  })
);
roomRef.current?.localParticipant?.publishData(data, { reliable: true });
```

### 7. Change language (Optional)

By default, all avatars are set to speak English. If you intend for your avatar to speak another language, first verify that the required language is available in Azure and that the `voiceName` used by the avatar supports multilingual.

[Supported Multilingual voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#multilingual-voices-with-the-lang-element)
| Voice |
| :-------------------------------------- |
| `en-US-AndrewMultilingualNeural` (Male) |
| `en-US-AvaMultilingualNeural` (Female) |
| `en-US-BrianMultilingualNeural` (Male) |
| `en-US-EmmaMultilingualNeural` (Female) |

If all requirements are met, you just need to pass the `multilingualLang` parameter in the encoded text.

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(
  JSON.stringify({
    message: "Hello, World!",
    voiceName: "en-US-AndrewMultilingualNeural",
    multilingualLang: "es-ES",
  })
);
room.localParticipant.publishData(data, { reliable: true });
```

### 8. SSML support (Optional)

We support the complete change of SSML `voice` element, which provides a vast set of changes to the avatar's voice, such as support for math, pause, silence...

```javascript
const encoder = new TextEncoder();
const data = encoder.encode(
  JSON.stringify({
    multilingualLang: "en-US",
    ssmlVoiceConfig:
      "<voice name='en-US-AndrewMultilingualNeural'><mstts:express-as style='angry'><mstts:viseme type='FacialExpression'>Hello, World!</mstts:viseme></mstts:express-as></voice>",
  })
);
room.localParticipant.publishData(data, { reliable: true });
```

For the avatar to work properly you must provide `mstt:viseme` with the `FacialExpression` type.

```javascript
<mstts:viseme type="Facial Expression"></mstts:viseme>
```

```
Note: When using this feature, the only other available property you can use is `multilingualLang`.
```

## Test

Before using the production server and API Key, please use our staging environment to integrate and perform the first tests.

```
https://staging.avatar.alpha.school
```
