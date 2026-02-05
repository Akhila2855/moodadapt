
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOODS, LANGUAGES } from '../constants';
import { useMood } from '../App';
import { api } from '../services/api';

const Home: React.FC = () => {
  const { setMood, language, setLanguage } = useMood();
  const navigate = useNavigate();

  const handleMoodSelect = async (mood: typeof MOODS[0]) => {
    await api.saveMood(mood);
    setMood(mood);
    navigate('/recommendations');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16">
      <header className="text-center space-y-8 pt-12 relative">
        {/* Glow background effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/10 blur-[150px] rounded-full -z-10"></div>
        
        <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase mb-4 backdrop-blur-sm">
          Neural Synchronization Active
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xs font-black text-cyan-500/60 uppercase tracking-[0.5em]">System Protocol</h2>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase">
            <span className="block mb-2">Mood Adaptive</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Music</span>
            <span className="mx-4 text-slate-700">&</span>
            <span className="block mt-2">Activity <span className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-8">Recommendation</span></span>
          </h1>
        </div>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
          High-fidelity emotional calibration. Tailoring auditory waves and wellness protocols to your biometric signature.
        </p>
      </header>

      <section className="glass rounded-[4rem] p-10 md:p-16 relative overflow-hidden">
        {/* Decorative Pulse Line Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
           <svg viewBox="0 0 1000 100" className="w-full h-24 text-cyan-400 mt-20">
              <path d="M0 50 H300 L320 20 L340 80 L360 0 L380 100 L400 50 H1000" fill="none" stroke="currentColor" strokeWidth="1" />
           </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Left Column: Language */}
          <div className="space-y-8">
            <h2 className="text-xs font-black text-cyan-500/60 uppercase tracking-[0.5em] pl-3 border-l-2 border-cyan-500">01 Signal Matrix</h2>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`px-5 py-3 rounded-2xl transition-all duration-300 border font-bold text-xs uppercase tracking-widest ${
                    language === lang.id 
                    ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,245,255,0.3)]' 
                    : 'bg-black/40 border-white/10 text-slate-500 hover:border-cyan-500/50'
                  }`}
                >
                  {lang.icon} {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Diagnostic Note */}
          <div className="bg-black/40 rounded-[2.5rem] p-8 border border-white/5 flex items-center">
             <p className="text-sm text-slate-500 italic font-medium leading-relaxed">
               "Setting user mood requires precise harmonic resonance. Select your current status (LVL 1-10) to initiate the synchronization sequence."
             </p>
          </div>
        </div>

        <div className="mt-16 space-y-8 relative z-10">
          <h2 className="text-xs font-black text-cyan-500/60 uppercase tracking-[0.5em] pl-3 border-l-2 border-cyan-500">02 Heartbeat Input</h2>
          <div className="flex items-center justify-between gap-3 overflow-x-auto pb-8 no-scrollbar">
            {MOODS.map((mood) => (
              <button
                key={mood.score}
                onClick={() => handleMoodSelect(mood)}
                className="group relative flex flex-col items-center p-6 bg-black/40 rounded-3xl transition-all duration-500 border border-white/5 hover:border-cyan-400 hover:bg-cyan-500/5 flex-shrink-0 min-w-[100px] hover:-translate-y-2"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {mood.emoji}
                </div>
                <div className="space-y-1 text-center">
                  <span className="block text-[10px] font-black text-cyan-500 tracking-widest">
                    LVL {mood.score}
                  </span>
                  <span className="block text-[10px] font-bold text-white uppercase opacity-60">
                    {mood.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {[
          { icon: '📻', title: 'Sonic Pulse', desc: 'Audio streams curated for neurological balance.' },
          { icon: '📡', title: 'Action Nodes', desc: 'Physical protocols to shift behavioral states.' },
          { icon: '🧬', title: 'Flow Logic', desc: 'Cognitive challenges to ground drifting focus.' },
        ].map((feat, i) => (
          <div key={i} className="glass p-10 rounded-[3rem] group hover:bg-cyan-500/5 transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-8 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/20 transition-all">
              {feat.icon}
            </div>
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tighter">{feat.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-medium">{feat.desc}</p>
          </div>
        ))}
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;