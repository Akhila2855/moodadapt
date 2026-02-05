
import React from 'react';
import { ACTIVITIES } from '../constants';
import { useMood } from '../App';

const ActivitiesPage: React.FC = () => {
  const { mood } = useMood();

  const getTip = () => {
    if (!mood) return "Select a baseline frequency to optimize these recovery protocols.";
    if (mood.score <= 3) return "Priority: Grounding and autonomic stabilization required.";
    if (mood.score >= 8) return "Priority: Peak state maintenance and synthesis.";
    return "Priority: Cognitive equilibrium and emotional anchoring.";
  };

  const handleRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="glass rounded-[4rem] p-12 mb-16 border-cyan-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-[0.3em]">Module: Behavioral Protocols</div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
            Active <span className="text-cyan-400">Recovery</span> <br/>Sequence
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl italic">"{getTip()}"</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
        {ACTIVITIES.map((activity) => (
          <div 
            key={activity.id} 
            onClick={() => handleRedirect(activity.youtubeUrl)}
            className="glass group rounded-[3rem] p-10 hover:bg-cyan-500/5 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full border-white/5 cursor-pointer"
          >
            <div className="text-5xl mb-10 w-24 h-24 flex items-center justify-center rounded-[2rem] bg-black/40 border border-white/5 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20 transition-all duration-500 drop-shadow-2xl">
              {activity.icon}
            </div>
            <div className="space-y-4 flex-grow">
              <span className="inline-block px-3 py-0.5 bg-black/40 text-cyan-500/60 text-[9px] font-black rounded uppercase tracking-widest border border-white/5">
                PROTOCOL: {activity.category}
              </span>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{activity.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{activity.description}</p>
            </div>
            <div className="mt-10 pt-8 border-t border-white/5">
              <button className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                Execute Stream <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesPage;
