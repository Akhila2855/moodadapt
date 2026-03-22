import React from 'react';
import { ExternalLink, Music, Play, Headphones, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSongsByMoodAndLanguage } from '../data/songs';

export const MusicPlayer = ({ mood, language }) => {
  const songList = getSongsByMoodAndLanguage(mood, language);

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
            <Waves size={24} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Music Therapy</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Your Personalized Playlist • {language}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {songList.length > 0 ? (
          songList.map((song, idx) => (
            <motion.a
              key={song.id}
              href={song.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 10 }}
              className="flex items-center justify-between p-6 bg-black rounded-[2rem] border border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all group relative overflow-hidden"
            >
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/5">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </div>
                <div>
                  <h4 className="font-black text-xl text-white tracking-tight group-hover:text-cyan-400 transition-colors">{song.title}</h4>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Headphones size={12} />
                    {song.artist}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="hidden sm:block px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                  {mood}
                </div>
                <div className="p-3 bg-white text-black rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <ExternalLink size={18} />
                </div>
              </div>
            </motion.a>
          ))
        ) : (
          <div className="p-12 text-center bg-black rounded-[3rem] border border-dashed border-white/10">
            <Music size={48} className="mx-auto text-slate-700 mb-4 opacity-20" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No protocols found for {mood} in {language}</p>
            <p className="text-slate-600 text-xs mt-2">Try adjusting your mood gauge or language selection.</p>
          </div>
        )}
      </div>
      
      <motion.a
        href="https://open.spotify.com"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="p-6 bg-white rounded-[2rem] text-black flex items-center justify-between shadow-[0_10px_30px_rgba(255,255,255,0.1)] group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-cyan-400 shadow-lg">
            <Headphones size={24} />
          </div>
          <div>
            <span className="block text-xs font-black uppercase tracking-widest opacity-60">External Stream</span>
            <span className="text-xl font-black uppercase tracking-tighter">Open Full Spotify Library</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <ExternalLink size={20} />
        </div>
      </motion.a>
    </div>
  );
};
