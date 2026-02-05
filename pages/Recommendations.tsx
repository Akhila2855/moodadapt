
import React from 'react';
import { Link } from 'react-router-dom';
import { useMood } from '../App';
import { GET_SPOTIFY_URL, LANGUAGES } from '../constants';

const Recommendations: React.FC = () => {
  const { mood, language } = useMood();

  const spotifyUrl = mood ? GET_SPOTIFY_URL(mood.score, language) : '#';
  const selectedLang = LANGUAGES.find(l => l.id === language);

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-20 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="glass px-12 py-8 rounded-[3rem] border-cyan-500/20 flex items-center gap-8 shadow-2xl">
            <span className="text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{mood?.emoji}</span>
            <div className="text-left">
              <span className="block text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-1">Status Report</span>
              <span className="text-5xl font-black text-white tracking-tighter uppercase">{mood?.label}</span>
            </div>
          </div>
          <div className="bg-black/40 border border-white/5 px-8 py-5 rounded-[2rem] flex items-center gap-4">
             <span className="text-3xl">{selectedLang?.icon}</span>
             <div className="text-left">
               <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Signal Source</span>
               <span className="text-lg font-bold text-white">{selectedLang?.label}</span>
             </div>
          </div>
        </div>
        <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto italic">
          Optimization sequence ready. The following modules have been calculated to match your current neural pulse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Music Card */}
        <div className="glass group rounded-[3.5rem] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-cyan-500/10">
          <div className="h-56 bg-black relative">
            <img src="https://images.unsplash.com/photo-1514525253344-99a42999a99a?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt="Music"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute top-8 left-8 px-4 py-1.5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Phase 01</div>
          </div>
          <div className="p-10 flex flex-col flex-grow bg-black/40">
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Sonic Therapy</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-grow text-sm">
              Adaptive {selectedLang?.label} waveform generation to stabilize emotional peaks and valleys.
            </p>
            <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="btn-classic text-center py-5 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-cyan-500/20">
              Initiate Audio Stream
            </a>
          </div>
        </div>

        {/* Activity Card */}
        <div className="glass group rounded-[3.5rem] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-cyan-500/10">
          <div className="h-56 bg-black relative">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt="Activities"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute top-8 left-8 px-4 py-1.5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Phase 02</div>
          </div>
          <div className="p-10 flex flex-col flex-grow bg-black/40">
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Physical Reset</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-grow text-sm">
              Guided grounding exercises to recalibrate your biological clock to the {mood?.label} baseline.
            </p>
            <Link to="/activities" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 text-center font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all">
              Load Protocols
            </Link>
          </div>
        </div>

        {/* Games Card */}
        <div className="glass group rounded-[3.5rem] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-cyan-500/10">
          <div className="h-56 bg-black relative">
            <img src="https://images.unsplash.com/photo-1550745679-322117a86842?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt="Games"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute top-8 left-8 px-4 py-1.5 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Phase 03</div>
          </div>
          <div className="p-10 flex flex-col flex-grow bg-black/40">
            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Cognitive Flow</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-grow text-sm">
              Engage with non-linear challenges to induce the "Focus State," suppressing intrusive thought patterns.
            </p>
            <Link to="/games" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 text-center font-black py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all">
              Launch Diagnostic
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;