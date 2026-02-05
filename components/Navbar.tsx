
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Activities', path: '/activities' },
    { name: 'Games', path: '/games' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-cyan-500/10 py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* SVG Heartbeat Logo mimicking the provided image */}
            <svg viewBox="0 0 100 40" className="w-full h-full text-cyan-400 filter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              <path 
                d="M0 20 H35 L40 10 L45 30 L50 0 L55 40 L60 20 H100" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="pulse-path"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest text-white uppercase group-hover:text-cyan-400 transition-colors">
              MoodAdapt
            </span>
            <span className="text-[8px] font-bold text-cyan-500/60 uppercase tracking-[0.4em] -mt-1">
              NEUROBEAT
            </span>
          </div>
        </Link>
        <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                location.pathname === link.path 
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .pulse-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw 3s linear infinite;
        }
        @keyframes draw {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;