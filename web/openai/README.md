This is an example for how to integrate the Alpha AI Avatar into a web project.

At a high level, this is how the integration looks like:

1. The client requests the Avatar to create and join a room

   ```mermaid
   sequenceDiagram
       participant Client
       participant LiveKit
       participant Avatar
       Client->>+Avatar: POST /avatars/:avatarId/rooms
       Avatar->>LiveKit: create room:
       Avatar->>LiveKit: avatar joins room
       Avatar-->>-Client: token, serverUrl
       Client->>LiveKit: join room (token, serverUrl)
   ```

1. The client asks the Avatar to say something

   ```mermaid
   sequenceDiagram
       participant Client
       participant LiveKit
       participant Avatar
       Client->>LiveKit: message: "lorem ipsum"
       LiveKit->>Avatar: message: "lorem ipsum"
       Avatar-->>Client: avatar says "lorem ipsum"
   ```
