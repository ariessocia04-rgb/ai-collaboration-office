import { NextResponse } from 'next/server';
import { analyzeMeterPhoto } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    const result = await analyzeMeterPhoto(imageBase64);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze image' }, { status: 500 });
  }
}
