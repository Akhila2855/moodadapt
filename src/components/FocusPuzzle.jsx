import React, { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';

export const FocusPuzzle = () => {
  const [items, setItems] = useState(['Alpha', 'Beta', 'Gamma', 'Delta']);
  const [targetOrder, setTargetOrder] = useState([]);
  const [isWon, setIsWon] = useState(false);

  const NODE_COLORS = {
    'Alpha': '#083344',
    'Beta': '#164e63',
    'Gamma': '#0e7490',
    'Delta': '#06b6d4',
  };

  useEffect(() => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setTargetOrder(shuffled);
  }, []);

  useEffect(() => {
    if (items.join(',') === targetOrder.join(',')) {
      setIsWon(true);
    } else {
      setIsWon(false);
    }
  }, [items, targetOrder]);

  const reset = () => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setTargetOrder(shuffled);
    setItems([...items].sort(() => Math.random() - 0.5));
    setIsWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-10 bg-black rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
      
      <div className="text-center">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Neural Alignment</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Synchronize node sequence to target signature</p>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 w-full">
        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4 text-center opacity-60">Target Signature</div>
        <div className="flex justify-center gap-3">
          {targetOrder.map((node) => (
            <div 
              key={node} 
              className="w-10 h-10 rounded-xl shadow-inner flex items-center justify-center text-[10px] font-black text-white border border-white/10" 
              style={{ backgroundColor: NODE_COLORS[node] }}
            >
              {node[0]}
            </div>
          ))}
        </div>
      </div>

      <Reorder.Group axis="x" values={items} onReorder={setItems} className="flex gap-4">
        {items.map((item) => (
          <Reorder.Item key={item} value={item} className="cursor-grab active:cursor-grabbing">
            <motion.div 
              className="w-20 h-20 rounded-2xl shadow-xl flex items-center justify-center text-white font-black text-xs uppercase border-2 border-white/10"
              style={{ backgroundColor: NODE_COLORS[item] }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${NODE_COLORS[item]}44` }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <AnimatePresence>
        {isWon && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-cyan-400 font-black uppercase tracking-[0.2em] text-sm flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            Signature Matched
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={reset}
        className="px-8 py-3 bg-white/5 hover:bg-cyan-500 text-slate-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-white/5 hover:border-cyan-500"
      >
        Re-Shuffle Sequence
      </button>
    </div>
  );
};
