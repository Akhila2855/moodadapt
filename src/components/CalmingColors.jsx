import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Sun } from 'lucide-react';

const AFFIRMATIONS = [
  "You are amazing!",
  "Keep shining!",
  "Pure Joy!",
  "Radiate Positivity!",
  "You've got this!",
  "Spread the Light!",
  "Happiness looks good on you!",
  "Sparkle on!"
];

export const CalmingColors = () => {
  const canvasRef = useRef(null);
  const [hue, setHue] = useState(45);
  const [joyScore, setJoyScore] = useState(0);
  const [affirmation, setAffirmation] = useState("");
  const [showAffirmation, setShowAffirmation] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const particles = [];

    class Particle {
      constructor(x, y, h, isBurst = false) {
        this.x = x;
        this.y = y;
        this.size = isBurst ? Math.random() * 15 + 10 : Math.random() * 10 + 5;
        this.speedX = (Math.random() * 6 - 3) * (isBurst ? 2 : 1);
        this.speedY = (Math.random() * 6 - 3) * (isBurst ? 2 : 1);
        this.maxLife = isBurst ? 100 : 50;
        this.life = this.maxLife;
        // Vibrant happy colors
        this.color = `hsla(${h + Math.random() * 60 - 30}, 100%, 65%, 0.8)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        if (this.size > 0.1) this.size -= 0.1;
      }

      draw() {
        if (!ctx) return;
        const opacity = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        // Draw star-like shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(
            this.x + this.size * Math.cos((i * 4 * Math.PI) / 5),
            this.y + this.size * Math.sin((i * 4 * Math.PI) / 5)
          );
        }
        ctx.closePath();
        ctx.fill();
        
        // Bright center
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createParticles = (x, y, count, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, hue, isBurst));
      }
      setJoyScore(prev => Math.min(100, prev + (isBurst ? 5 : 0.5)));
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createParticles(x, y, 2);
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createParticles(x, y, 20, true);
      
      // Trigger affirmation
      const randomAff = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
      setAffirmation(randomAff);
      setShowAffirmation(true);
      setTimeout(() => setShowAffirmation(false), 2000);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0 || particles[i].size <= 0.1) {
          particles.splice(i, 1);
          i--;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [hue]);

  return (
    <div className="flex flex-col items-center gap-8 p-10 bg-black rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ background: `radial-gradient(circle at 50% 50%, hsla(${hue}, 100%, 50%, 0.3) 0%, transparent 70%)` }}
      />
      
      <div className="text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sun className="text-yellow-400 animate-spin-slow" size={24} />
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Joy Bloom</h3>
          <Sun className="text-yellow-400 animate-spin-slow" size={24} />
        </div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Click to burst joy • Trace to grow happiness</p>
      </div>

      <div className="relative p-4 bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-inner z-10">
        <canvas 
          ref={canvasRef} 
          width={450} 
          height={350} 
          className="rounded-[2rem] cursor-pointer bg-[#050505]" 
        />
        
        <AnimatePresence>
          {showAffirmation && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <span className="px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl whitespace-nowrap">
                {affirmation}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md space-y-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className={`text-rose-500 ${joyScore > 0 ? 'animate-pulse' : ''}`} size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Happiness Meter</span>
          </div>
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{Math.round(joyScore)}%</span>
        </div>
        <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 p-0.5">
          <motion.div 
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-rose-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${joyScore}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-6 w-full max-w-sm z-10">
        <Sparkles className="text-yellow-400" size={16} />
        <input 
          type="range" 
          min="0" 
          max="360" 
          value={hue} 
          onChange={(e) => setHue(parseInt(e.target.value))}
          className="flex-1 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-yellow-400 border border-white/5"
        />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Color Joy</span>
      </div>
    </div>
  );
};
