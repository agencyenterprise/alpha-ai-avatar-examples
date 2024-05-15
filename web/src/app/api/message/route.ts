import { AzureKeyCredential, OpenAIClient } from '@azure/openai';

import type { ChatRequestMessageUnion, GetChatCompletionsOptions } from '@azure/openai';

export const dynamic = 'force-dynamic';

const endpoint = process.env.OPENAI_API_URL ?? '';
const apiKey = process.env.OPENAI_API_KEY ?? '';
const deploymentId = process.env.OPENAI_MODEL ?? '';

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

export async function POST(request: Request) {
  const { messages, options }: { messages: ChatRequestMessageUnion[]; options?: GetChatCompletionsOptions } =
    await request.json();

  const response = await client.getChatCompletions(deploymentId, messages, options);

  return new Response(
    JSON.stringify({
      message: response.choices[0].message?.content ?? 'Error getting chat completion',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
