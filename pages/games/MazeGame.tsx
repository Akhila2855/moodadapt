
import React, { useState, useEffect, useCallback } from 'react';
import Leaderboard from '../../components/Leaderboard';
import { api } from '../../services/api';

const SIZE = 10;

const MazeGame: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]); 
  const [nodes, setNodes] = useState<{x: number, y: number}[]>([]);
  const [collectedNodes, setCollectedNodes] = useState<number>(0);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [goal, setGoal] = useState({ x: SIZE - 1, y: SIZE - 1 });
  const [steps, setSteps] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [level, setLevel] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const generateMaze = useCallback(() => {
    const newGrid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    const newNodes: {x: number, y: number}[] = [];
    
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if ((i === 0 && j === 0) || (i === SIZE - 1 && j === SIZE - 1)) continue;
        if (Math.random() > (0.8 - (level * 0.02))) newGrid[i][j] = 1;
      }
    }

    while (newNodes.length < 3) {
      const rx = Math.floor(Math.random() * SIZE);
      const ry = Math.floor(Math.random() * SIZE);
      if (newGrid[ry][rx] === 0 && !(rx === 0 && ry === 0) && !(rx === SIZE-1 && ry === SIZE-1)) {
        if (!newNodes.some(n => n.x === rx && n.y === ry)) newNodes.push({x: rx, y: ry});
      }
    }

    setGrid(newGrid);
    setNodes(newNodes);
    setCollectedNodes(0);
    setPlayer({ x: 0, y: 0 });
    setSteps(0);
    setTimer(0);
    setIsWon(false);
  }, [level]);

  useEffect(() => { generateMaze(); }, [generateMaze]);

  useEffect(() => {
    let interval: any;
    if (!isWon) interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  const movePlayer = (dx: number, dy: number) => {
    if (isWon) return;
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && grid[ny][nx] === 0) {
      setPlayer({ x: nx, y: ny });
      setSteps((s) => s + 1);
      const nodeIndex = nodes.findIndex(n => n.x === nx && n.y === ny);
      if (nodeIndex !== -1) {
        const nNodes = [...nodes];
        nNodes.splice(nodeIndex, 1);
        setNodes(nNodes);
        setCollectedNodes(prev => prev + 1);
      }
      if (nx === goal.x && ny === goal.y && nodes.length === 0) {
        handleWin();
      }
    }
  };

  const handleWin = async () => {
    setIsWon(true);
    const score = Math.max(0, 1000 - (timer * 2 + steps));
    await api.submitScore({
      game_type: 'maze',
      score,
      steps,
      time_taken: timer
    } as any);
    setRefreshTrigger(prev => prev + 1);
    // @ts-ignore
    confetti({ particleCount: 150, spread: 60, colors: ['#6366f1', '#a855f7'] });
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [player, isWon, nodes]);

  return (
    <div className="max-w-6xl mx-auto py-8 flex flex-col lg:flex-row gap-10">
      <div className="flex-grow bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-200 shadow-2xl relative overflow-hidden">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Neural Pulse</h2>
            <p className="text-slate-500 font-medium">Collect all data nodes before exiting.</p>
          </div>
          <div className="flex gap-3">
             <div className="px-5 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
               Level {level}
             </div>
             <button onClick={generateMaze} className="px-6 py-2 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all text-xs uppercase shadow-lg shadow-indigo-600/20">Restart</button>
          </div>
        </header>

        <div className="bg-slate-50 border border-slate-100 p-8 rounded-[3rem] mb-12 flex flex-col md:flex-row items-center gap-10">
           <div className="flex-grow space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Instructions</h4>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Use <b>Arrow Keys</b> or the <b>On-Screen Controls</b> to move your pulse. You must collect all 3 nodes to unlock the exit gate.
              </p>
           </div>
           <div className="flex gap-6 border-l border-slate-200 pl-10 h-full">
              <div className="flex flex-col items-center gap-1">
                 <div className="w-5 h-5 rounded-full bg-indigo-600 shadow-lg"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase">You</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <div className="w-4 h-4 rounded-full bg-amber-500 animate-bounce"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase">Node</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                 <div className="text-lg leading-none">🏁</div>
                 <span className="text-[9px] font-black text-slate-400 uppercase">Goal</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10 max-w-lg mx-auto">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">Nodes Found</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{collectedNodes}/3</span>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">Steps</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{steps}</span>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">Time</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{timer}s</span>
          </div>
        </div>

        <div className="aspect-square max-w-[400px] mx-auto bg-slate-100 rounded-[2.5rem] border-2 border-slate-200 p-4 shadow-inner overflow-hidden">
          <div className="grid grid-cols-10 gap-1.5 h-full w-full">
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`
                    rounded-lg transition-all duration-300 flex items-center justify-center
                    ${cell === 1 ? 'bg-slate-300 shadow-inner' : 'bg-white border border-slate-100'}
                  `}
                >
                  {player.x === x && player.y === y && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 shadow-xl scale-110"></div>
                  )}
                  {nodes.some(n => n.x === x && n.y === y) && (
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-bounce"></div>
                  )}
                  {goal.x === x && goal.y === y && (
                    <div className={`text-xl ${nodes.length === 0 ? 'opacity-100 drop-shadow-md animate-pulse' : 'opacity-10 grayscale'}`}>🏁</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manual Override Controls</span>
          <div className="grid grid-cols-3 gap-2">
            <div></div>
            <button onClick={() => movePlayer(0, -1)} className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-all text-2xl shadow-sm active:translate-y-1">↑</button>
            <div></div>
            <button onClick={() => movePlayer(-1, 0)} className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-all text-2xl shadow-sm active:translate-y-1">←</button>
            <button onClick={() => movePlayer(0, 1)} className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-all text-2xl shadow-sm active:translate-y-1">↓</button>
            <button onClick={() => movePlayer(1, 0)} className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-all text-2xl shadow-sm active:translate-y-1">→</button>
          </div>
        </div>

        {isWon && (
          <div className="mt-10 text-center space-y-4 animate-bounce">
             <p className="text-3xl font-black text-emerald-600 uppercase">Neural Path Cleared</p>
             <button onClick={() => { setLevel(l => l + 1); generateMaze(); }} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl transition-all uppercase text-xs">Proceed to Level {level + 1}</button>
          </div>
        )}
      </div>

      <aside className="w-full lg:w-80">
        <Leaderboard gameType="maze" refreshTrigger={refreshTrigger} />
      </aside>
    </div>
  );
};

export default MazeGame;
