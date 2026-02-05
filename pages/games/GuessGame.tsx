
import React, { useState, useEffect } from 'react';

const GuessGame: React.FC = () => {
  const MAX_ATTEMPTS = 7;
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState<number | string>('');
  const [history, setHistory] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "SCANNER STANDBY", color: "text-slate-500" });

  const initGame = () => {
    setTarget(Math.floor(Math.random() * 50) + 1);
    setHistory([]);
    setGuess('');
    setIsGameOver(false);
    setIsWon(false);
    setFeedback({ msg: "SCANNER STANDBY", color: "text-slate-500" });
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const num = typeof guess === 'string' ? parseInt(guess) : guess;

    if (isNaN(num) || num < 1 || num > 50) return;
    if (history.includes(num)) return;

    const newHistory = [...history, num];
    setHistory(newHistory);
    
    const diff = Math.abs(num - target);
    
    if (num === target) {
      setFeedback({ msg: "SIGNAL DETECTED!", color: "text-cyan-400" });
      setIsWon(true);
      setIsGameOver(true);
      // @ts-ignore
      confetti({ particleCount: 200, spread: 100, colors: ['#00f5ff', '#ffffff'], origin: { y: 0.7 } });
    } else {
      if (diff <= 3) setFeedback({ msg: "PROXIMITY: CRITICAL", color: "text-red-500" });
      else if (diff <= 10) setFeedback({ msg: "PROXIMITY: HIGH", color: "text-orange-400" });
      else if (diff <= 20) setFeedback({ msg: "PROXIMITY: LOW", color: "text-blue-400" });
      else setFeedback({ msg: "NO SIGNAL DETECTED", color: "text-slate-600" });
      
      if (newHistory.length >= MAX_ATTEMPTS) setIsGameOver(true);
    }
    setGuess('');
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="glass rounded-[3.5rem] p-12 md:p-16 border-cyan-500/20 relative overflow-hidden bg-black/60">
        <header className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Signal Tuner</h2>
            <p className="text-cyan-500/60 font-bold text-xs uppercase tracking-widest">Neural Frequency Isolation</p>
          </div>
          <button onClick={initGame} className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-all shadow-lg shadow-cyan-500/5">↺</button>
        </header>

        <div className="bg-black/80 border border-cyan-500/20 p-10 rounded-[2.5rem] mb-16 text-center shadow-inner">
           <div className={`text-4xl font-black mb-8 tracking-tighter ${feedback.color} transition-all duration-300`}>
            {isWon ? "FREQUENCY LOCKED" : (isGameOver ? `SHUTDOWN. VALUE: ${target}` : feedback.msg)}
          </div>
          
          <div className="flex justify-center gap-3">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  i < history.length 
                  ? (history[i] === target ? 'w-16 bg-cyan-400 shadow-[0_0_15px_rgba(0,245,255,1)]' : 'w-10 bg-slate-700') 
                  : 'w-4 bg-slate-900 border border-white/5'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <form onSubmit={handleGuess} className="relative max-w-sm mx-auto mb-16">
          <div className="absolute -inset-4 bg-cyan-500/10 blur-xl rounded-full"></div>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={isGameOver}
            className="relative w-full bg-black/80 border-2 border-white/5 rounded-[3rem] p-12 text-8xl font-black text-center text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-900 appearance-none shadow-2xl"
            placeholder="00"
            min="1"
            max="50"
            autoFocus
          />
          <button
            type="submit"
            disabled={isGameOver || !guess}
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-28 h-28 btn-classic rounded-full flex flex-col items-center justify-center shadow-2xl disabled:opacity-0"
          >
            <span className="text-[10px] uppercase tracking-widest">TUNE</span>
          </button>
        </form>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] pl-2 border-l border-cyan-500">Log Archive</h3>
          <div className="flex flex-wrap gap-4">
            {history.map((h, i) => {
               const isCorrect = h === target;
               const isLow = h < target;
               return (
                 <div
                   key={i}
                   className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-xl font-black border transition-all ${
                     isCorrect ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/5 text-slate-500'
                   }`}
                 >
                   <span>{h.toString().padStart(2, '0')}</span>
                   {!isCorrect && (
                     <span className={isLow ? 'text-cyan-600' : 'text-red-900 opacity-50'}>
                       {isLow ? '↑' : '↓'}
                     </span>
                   )}
                 </div>
               );
            })}
            {history.length === 0 && <div className="text-slate-800 font-black uppercase tracking-widest text-[10px] py-4">Waiting for neural input...</div>}
          </div>
        </div>
      </div>
      <style>{`input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }`}</style>
    </div>
  );
};

export default GuessGame;