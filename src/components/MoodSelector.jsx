import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Smile, Sliders, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { emotionClassifier } from '../services/emotionModel';

const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Spanish', 'French', 'Japanese', 'Korean'];

const MOOD_EMOJIS = {
  1: '😫', 2: '😢', 3: '😰', 4: '😴', 5: '😐', 6: '😌', 7: '😊', 8: '😁', 9: '🔥', 10: '🤩'
};

const MOOD_NAMES = {
  1: 'Stressed', 2: 'Sad', 3: 'Anxious', 4: 'Tired', 5: 'Calm', 6: 'Calm', 7: 'Happy', 8: 'Happy', 9: 'Energetic', 10: 'Energetic'
};

export const MoodSelector = ({ onMoodDetected, initialLanguage = 'English' }) => {
  const [method, setMethod] = useState('slider');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const videoRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please use the slider.');
      setMethod('slider');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const [lastResult, setLastResult] = useState(null);

  const captureEmotion = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;
    setIsProcessing(true);
    setIsCapturing(true);
    
    // Give user 1000ms to strike a pose after clicking
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsCapturing(false);
    
    const result = await emotionClassifier.classify(videoRef.current);
    setLastResult(result);
    
    if (result.confidence >= 0.5) {
      onMoodDetected(result.emotion, Math.round(result.confidence * 10), selectedLanguage);
      setIsProcessing(false);
      stopCamera();
    } else {
      setIsProcessing(false);
      // Don't stop camera, let them try again
    }
  };

  const handleGenerate = () => {
    if (method === 'slider') {
      onMoodDetected(MOOD_NAMES[sliderValue], sliderValue, selectedLanguage);
    } else {
      captureEmotion();
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Language Selection */}
      <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <Globe size={20} />
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Choose Your Language</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`py-3 px-4 rounded-2xl text-sm font-semibold transition-all border-2 ${
                selectedLanguage === lang 
                  ? 'bg-white border-white text-black shadow-md scale-[1.02]' 
                  : 'bg-black border-white/5 text-slate-500 hover:border-cyan-500/50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </section>

      {/* Mood Selection */}
      <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-white/5 relative overflow-hidden">
        <div className="flex justify-center gap-4 mb-10">
          <button 
            onClick={() => { setMethod('slider'); stopCamera(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${method === 'slider' ? 'bg-white text-black shadow-xl' : 'bg-black text-slate-500 border border-white/5'}`}
          >
            <Sliders size={18} />
            <span>How do you feel?</span>
          </button>
          <button 
            onClick={() => { setMethod('camera'); startCamera(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${method === 'camera' ? 'bg-white text-black shadow-xl' : 'bg-black text-slate-500 border border-white/5'}`}
          >
            <Camera size={18} />
            <span>Use Camera</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {method === 'camera' ? (
            <motion.div 
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden mb-8 border-8 border-white/5 shadow-inner">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover brightness-[1.2] contrast-[1.1]" 
                />
                
                {/* Face Alignment Guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-80 border-2 border-dashed border-cyan-500/30 rounded-[4rem] flex items-center justify-center">
                    <div className="text-cyan-500/20 text-[10px] font-black uppercase tracking-widest">
                      Center your face here
                    </div>
                  </div>
                </div>

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-md">
                    {isCapturing ? (
                      <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">📸</div>
                        <p className="text-white font-black uppercase tracking-[0.3em] text-2xl">
                          Understanding you...
                        </p>
                        <p className="text-cyan-400 text-[10px] mt-2 font-bold">
                          HOLD STILL FOR A MOMENT
                        </p>
                      </div>
                    ) : (
                      <>
                        <RefreshCw className="text-cyan-400 animate-spin mb-4" size={48} />
                        <p className="text-white font-black uppercase tracking-[0.2em] text-xs animate-pulse">
                          Finding the right mood for you...
                        </p>
                        <p className="text-cyan-400/60 font-medium text-[10px] mt-2">
                          ALMOST THERE
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* Facial Point Markers (Simulated Engine) */}
                {!isProcessing && isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Eyebrow Vectors */}
                    <div className="absolute top-[35%] left-[30%] w-12 h-[2px] bg-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.4)] animate-pulse" />
                    <div className="absolute top-[35%] right-[30%] w-12 h-[2px] bg-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.4)] animate-pulse" />
                    
                    {/* Eye Tracking */}
                    <div className="absolute top-[42%] left-[35%] w-4 h-4 border border-cyan-500/60 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                    </div>
                    <div className="absolute top-[42%] right-[35%] w-4 h-4 border border-cyan-500/60 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                    </div>

                    {/* Mouth Mesh */}
                    <div className="absolute bottom-[35%] left-1/2 -translate-x-1/2 w-20 h-8 border-b-2 border-x-2 border-cyan-500/30 rounded-b-3xl" />
                    
                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-[1px] bg-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    />
                  </div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 bg-cyan-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                  LOOKING...
                </div>
              </div>

              {/* Lighting Tips */}
              <div className="grid grid-cols-2 gap-4 w-full mb-4">
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Good Frontal Light</span>
                </div>
                <div className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hold Still</span>
                </div>
              </div>

              {lastResult && lastResult.confidence < 0.5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center mb-4"
                >
                  <p className="text-red-400 text-xs font-bold uppercase tracking-tight">
                    UNCERTAIN DETECTION ({Math.round(lastResult.confidence * 100)}%)
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1 mb-3">
                    Try moving closer to the light or striking a clearer pose.
                  </p>
                  <button
                    onClick={() => {
                      onMoodDetected(lastResult.emotion, Math.round(lastResult.confidence * 10), selectedLanguage);
                      stopCamera();
                    }}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                  >
                    Use Anyway
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="slider"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center py-4"
            >
              <motion.div 
                key={sliderValue}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl mb-10 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                {MOOD_EMOJIS[sliderValue]}
              </motion.div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-4 bg-black rounded-full appearance-none cursor-pointer accent-cyan-500 mb-8 border border-white/5"
              />
              <div className="flex justify-between w-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>Not so great</span>
                <span>Feeling okay</span>
                <span>Wonderful</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full mt-8 py-5 bg-white hover:bg-slate-100 disabled:bg-slate-800 text-black font-black text-lg rounded-3xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
        >
          <span>LET'S GET STARTED</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </div>
  );
};
