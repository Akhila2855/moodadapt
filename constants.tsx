
import React from 'react';
import { MoodData, Activity } from './types';

export const MOODS: MoodData[] = [
  { score: 1, emoji: '😭', label: 'Devastated', color: 'bg-red-500' },
  { score: 2, emoji: '😢', label: 'Sad', color: 'bg-red-400' },
  { score: 3, emoji: '😔', label: 'Lonely', color: 'bg-orange-400' },
  { score: 4, emoji: '😕', label: 'Confused', color: 'bg-orange-300' },
  { score: 5, emoji: '😐', label: 'Neutral', color: 'bg-yellow-300' },
  { score: 6, emoji: '🙂', label: 'Fine', color: 'bg-lime-300' },
  { score: 7, emoji: '😊', label: 'Happy', color: 'bg-green-400' },
  { score: 8, emoji: '😄', label: 'Cheerful', color: 'bg-teal-400' },
  { score: 9, emoji: '😁', label: 'Excited', color: 'bg-blue-400' },
  { score: 10, emoji: '🤩', label: 'Ecstatic', color: 'bg-purple-500' },
];

export const LANGUAGES = [
  { id: 'english', label: 'English', icon: '🇺🇸' },
  { id: 'hindi', label: 'Hindi', icon: '🇮🇳' },
  { id: 'tamil', label: 'Tamil', icon: '🇮🇳' },
  { id: 'telugu', label: 'Telugu', icon: '🇮🇳' },
  { id: 'punjabi', label: 'Punjabi', icon: '🇮🇳' },
  { id: 'korean', label: 'Korean', icon: '🇰🇷' },
  { id: 'japanese', label: 'Japanese', icon: '🇯🇵' },
];

export const GET_SPOTIFY_URL = (moodScore: number, langId: string) => {
  const base = "https://open.spotify.com/search/";
  let query = "";
  
  if (moodScore <= 2) {
    query = "healing therapeutic mood booster";
  } else if (moodScore <= 4) {
    query = "uplifting feel good vibes";
  } else if (moodScore <= 6) {
    query = "chill acoustic lofi";
  } else if (moodScore <= 8) {
    query = "happy party hits energy";
  } else {
    query = "anthems high frequency";
  }

  const langQuery = langId === 'english' ? 'global' : langId;
  return `${base}${query} ${langQuery}`;
};

export const ACTIVITIES: Activity[] = [
  { 
    id: '1', 
    title: 'Deep Breathing', 
    description: 'Master the 4-4-4 technique to instantly calm your nervous system.', 
    icon: '🫁', 
    category: 'mental',
    youtubeUrl: 'https://www.youtube.com/results?search_query=box+breathing+technique+tutorial'
  },
  { 
    id: '2', 
    title: '10-Min Flow Walk', 
    description: 'A guided mindfulness walk to ground yourself in your surroundings.', 
    icon: '🚶', 
    category: 'physical',
    youtubeUrl: 'https://www.youtube.com/results?search_query=mindful+walking+meditation+10+minutes'
  },
  { 
    id: '3', 
    title: 'Gratitude Journaling', 
    description: 'Scientific benefits of journaling and how to start effectively.', 
    icon: '✍️', 
    category: 'creative',
    youtubeUrl: 'https://www.youtube.com/results?search_query=gratitude+journaling+for+beginners'
  },
  { 
    id: '4', 
    title: 'Dopamine Dance', 
    description: 'Boost your mood instantly with a 3-minute high-energy dance break.', 
    icon: '💃', 
    category: 'physical',
    youtubeUrl: 'https://www.youtube.com/results?search_query=3+minute+dance+party+workout'
  },
  { 
    id: '5', 
    title: 'Social Connection', 
    description: 'The science of friendship and how a simple call changes your brain.', 
    icon: '📞', 
    category: 'social',
    youtubeUrl: 'https://www.youtube.com/results?search_query=the+power+of+social+connection+ted+talk'
  },
  { 
    id: '6', 
    title: 'Zen Meditation', 
    description: 'A short 5-minute session to reset your cognitive load.', 
    icon: '🧘', 
    category: 'mental',
    youtubeUrl: 'https://www.youtube.com/results?search_query=5+minute+guided+meditation+calm'
  },
  { 
    id: '7', 
    title: 'Creative Doodling', 
    description: 'Unlock your creative flow with simple visual exercises.', 
    icon: '🎨', 
    category: 'creative',
    youtubeUrl: 'https://www.youtube.com/results?search_query=zentangle+doodling+for+relaxation'
  },
  { 
    id: '8', 
    title: 'Optimal Power Nap', 
    description: 'How to take the perfect 20-minute nap without feeling groggy.', 
    icon: '😴', 
    category: 'mental',
    youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+power+nap+properly'
  },
];