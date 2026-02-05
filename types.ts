
export interface MoodData {
  score: number;
  emoji: string;
  label: string;
  color: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'physical' | 'mental' | 'creative' | 'social';
  youtubeUrl: string;
}

export interface GameScore {
  gameId: string;
  score: number;
  date: string;
}

export enum GameType {
  PUZZLE = 'puzzle',
  GUESS = 'guess',
  MAZE = 'maze'
}