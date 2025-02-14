import { Question, UserContext, ExploreResponse } from '@/types';

class APIService {
  async getExploreContent(query: string, userContext: UserContext): Promise<ExploreResponse> {
    const response = await fetch('/api/explore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, userContext }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch explore content');
    }

    return response.json();
  }

  async getPlaygroundQuestion(topic: string, level: number, userContext: UserContext): Promise<Question> {
    const response = await fetch('/api/playground', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, level, userContext }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playground question');
    }

    return response.json();
  }
}

export const apiService = new APIService();
