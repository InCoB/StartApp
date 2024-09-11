import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  console.log('Deepgram API Key:', apiKey); // This line will help us debug

  if (!apiKey) {
    return NextResponse.json({ error: 'Deepgram API key not found' }, { status: 500 });
  }

  return NextResponse.json({ apiKey });
}