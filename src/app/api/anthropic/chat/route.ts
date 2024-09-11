import { StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  // Implement your chat logic here without using Anthropic
  // For now, let's just return a dummy response
  const dummyResponse = new ReadableStream({
    start(controller) {
      controller.enqueue('This is a dummy response.');
      controller.close();
    },
  });

  return new StreamingTextResponse(dummyResponse);
}
