import React, { useState } from 'react';
import { BreathingBubble } from './BreathingBubble';
import { FocusPuzzle } from './FocusPuzzle';
import { CalmingColors } from './CalmingColors';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Puzzle, Palette, ChevronLeft, ChevronRight } from 'lucide-react';

export const GamesSection = () => {
  const [activeGame, setActiveGame] = useState(0);

  const games = [
    { id: 0, name: 'Vibrant Joy', icon: <Palette />, component: <CalmingColors /> },
    { id: 1, name: 'Breathing Bubble', icon: <Wind />, component: <BreathingBubble /> },
    { id: 2, name: 'Focus Puzzle', icon: <Puzzle />, component: <FocusPuzzle /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Cognitive Flow Protocols</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveGame(prev => (prev > 0 ? prev - 1 : games.length - 1))}
            className="p-2 bg-black rounded-xl shadow-sm border border-white/5 hover:bg-cyan-500 hover:text-white transition-colors text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setActiveGame(prev => (prev < games.length - 1 ? prev + 1 : 0))}
            className="p-2 bg-black rounded-xl shadow-sm border border-white/5 hover:bg-cyan-500 hover:text-white transition-colors text-slate-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {games.map((game, idx) => (
          <button
            key={game.id}
            onClick={() => setActiveGame(idx)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-black uppercase tracking-widest text-xs transition-all border-2 ${
              activeGame === idx 
                ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                : 'bg-black border-white/5 text-slate-500 hover:border-cyan-500/50'
            }`}
          >
            <span className={activeGame === idx ? 'text-black' : 'text-cyan-400'}>{game.icon}</span>
            <span>{game.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeGame}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="w-full bg-slate-900/50 p-8 rounded-[3rem] border border-white/5 shadow-inner"
        >
          {games[activeGame].component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
