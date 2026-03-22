import React, { useState } from 'react';
import { Clock, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ActivityList = ({ activities, completedActivityIds, onComplete }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  return (
    <div className="w-full">
      <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
        <Zap size={20} className="text-cyan-400" />
        Recommended Protocols
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <motion.div 
            key={activity.id}
            whileHover={{ y: -4 }}
            className="bg-black p-6 rounded-[2rem] shadow-sm border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => setSelectedActivity(activity)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex flex-col">
                <h4 className="font-black text-lg text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{activity.name}</h4>
                {completedActivityIds.has(activity.id) && (
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                    <CheckCircle2 size={12} />
                    Completed
                  </span>
                )}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                activity.energy === 'Low' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                activity.energy === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                'bg-white/10 text-white border-white/20'
              }`}>
                {activity.energy} Energy
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6 line-clamp-2 font-medium relative z-10">{activity.description}</p>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest relative z-10">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-cyan-400" />
                <span>{activity.duration}m</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-cyan-400" />
                <span>{activity.moodTags[0]}</span>
              </div>
              <div className="ml-auto text-cyan-400 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <span>Initiate</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-black rounded-full uppercase tracking-widest">Protocol</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{selectedActivity.name}</h2>
                    <p className="text-slate-400 font-medium leading-relaxed">{selectedActivity.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedActivity(null)}
                    className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-full"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6 mb-10">
                  {selectedActivity.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-5 items-start">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm font-black shrink-0 mt-0.5 border border-cyan-500/20">
                        {idx + 1}
                      </div>
                      <p className="text-slate-300 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    onComplete(selectedActivity.id);
                    setSelectedActivity(null);
                  }}
                  disabled={completedActivityIds.has(selectedActivity.id)}
                  className={`w-full py-5 font-black text-lg rounded-2xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                    completedActivityIds.has(selectedActivity.id)
                      ? 'bg-cyan-500/20 text-cyan-400 cursor-not-allowed border border-cyan-500/30'
                      : 'bg-white hover:bg-slate-100 text-black'
                  }`}
                >
                  <CheckCircle2 size={24} />
                  {completedActivityIds.has(selectedActivity.id) ? 'PROTOCOL COMPLETED' : 'COMPLETE PROTOCOL'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
