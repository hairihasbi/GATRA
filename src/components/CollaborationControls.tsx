import React, { useState } from 'react';
import { Users, LogOut, Copy, Check, Radiation as Radio, Play } from 'lucide-react';
import { useCollab } from './CollaborationContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const CollaborationControls: React.FC<{ currentParams: any, activeScene: string }> = ({ currentParams, activeScene }) => {
  const { sessionId, role, isCollabActive, roomCode, createSession, joinSession, leaveSession, participants } = useCollab();
  const [joinCode, setJoinCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await createSession({ params: currentParams, sceneId: activeScene });
    } catch (err: any) {
      setError("Gagal membuat sesi. Pastikan Anonymous Auth aktif.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        await joinSession(joinCode.trim());
      } catch (err: any) {
        setError("Gagal masuk. Kode salah atau masalah jaringan.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {!isCollabActive ? (
        <div className="flex flex-col items-end gap-3">
          {showInvite ? (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64"
            >
              <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" /> Mode Kolaborasi
              </h4>
              <p className="text-[10px] text-white/60 mb-4">Belajar bersama secara real-time. Bagikan layar Anda (Host) atau tonton (Siswa).</p>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 p-2 rounded-lg mb-4 text-[9px] text-red-200 font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={handleCreate}
                  disabled={isLoading}
                  className={cn(
                    "w-full bg-amber-500 hover:bg-amber-600 text-black font-black text-xs py-2 rounded-xl transition-all uppercase flex items-center justify-center gap-2",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLoading ? 'Menghubungkan...' : 'Mulai Sebagai Host'}
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                  <div className="relative flex justify-center text-[8px] uppercase font-bold text-white/30 tracking-widest"><span className="bg-slate-900 px-2 italic text-white/40">Atau Jadi Siswa</span></div>
                </div>

                <form onSubmit={handleJoin} className="flex gap-1">
                  <input 
                    type="text" 
                    placeholder="Kode Room"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                  <button 
                    type="submit"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </form>
              </div>
              <button 
                onClick={() => setShowInvite(false)}
                className="w-full mt-4 text-[9px] font-bold text-white/30 hover:text-white/60 transition-all uppercase"
              >
                Tutup
              </button>
            </motion.div>
          ) : (
            <button 
              onClick={() => setShowInvite(true)}
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-xl hover:scale-110 transition-all group"
            >
              <Users className="w-6 h-6 text-white group-hover:text-amber-500" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-end gap-3">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-48"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Kolab Aktif</span>
              </div>
              <button onClick={leaveSession} className="text-red-400 hover:text-red-300">
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[8px] font-bold text-white/40 uppercase mb-1">Kode Akses</p>
                <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-xs font-mono font-bold text-amber-500">{roomCode?.slice(0, 8)}...</span>
                  <button onClick={copyCode} className="text-white/40 hover:text-white">
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[8px] font-bold text-white/40 uppercase mb-2">Peserta ({participants.length})</p>
                <div className="flex flex-wrap gap-1">
                  {participants.map((p, idx) => (
                    <div 
                      key={idx} 
                      title={p.name}
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                        p.role === 'host' ? "bg-amber-500 border-amber-400 text-black" : "bg-white/10 border-white/10 text-white"
                      )}
                    >
                      {p.name[0]}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <p className={cn(
                  "text-[9px] font-black text-center uppercase tracking-tighter italic",
                  role === 'host' ? "text-amber-500" : "text-emerald-400"
                )}>
                  {role === 'host' ? "Kamu Adalah Host (Penyaji)" : "Mode Menonton (Siswa)"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
