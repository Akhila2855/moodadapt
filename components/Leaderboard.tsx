
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

interface LeaderboardProps {
  gameType: string;
  refreshTrigger?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ gameType, refreshTrigger }) => {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const data = await api.getLeaderboard(gameType);
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, [gameType, refreshTrigger]);

  if (loading) return <div className="text-cyan-500/40 text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Leaderboard...</div>;

  return (
    <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8">
      <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-6">Sector Rankings</h3>
      <div className="space-y-4">
        {scores.length === 0 ? (
          <p className="text-[10px] text-slate-600 italic uppercase tracking-widest">No pulse records found.</p>
        ) : (
          scores.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 w-6 h-6 flex items-center justify-center rounded-lg border border-cyan-400/20">{i + 1}</span>
                <span className="text-sm font-bold text-white uppercase tracking-tighter">{s.username}</span>
              </div>
              <div className="text-right">
                <span className="block text-sm font-black text-cyan-400">{s.score} <span className="text-[8px] opacity-40">PTS</span></span>
                <span className="block text-[8px] text-slate-600 font-bold uppercase">{s.time_taken}s</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;