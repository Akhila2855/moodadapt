
import React, { useState, useEffect, useCallback } from 'react';

const PuzzleGame: React.FC = () => {
  const [gridSize, setGridSize] = useState(3);
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800');

  const isSolvable = (arr: number[], size: number) => {
    let inversions = 0;
    const flat = arr.filter(x => x !== 0);
    for (let i = 0; i < flat.length; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        if (flat[i] > flat[j]) inversions++;
      }
    }
    if (size % 2 !== 0) return inversions % 2 === 0;
    const emptyRowFromBottom = size - Math.floor(arr.indexOf(0) / size);
    return (inversions + emptyRowFromBottom) % 2 !== 0;
  };

  const shuffle = useCallback(() => {
    let newTiles;
    const total = gridSize * gridSize;
    do {
      newTiles = Array.from({ length: total }, (_, i) => (i + 1) % total);
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
    } while (!isSolvable(newTiles, gridSize) || checkWin(newTiles));

    setTiles(newTiles);
    setMoves(0);
    setTimer(0);
    setIsWon(false);
    setIsActive(true);
  }, [gridSize]);

  useEffect(() => {
    shuffle();
  }, [shuffle]);

  useEffect(() => {
    let interval: any;
    if (isActive && !isWon) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon]);

  const checkWin = (arr: number[]) => {
    if (arr.length === 0) return false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[arr.length - 1] === 0;
  };

  const handleTileClick = (index: number) => {
    if (isWon) return;
    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
      if (checkWin(newTiles)) {
        setIsWon(true);
        setIsActive(false);
        // @ts-ignore
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const getCorrectTilesCount = () => {
    let count = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === i + 1) count++;
    }
    return count;
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-2xl">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Zen Jigsaw</h2>
            <p className="text-slate-500 font-medium">Reconstruct the image by sliding tiles into the empty slot.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setGridSize(gridSize === 3 ? 4 : 3)} className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold uppercase hover:bg-slate-200 transition-all">
              Mode: {gridSize}x{gridSize}
            </button>
            <button onClick={shuffle} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 uppercase text-xs">Reset Game</button>
          </div>
        </header>

        {/* Instructions & Thumbnail Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="md:col-span-3 bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
            <h3 className="text-sm font-black text-indigo-700 uppercase tracking-widest mb-2">How to Play</h3>
            <ul className="text-indigo-900/70 text-xs space-y-1 font-medium list-disc ml-4">
              <li>Click a tile <b>next to the empty slot</b> to slide it into that space.</li>
              <li>Match all tiles to their original positions as shown in the preview.</li>
              <li>The bottom-right slot must be empty to win.</li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50 border border-slate-200 rounded-3xl">
             <span className="text-[8px] font-black text-slate-400 uppercase mb-2">Target Preview</span>
             <img src={imageUrl} className="w-20 h-20 rounded-xl shadow-md border-2 border-white" alt="Target" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">Moves</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{moves}</span>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
            <span className="block text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">Progress</span>
            <span className="text-2xl font-bold text-slate-800 font-mono">{Math.round((getCorrectTilesCount() / (gridSize*gridSize-1)) * 100)}%</span>
          </div>
          <button 
            onMouseDown={() => setShowHint(true)} 
            onMouseUp={() => setShowHint(false)}
            onMouseLeave={() => setShowHint(false)}
            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center hover:bg-slate-100 transition-all cursor-help group"
          >
            <span className="block text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">Hold to See</span>
            <span className="text-2xl font-bold text-slate-800">👁️</span>
          </button>
        </div>

        <div className="relative aspect-square w-full max-w-[420px] mx-auto">
          <div 
            className={`grid gap-2 p-3 bg-slate-200 rounded-[2rem] border border-slate-300 transition-opacity duration-300 ${showHint ? 'opacity-10' : 'opacity-100'}`}
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {tiles.map((tile, idx) => (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                className={`
                  relative aspect-square rounded-xl overflow-hidden transition-all duration-300
                  ${tile === 0 ? 'bg-slate-300/50 shadow-inner' : 'hover:scale-[0.98] active:scale-95 shadow-md bg-white border border-white'}
                `}
                style={tile !== 0 ? {
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${gridSize * 100}%`,
                  backgroundPosition: `${((tile - 1) % gridSize) * (100 / (gridSize - 1))}% ${Math.floor((tile - 1) / gridSize) * (100 / (gridSize - 1))}%`
                } : {}}
              >
              </button>
            ))}
          </div>
          {showHint && (
            <div className="absolute inset-0 p-3 pointer-events-none">
              <div className="w-full h-full rounded-[1.8rem] bg-cover bg-center border-4 border-white shadow-xl" style={{ backgroundImage: `url(${imageUrl})` }}></div>
            </div>
          )}
        </div>

        {isWon && (
          <div className="mt-10 text-center animate-bounce">
            <p className="text-3xl font-black text-emerald-600 uppercase">Puzzle Solved!</p>
            <p className="text-slate-500 font-medium">Your cognitive alignment is optimized.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleGame;
