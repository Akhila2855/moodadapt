
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import ActivitiesPage from './pages/ActivitiesPage';
import GamesSelection from './pages/GamesSelection';
import PuzzleGame from './pages/games/PuzzleGame';
import GuessGame from './pages/games/GuessGame';
import MazeGame from './pages/games/MazeGame';
import { MoodData } from './types';

interface MoodContextType {
  mood: MoodData | null;
  setMood: (mood: MoodData) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used within a MoodProvider');
  return context;
};

const App: React.FC = () => {
  const [mood, setMood] = useState<MoodData | null>(null);
  const [language, setLanguage] = useState<string>('global');

  return (
    <MoodContext.Provider value={{ mood, setMood, language, setLanguage }}>
      <Router>
        <div className="min-h-screen text-slate-200">
          <Navbar />
          <main className="container mx-auto px-6 py-12 max-w-7xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recommendations" element={mood ? <Recommendations /> : <Navigate to="/" />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/games" element={<GamesSelection />} />
              <Route path="/games/puzzle" element={<PuzzleGame />} />
              <Route path="/games/guess" element={<GuessGame />} />
              <Route path="/games/maze" element={<MazeGame />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </MoodContext.Provider>
  );
};

export default App;
