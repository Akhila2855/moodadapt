
import React from 'react';
import { Link } from 'react-router-dom';

const GamesSelection: React.FC = () => {
  const games = [
    {
      id: 'puzzle',
      name: 'Zen Jigsaw',
      description: 'Reconstruct high-definition landscapes to stabilize cognitive drifting.',
      icon: '🖼️',
      path: '/games/puzzle',
      color: 'bg-black/60',
    },
    {
      id: 'guess',
      name: 'Signal Tuner',
      description: 'Isolate the target neural frequency using iterative proximity scanning.',
      icon: '📡',
      path: '/games/guess',
      color: 'bg-black/60',
    },
    {
      id: 'maze',
      name: 'Neural Path',
      description: 'Navigate complex logic circuits to unlock deep concentration nodes.',
      icon: '🧬',
      path: '/games/maze',
      color: 'bg-black/60',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-20 space-y-6">
        <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-[9px] font-black tracking-[0.4em] uppercase mb-4 backdrop-blur-sm">
          Interactive Diagnostics
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
          Focus <span className="text-cyan-400">Modules</span>
        </h1>
        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto italic">
          Induce a high-coherence state through mechanical engagement and non-linear logic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-20">
        {games.map((game) => (
          <Link
            key={game.id}
            to={game.path}
            className="glass group rounded-[4rem] overflow-hidden transition-all duration-500 hover:-translate-y-4 flex flex-col border border-white/5 hover:border-cyan-500/20"
          >
            <div className={`${game.color} h-60 flex items-center justify-center text-8xl transition-all group-hover:bg-cyan-500/10 duration-700 relative border-b border-white/5`}>
              <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors"></div>
              <span className="relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-700">{game.icon}</span>
            </div>
            <div className="p-12 flex-grow flex flex-col">
              <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.4em] mb-2">Target Area</span>
              <h3 className="text-3xl font-black mb-4 text-white tracking-tighter uppercase">{game.name}</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed flex-grow text-sm">{game.description}</p>
              <div className="flex items-center gap-4 text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em] group-hover:gap-6 transition-all">
                Initialize Diagnostic <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamesSelection;
