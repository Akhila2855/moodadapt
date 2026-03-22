import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Gamepad2, LayoutDashboard, History, Heart, ArrowLeft, Clock, Music } from 'lucide-react';
import { MoodSelector } from './components/MoodSelector';
import { MusicPlayer } from './components/MusicPlayer';
import { ActivityList } from './components/ActivityList';
import { MoodDashboard } from './components/MoodDashboard';
import { GamesSection } from './components/GamesSection';
import { getRecommendations, learnFromActivity } from './services/qLearning';
import { saveMoodEntry, getPreference, savePreference } from './services/db';

export default function App() {
  const [appState, setAppState] = useState('landing');
  const [currentMood, setCurrentMood] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [recommendations, setRecommendations] = useState([]);
  const [completedActivityIds, setCompletedActivityIds] = useState(new Set());
  const [activeActivityId, setActiveActivityId] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  // Load preferences
  useEffect(() => {
    const load = async () => {
      const lang = await getPreference('language');
      if (lang) setSelectedLanguage(lang);
    };
    load();
  }, []);

  const handleMoodDetected = async (emotion, score, language) => {
    setSelectedLanguage(language);
    savePreference('language', language);
    
    const isUpdate = appState !== 'landing';
    
    if (isUpdate && currentMood && activeActivityId) {
      const improvement = score - currentMood.score;
      await learnFromActivity(currentMood.emotion, activeActivityId, improvement);
      
      await saveMoodEntry({
        timestamp: Date.now(),
        initialMood: currentMood.emotion,
        initialScore: currentMood.score,
        activityId: activeActivityId,
        finalMood: emotion,
        finalScore: score,
        improvement
      });
      setActiveActivityId(null);
    } else {
      await saveMoodEntry({
        timestamp: Date.now(),
        initialMood: emotion,
        initialScore: score
      });
    }

    setCurrentMood({ emotion, score });
    const recs = await getRecommendations(emotion);
    setRecommendations(recs);
    setAppState('selection');
    setLastCheckTime(Date.now());
  };

  const handleActivityComplete = (activityId) => {
    setActiveActivityId(activityId);
    setCompletedActivityIds(prev => new Set(prev).add(activityId));
  };

  // 10-minute check timer
  useEffect(() => {
    if (appState === 'landing') return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastCheckTime >= 10 * 60 * 1000) {
        console.log("Time for a quick mood check-in!");
        setAppState('landing');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [appState, lastCheckTime]);

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-3xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-black text-cyan-400 uppercase tracking-tighter mb-6 max-w-2xl mx-auto"
              >
                Transformer Based Mood Adaptive Music Generator And Activity Recommendation
              </motion.h1>
              <h2 className="text-5xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
                How are you <span className="text-cyan-400">feeling</span> right now?
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Sync your mood with curated music, activities, and games to elevate your state.
              </p>
            </div>

            <MoodSelector 
              onMoodDetected={handleMoodDetected} 
              initialLanguage={selectedLanguage}
            />
          </motion.div>
        );

      case 'selection':
        return (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 relative"
          >
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5 z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                  <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.3em]">Current State</p>
                  <h2 className="text-6xl font-black tracking-tighter">{currentMood?.emotion}</h2>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Sparkles size={16} className="text-cyan-400" />
                    <span className="text-sm font-bold">Optimized Experience</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black shadow-lg">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Next Check-in</p>
                    <p className="text-xl font-black">10 Minutes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-[#0A0A0A] rounded-[2.5rem] p-1 overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
                onClick={() => setAppState('music')}
              >
                <div className="relative aspect-[4/3] rounded-[2.2rem] overflow-hidden bg-slate-900">
                  <img src="https://picsum.photos/seed/music/800/600" className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    STEP 01
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Music Therapy</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Hand-picked {selectedLanguage} tracks to help you find your rhythm and peace.
                  </p>
                  <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all active:scale-95">
                    Start Listening
                  </button>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-[#0A0A0A] rounded-[2.5rem] p-1 overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
                onClick={() => setAppState('activities')}
              >
                <div className="relative aspect-[4/3] rounded-[2.2rem] overflow-hidden bg-slate-900">
                  <img src="https://picsum.photos/seed/yoga/800/600" className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    STEP 02
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Mindful Movement</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Simple grounding exercises to help you feel more present and balanced in your body.
                  </p>
                  <button className="w-full py-4 bg-[#151515] text-white border border-white/10 font-black uppercase tracking-widest rounded-2xl transition-all group-hover:bg-[#1A1A1A] group-hover:border-cyan-500/50 active:scale-95">
                    Explore Activities
                  </button>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-[#0A0A0A] rounded-[2.5rem] p-1 overflow-hidden group cursor-pointer border border-white/5 shadow-2xl"
                onClick={() => setAppState('games')}
              >
                <div className="relative aspect-[4/3] rounded-[2.2rem] overflow-hidden bg-slate-900">
                  <img src="https://picsum.photos/seed/game/800/600" className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    STEP 03
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">Playful Flow</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Fun challenges designed to help you find your focus and quiet the noise of the day.
                  </p>
                  <button className="w-full py-4 bg-[#151515] text-white border border-white/10 font-black uppercase tracking-widest rounded-2xl transition-all group-hover:bg-[#1A1A1A] group-hover:border-cyan-500/50 active:scale-95">
                    Start Playing
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6 pt-12 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                  <LayoutDashboard size={20} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Mood Analytics</h3>
              </div>
              <MoodDashboard />
            </div>
          </motion.div>
        );

      case 'music':
        return (
          <motion.div 
            key="music"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8"
          >
            <button onClick={() => setAppState('selection')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-cyan-400 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Protocols</span>
            </button>
            <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-white/5">
              <MusicPlayer mood={currentMood?.emotion || 'Calm'} language={selectedLanguage} />
            </div>
          </motion.div>
        );

      case 'activities':
        return (
          <motion.div 
            key="activities"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8"
          >
            <button onClick={() => setAppState('selection')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-cyan-400 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Protocols</span>
            </button>
            <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-12">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
                  <Heart size={24} />
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Physical Reset Protocols</h3>
              </div>
              <ActivityList 
                activities={recommendations} 
                completedActivityIds={completedActivityIds}
                onComplete={handleActivityComplete} 
              />
            </div>
          </motion.div>
        );

      case 'games':
        return (
          <motion.div 
            key="games"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-8"
          >
            <button onClick={() => setAppState('selection')} className="flex items-center gap-2 text-slate-400 font-bold hover:text-cyan-400 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Protocols</span>
            </button>
            <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-white/5">
              <GamesSection />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-serif selection:bg-cyan-500/20 selection:text-cyan-400">
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg overflow-hidden p-1 border border-white/10">
              <svg viewBox="0 0 100 40" className="w-full h-full stroke-cyan-400 stroke-[3] fill-none">
                <path d="M0 20 L30 20 L35 10 L45 30 L50 5 L60 35 L65 20 L100 20" />
              </svg>
            </div>
          </div>
          
          {appState !== 'landing' && (
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button 
                  onClick={() => setAppState('selection')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${appState === 'selection' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setAppState('activities')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${appState === 'activities' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Activities
                </button>
                <button 
                  onClick={() => setAppState('games')}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${appState === 'games' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  Games
                </button>
              </nav>
              <button 
                onClick={() => setAppState('landing')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Reset Mood</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <footer className="py-20 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
              <Brain className="text-black" size={16} />
            </div>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><History size={20} /></a>
            <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><Sparkles size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
