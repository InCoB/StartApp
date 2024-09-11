import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, model } = await req.json()
  const response = await openai.chat.completions.create({
    model: model || 'gpt-4o-mini',
    messages,
    stream: false,
  })
  return new Response(JSON.stringify({ content: response.choices[0].message.content }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
