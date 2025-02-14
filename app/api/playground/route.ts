import { NextResponse } from 'next/server';
import { GPTService } from '@/services/gptService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, level, userContext } = body;

    if (!topic || !level || !userContext) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const gptService = new GPTService();
    const question = await gptService.getPlaygroundQuestion(topic, level, userContext);
    
    return NextResponse.json(question);
  } catch (error) {
    console.error('Playground API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
