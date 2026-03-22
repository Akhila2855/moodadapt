import React, { useEffect, useRef } from 'react';

export const BreathingBubble = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let startTime = Date.now();

    const render = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      
      // 8 second cycle: 4s inhale, 4s exhale
      const cycle = 8;
      const progress = (elapsed % cycle) / cycle;
      
      // Radius oscillates between 50 and 150
      const radius = 50 + 100 * (0.5 - 0.5 * Math.cos(2 * Math.PI * progress));
      const isInhaling = progress < 0.5;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glow effect
      const glowGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, radius * 1.5
      );
      glowGradient.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
      glowGradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bubble
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, radius
      );
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)');

      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Times New Roman"';
      ctx.textAlign = 'center';
      ctx.fillText(isInhaling ? 'BREATHE IN' : 'BREATHE OUT', canvas.width / 2, canvas.height / 2 + 8);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black rounded-[3rem] border border-white/5 shadow-2xl">
      <h3 className="text-xl font-black text-white uppercase tracking-tighter">Respiration Protocol</h3>
      <div className="relative p-4 bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-inner">
        <canvas ref={canvasRef} width={400} height={400} className="rounded-[2rem] bg-black" />
        <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-900 rounded-[2.5rem]" />
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Synchronize neural rhythm with visual pulse</p>
    </div>
  );
};
