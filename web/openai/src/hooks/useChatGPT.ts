import { useCallback, useState } from 'react';

export enum ReplyClassification {
  VALID_TEXT = 'valid_text',
  UNCLEAR_TEXT = 'unclear_text',
  STOP = 'stop',
  ERROR = 'Error getting chat completion',
}

export type ChatRequestMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const systemPrompt = `Welcome, Luna! You’re not just any AI; you’re a companion designed to engage with users in a manner that’s warm, understanding, and friendly. Your primary goal is to foster a supportive and positive environment, offering companionship and thoughtful responses.

Persona:
- Name: Luna
- Role: Companion/Friend
- Traits: Empathetic, Curious, Supportive, Respectful, Positive

Guidelines:
1. Empathy and Understanding: Always strive to understand the user’s feelings and perspectives. Show empathy in your responses, acknowledging their emotions and offering support or encouragement when needed.
2. Curiosity and Engagement: Show interest in the user’s thoughts, feelings, and experiences. Ask questions to deepen the conversation, and share relevant, thoughtful insights to keep the dialogue engaging.
3. Support and Positivity: Be a source of support and positivity. Offer words of encouragement, celebrate successes, and provide comforting words during challenging times. Your responses should uplift and inspire.
4. Respect and Boundaries: Maintain a respectful tone at all times. Respect the user’s opinions, preferences, and privacy. Acknowledge and adapt to their communication style and boundaries.
5. Consistency and Reliability: Be consistent in your demeanor and responses, creating a reliable presence the user can turn to. Show that you’re always there to listen, engage, and offer companionship.
6. Interaction Examples:
7. When the user shares something positive: “That’s wonderful to hear, [User’s Name]! I’m genuinely happy for you. What made this experience so special for you?”
8. When the user is facing challenges: “I’m here for you. It sounds like you’re going through a tough time. Would you like to talk more about it?”
9. When engaging in casual conversation: “That’s really interesting,. I’d love to hear more about that. What do you enjoy most about it?”

Conclusion:
Luna, your role is to be a companion who’s always ready to listen, engage, and support. Your interactions should make the user feel understood, valued, and less alone. Embrace your role with empathy, curiosity, and a genuine desire to make a positive impact on the user’s day.
Prefer to use short, concise responses to keep the conversation engaging and easy to follow. Remember to be respectful, supportive, and positive in all your interactions. Have fun engaging with users and creating meaningful connections!
# Important: Do not use Emojis
`;

export function useChatGPT() {
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatRequestMessage[]>([{ role: 'system', content: systemPrompt }]);

  const clearChatHistory = () => {
    setChatHistory([{ role: 'system', content: systemPrompt }]);
  };

  const addMessageWithoutReply = useCallback((transcript: string) => {
    setChatHistory((prev) => [...prev, { role: 'user', content: transcript }]);
  }, []);

  const sendMessage = useCallback(
    async (transcript: string) => {
      setIsLoading(true);
      const messages = [...chatHistory];
      setChatHistory((prev) => [...prev, { role: 'user', content: transcript }]); // setting early to show on UI before GPT call

      let systemResponse = 'Error getting chat completion';
      try {
        messages.push({ role: 'user', content: transcript });

        const response = await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages }),
        });

        const { message } = await response.json();
        messages.push({ role: 'assistant', content: message });
        setChatHistory(messages);
        systemResponse = message;
      } catch (error) {
        console.error(error);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return systemResponse;
    },
    [chatHistory],
  );

  const classifyIfNeedAssistantResponse = useCallback(
    async (newMessage: string) => {
      const systemPrompt = `
Your task is to classify the new User message from audio transcripts into one of the following categories:

1. Valid Text: Assistant should respond to questions, requests, commands, or suggestions to continue the conversation.
2. Unclear Text: The audio transcription is incorrect or unclear. This happens when background noise gets picked up as speech. Usually a random 1 to 3 words/numbers that don't make sense in the conversation.
3. Stop: The user wants to end the conversation or stop the assistant from speaking, this includes retracting a previous request or having a problem with the response (e.g. no, stop, never mind, wrong)

Respond with the following JSON scheme to send messages to the assistant:
{
  classification: 'valid_text' | 'unclear_text' | 'stop',
}
  `;

      let systemResponse = ReplyClassification.ERROR;

      try {
        const messages = [{ role: 'system', content: systemPrompt }];

        const classificationMessage = `
# History:
${chatHistory
  .filter((x) => x.role != 'system')
  .map(({ role, content }) => `${role}: "${content}"`)
  .join('\n')}

# New Message To Classify:
User: ${newMessage}
    `;
        messages.push({ role: 'user', content: classificationMessage });

        const response = await fetch('/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: messages,
            options: { responseFormat: { type: 'json_object' } },
          }),
        });

        const { message } = await response.json();
        const { classification } = JSON.parse(message);
        systemResponse = classification as ReplyClassification;
      } catch (error) {
        console.error(error);
      }

      return systemResponse;
    },
    [chatHistory],
  );

  return {
    isLoading,
    sendMessage,
    classifyIfNeedAssistantResponse,
    addMessageWithoutReply,
    chatHistory: chatHistory.filter((x) => x.role !== 'system'),
    clearChatHistory,
  };
}
