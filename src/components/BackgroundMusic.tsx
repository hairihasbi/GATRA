import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // URL Musik Latar (Royalty Free - Piano/Study Lofi)
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume ke 30% agar tidak terlalu keras
      audioRef.current.loop = true;
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-[11px] right-48 sm:right-72 z-[100]">
      <audio ref={audioRef} src={musicUrl} />
      <button 
        onClick={togglePlay}
        className="bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 p-2 sm:px-3 rounded-xl shadow-lg hover:bg-emerald-800/60 transition-all group flex items-center gap-2"
        title={isPlaying ? "Matikan Musik" : "Nyalakan Musik"}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="muted"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <VolumeX className="w-4 h-4 text-emerald-100/60" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <span className="hidden sm:block text-[9px] font-black uppercase text-emerald-100 tracking-tight">Musik</span>

        {isPlaying && (
          <div className="flex gap-0.5 items-end h-2.5 px-0.5">
            <div className="w-0.5 bg-amber-400 animate-music-bar-1 rounded-full" />
            <div className="w-0.5 bg-amber-400 animate-music-bar-2 rounded-full" />
            <div className="w-0.5 bg-amber-400 animate-music-bar-3 rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
};
