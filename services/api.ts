
/**
 * Mock API Service
 * This simulates the Django backend endpoints defined in views.py.
 * In a real environment, these would be fetch() calls to the Django server.
 */

import { MoodData, GameScore, GameType } from '../types';

const STORAGE_KEYS = {
  MOOD: 'mood_adapt_current_mood',
  SCORES: 'mood_adapt_scores',
};

export const api = {
  // POST /api/mood/save/
  saveMood: async (mood: MoodData): Promise<{ status: string }> => {
    console.log('Django API: Saving mood...', mood);
    localStorage.setItem(STORAGE_KEYS.MOOD, JSON.stringify(mood));
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: 'success' };
  },

  // POST /api/score/submit/
  submitScore: async (scoreData: { game_type: string, score: number, moves?: number, time_taken: number }): Promise<{ status: string }> => {
    console.log('Django API: Submitting score...', scoreData);
    const existingScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES) || '[]');
    const newEntry = {
      ...scoreData,
      username: 'Guest User', // Simulating request.user
      timestamp: new Date().toISOString(),
    };
    existingScores.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(existingScores));
    await new Promise(resolve => setTimeout(resolve, 500));
    return { status: 'score_saved' };
  },

  // GET /api/leaderboard/<game_type>/
  getLeaderboard: async (gameType: string): Promise<any[]> => {
    const existingScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES) || '[]');
    return existingScores
      .filter((s: any) => s.game_type === gameType)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 5);
  }
};
