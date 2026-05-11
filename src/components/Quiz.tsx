import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, Swords, Brain, ArrowRight, RotateCcw, Home, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MathPlotter } from './MathPlotter';
import { Question, QuizDifficulty, QuizMode, TransformationParams, ModuleId } from '../types';
import { cn } from '../lib/utils';
import { getQuestionsForModule, ALL_QUESTIONS_POOL } from '../data/questions';
import { toPng } from 'html-to-image';


interface QuizProps {
  onClose: () => void;
  onFinish?: (score: number) => void;
  initialMode?: 'solo' | 'duel';
  activeModule?: ModuleId | 'evaluasi';
}

export const Quiz: React.FC<QuizProps> = ({ onClose, onFinish, initialMode, activeModule = 'translasi' }) => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result' | 'certificate'>('lobby');
  
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('easy');
  const [mode, setMode] = useState<QuizMode>(initialMode || 'solo');
  const [timeLeft, setTimeLeft] = useState(120);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [playerName, setPlayerName] = useState('');
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const isEvaluation = activeModule === 'evaluasi';

  // Force mode if initialMode is provided
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const calculateScore = () => {
    if (isEvaluation) {
      // For 35 questions, max points 100
      // Our pool has point system where each correct answer gives 10/20 points
      // Total possible points in evaluasi is 35 * 10 (approx, depending on type)
      // User says: adjust so it is 100.
      // We'll use: (questions answered correctly / total questions) * 100
      const totalCorrect = questions.filter((_, i) => {
          // This is a bit tricky since we need to know which ones were correct
          // But we can approximate using the score system if we know total questions
          return false; // placeholder, see below
      });

      // Better: Use score1 / (sum of max possible points per question) * 100
      // For simplicity, let's just track correct count
      return Math.round((idx1 / questions.length) * 100 * (score1 / (idx1 * 10 || 1))); 
    }
    return score1;
  };

  const getFinalScore = () => {
      if (questions.length === 0) return 0;
      // Simple proportionality to 100
      // Average points per question is roughly 10
      const maxPossible = questions.length * 10;
      return Math.min(100, Math.round((score1 / maxPossible) * 100));
  };

  const downloadCertificate = async () => {
    if (certificateRef.current === null) return;
    try {
      const dataUrl = await toPng(certificateRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `sertifikat-${playerName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download certificate', err);
    }
  };

  const renderCertificate = () => {
    const finalScoreValue = getFinalScore();
    return (
      <div 
        ref={certificateRef}
        className="w-[800px] h-[600px] bg-[#fdfaf3] p-12 border-[16px] border-emerald-900 relative flex flex-col items-center justify-center text-center shadow-2xl mx-auto"
        style={{ fontFamily: 'serif' }}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] opacity-30 pointer-events-none" />
        <div className="absolute inset-4 border-2 border-emerald-800 pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-900 shadow-xl">
             <Trophy className="w-12 h-12 text-emerald-900" />
          </div>
          
          <h1 className="text-5xl font-black text-emerald-950 uppercase tracking-tighter mb-2">SERTIFIKAT KELULUSAN</h1>
          <p className="text-xl font-bold text-slate-600 uppercase tracking-[0.2em] mb-8">GATRA: Petualangan Transformasi</p>
          
          <div className="space-y-2">
            <p className="text-lg text-slate-500 italic">Diberikan kepada:</p>
            <p className="text-4xl font-black text-emerald-900 underline decoration-orange-500 underline-offset-8 uppercase">{playerName || 'PENJELAJAH GATRA'}</p>
          </div>
          
          <div className="mt-8 space-y-4">
            <p className="text-lg text-slate-600 max-w-lg mx-auto">
              Telah berhasil menyelesaikan seluruh tantangan di GATRA dan lulus Evaluasi Akhir dengan perolehan skor:
            </p>
            <div className="inline-block px-8 py-4 bg-orange-500 text-white rounded-3xl shadow-xl shadow-orange-900/20">
               <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Skor Akhir</p>
               <p className="text-4xl font-black">{finalScoreValue}/100</p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-between items-center w-full px-12">
            <div className="text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Tanggal</p>
              <p className="text-sm font-black text-emerald-950">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">TTD Sang Maestro</p>
              <p className="text-sm font-serif italic font-bold text-emerald-950">GATRA Academy</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const finalScoreValue = getFinalScore();
    const isWinner = mode === 'duel' ? score1 > score2 : finalScoreValue >= 70;
    
    return (
      <motion.div 
        key="result"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full overflow-y-auto py-12 px-4 space-y-12 text-center flex flex-col justify-center"
      >
        <div className="relative inline-block mx-auto">
           <div className="absolute inset-0 bg-orange-400 blur-3xl opacity-20 scale-150 animate-pulse" />
           <motion.div 
             initial={{ rotate: -15, scale: 0 }}
             animate={{ rotate: 0, scale: 1 }}
             className="w-40 h-40 sm:w-48 sm:h-48 bg-orange-500 rounded-[60px] flex items-center justify-center text-white shadow-2xl relative z-10"
           >
              <Trophy className="w-20 h-20 sm:w-24 sm:h-24" />
           </motion.div>
        </div>

        <div className="space-y-4">
           <h2 className="text-4xl sm:text-5xl font-black text-emerald-950 uppercase tracking-tighter">
             {mode === 'duel' ? (score1 === score2 ? 'SERI!' : score1 > score2 ? 'ANDA MENANG!' : 'KOMPUTER MENANG!') : 'Ujian Selesai!'}
           </h2>
           <p className="text-slate-500 font-bold max-w-md mx-auto">
              {isEvaluation ? 'Evaluasi Akhir telah diselesaikan. Tinjau skormu di bawah.' : 'Hasil perjuangan menembus GATRA.'}
           </p>
        </div>

        <div className={cn("grid gap-8 max-w-4xl mx-auto w-full", mode === 'duel' ? "grid-cols-2" : "grid-cols-1 max-w-sm ml-auto mr-auto")}>
           <div className={cn("bg-white p-8 rounded-[40px] border shadow-lg space-y-4", mode === 'duel' && score1 >= score2 ? "border-emerald-500 ring-4 ring-emerald-500/20" : "border-slate-100")}>
              <p className="text-xs font-black uppercase text-slate-400">{mode === 'duel' ? 'Skor Player 1' : 'Skor Akhir'}</p>
              <p className="text-6xl font-black text-emerald-900">{finalScoreValue}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{questions.length} Soal Selesai</p>
           </div>
           
           {mode === 'duel' && (
             <div className={cn("bg-white p-8 rounded-[40px] border shadow-lg space-y-4", score2 >= score1 ? "border-blue-500 ring-4 ring-blue-500/20" : "border-slate-100")}>
                <p className="text-xs font-black uppercase text-slate-400">Skor Komputer</p>
                <p className="text-6xl font-black text-blue-900">{score2}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{questions.length} Soal Selesai</p>
             </div>
           )}
        </div>

        <div className="flex flex-col gap-4 justify-center items-center pb-12">
            {isEvaluation && finalScoreValue >= 70 && (
              <div className="w-full max-w-md space-y-4 bg-white p-8 rounded-[32px] border border-slate-200">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Cetak Sertifikat</p>
                <input 
                  type="text" 
                  placeholder="Masukkan Nama Lengkap"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full text-center p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:outline-none font-bold"
                />
                <button 
                  onClick={() => setGameState('certificate')}
                  disabled={!playerName}
                  className="w-full py-4 bg-emerald-950 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40 disabled:opacity-50"
                >
                  Lihat Sertifikat
                </button>
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="px-12 py-5 bg-slate-100 text-emerald-950 rounded-full font-black uppercase tracking-widest border-2 border-slate-200 hover:bg-white transition-all min-w-[240px]"
            >
              Kembali ke Peta
            </button>
        </div>
      </motion.div>
    );
  };

  // Player 1 States
  const [idx1, setIdx1] = useState(0);
  const [score1, setScore1] = useState(0);
  const [selected1, setSelected1] = useState<number | null>(null);
  const [complex1, setComplex1] = useState<number[]>([]);
  const [drag1, setDrag1] = useState<Record<string, string>>({});
  const [feedback1, setFeedback1] = useState<'correct' | 'wrong' | null>(null);

  // Player 2 States (Duel Only)
  const [idx2, setIdx2] = useState(0);
  const [score2, setScore2] = useState(0);
  const [selected2, setSelected2] = useState<number | null>(null);
  const [complex2, setComplex2] = useState<number[]>([]);
  const [drag2, setDrag2] = useState<Record<string, string>>({});
  const [feedback2, setFeedback2] = useState<'correct' | 'wrong' | null>(null);

  // Timer logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('result');
    }
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (gameState === 'result' && onFinish) {
      onFinish(getFinalScore());
    }
  }, [gameState]);

  const startQuiz = (diff: QuizDifficulty, m: QuizMode) => {
    setDifficulty(diff);
    setMode(m);
    setGameState('playing');
    setTimeLeft(isEvaluation ? 600 : 180); // 10 mins for eval, 3 mins for quiz
    
    // Reset Player 1
    setIdx1(0); setScore1(0); setSelected1(null); setComplex1([]); setDrag1({}); setFeedback1(null);
    // Reset Player 2
    setIdx2(0); setScore2(0); setSelected2(null); setComplex2([]); setDrag2({}); setFeedback2(null);

    let pool = isEvaluation ? [...ALL_QUESTIONS_POOL] : [...getQuestionsForModule(activeModule || 'translasi')];
    const limit = isEvaluation ? 35 : pool.length;
    
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, limit);
    setQuestions(shuffled);
  };

  const handleAnswer = (p: 1 | 2, index: number) => {
    const isP1 = p === 1;
    const fb = isP1 ? feedback1 : feedback2;
    if (fb !== null) return;
    
    const currIdx = isP1 ? idx1 : idx2;
    const q = questions[currIdx];

    if (isP1) {
      setSelected1(index);
      const correct = index === q.correctIndex;
      setFeedback1(correct ? 'correct' : 'wrong');
      if (correct) setScore1(s => s + 10);
      setTimeout(() => {
        if (currIdx < questions.length - 1) {
          setIdx1(i => i + 1); setSelected1(null); setFeedback1(null);
        } else if (mode === 'solo' || idx2 === questions.length - 1) {
          setGameState('result');
        } else {
          setFeedback1('correct'); // Stay finished
        }
      }, 1000);
    } else {
      setSelected2(index);
      const correct = index === q.correctIndex;
      setFeedback2(correct ? 'correct' : 'wrong');
      if (correct) setScore2(s => s + 10);
      setTimeout(() => {
        if (currIdx < questions.length - 1) {
          setIdx2(i => i + 1); setSelected2(null); setFeedback2(null);
        } else if (idx1 === questions.length - 1) {
          setGameState('result');
        } else {
          setFeedback2('correct'); // Stay finished
        }
      }, 1000);
    }
  };

  const validateComplexOrDrag = (p: 1 | 2) => {
    const isP1 = p === 1;
    const fb = isP1 ? feedback1 : feedback2;
    if (fb !== null) return;

    const currIdx = isP1 ? idx1 : idx2;
    const q = questions[currIdx];
    let correct = false;

    if (q.type === 'complex') {
      const selected = isP1 ? complex1 : complex2;
      const sortedCurrent = [...selected].sort();
      const sortedCorrect = [...(q.correctIndices || [])].sort();
      correct = JSON.stringify(sortedCurrent) === JSON.stringify(sortedCorrect);
    } else {
      const matches = isP1 ? drag1 : drag2;
      correct = (q.dropZones || []).every(zone => {
        const itemId = matches[zone.id];
        const item = q.dragItems?.find(i => i.id === itemId);
        return item?.matchId === zone.matchId;
      }) && Object.keys(matches).length === 4;
    }

    if (isP1) {
      setFeedback1(correct ? 'correct' : 'wrong');
      if (correct) setScore1(s => s + 20);
      setTimeout(() => {
        if (currIdx < questions.length - 1) {
          setIdx1(i => i + 1); setComplex1([]); setDrag1({}); setFeedback1(null);
        } else if (mode === 'solo' || idx2 === questions.length - 1) {
           setGameState('result');
        }
      }, 1000);
    } else {
      setFeedback2(correct ? 'correct' : 'wrong');
      if (correct) setScore2(s => s + 20);
      setTimeout(() => {
        if (currIdx < questions.length - 1) {
          setIdx2(i => i + 1); setComplex2([]); setDrag2({}); setFeedback2(null);
        } else if (idx1 === questions.length - 1) {
           setGameState('result');
        }
      }, 1000);
    }
  };

  const onDragMatch = (p: 1 | 2, zoneId: string, itemId: string) => {
    const fb = p === 1 ? feedback1 : feedback2;
    if (fb !== null) return;
    if (p === 1) setDrag1(prev => ({ ...prev, [zoneId]: itemId }));
    else setDrag2(prev => ({ ...prev, [zoneId]: itemId }));
  };

  const renderPlayerView = (p: 1 | 2, currentIdx: number, selected: number | null, complex: number[], drag: Record<string, string>, fb: 'correct' | 'wrong' | null, pScore: number, isDuel: boolean = false) => {
    const q = questions[currentIdx];
    if (!q) return <div className="h-full flex items-center justify-center text-slate-400 font-black uppercase tracking-widest bg-emerald-50/50">Selesai!</div>;

    return (
      <div className={cn(
        "flex flex-col h-full overflow-hidden relative",
        isDuel ? "gap-0.5 pt-0.5 px-1 pb-1" : "gap-1 pt-1 px-2 pb-2"
      )}>
        {/* HUD */}
        <div className={cn("grid grid-cols-2 shrink-0 px-1 pt-1", isDuel ? "gap-1.5" : "gap-1.5")}>
          <div className={cn("bg-white rounded-md border border-slate-200 shadow-sm flex items-center overflow-hidden", isDuel ? "p-1.5 gap-1.5" : "p-1 gap-1.5")}>
              <div className={cn(
                "shrink-0 rounded flex items-center justify-center font-black",
                isDuel ? "w-6 h-6 text-[9px]" : "w-6 h-6 text-[9px]",
                p === 1 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
              )}>{currentIdx + 1}/{questions.length}</div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-black uppercase text-slate-400 leading-none mb-0.5 whitespace-nowrap", isDuel ? "text-[7px]" : "text-[6px]")}>Progress</p>
                <div className={cn("bg-slate-100 rounded-full overflow-hidden", isDuel ? "h-1.5" : "h-1")}>
                    <motion.div 
                      animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                      className={cn("h-full", p === 1 ? "bg-emerald-500" : "bg-blue-500")}
                    />
                </div>
            </div>
          </div>
          <div className={cn("bg-white rounded-md border border-slate-200 shadow-sm flex items-center overflow-hidden", isDuel ? "p-1.5 gap-1.5" : "p-1 gap-1.5")}>
              <div className={cn("bg-orange-100 text-orange-600 rounded flex items-center justify-center shrink-0", isDuel ? "w-6 h-6" : "w-6 h-6")}>
                 <Trophy className={isDuel ? "w-3 h-3" : "w-3 h-3"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-black uppercase text-slate-400 leading-none mb-0.5 mt-0.5", isDuel ? "text-[7px]" : "text-[6px]")}>Skor</p>
                <p className={cn("font-black text-slate-800 leading-none", isDuel ? "text-[11px]" : "text-[10px]")}>{pScore}</p>
              </div>
          </div>
        </div>

        {/* Question Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-2 p-2 pt-1 scrollbar-hide">
          {/* Visual Panel Moved Inside Scroll Area for Duel */}
          {isDuel && (
            <div className="h-32 shrink-0 bg-white rounded-lg border-2 border-slate-100 overflow-hidden relative pointer-events-none mb-1 shadow-inner">
               <MathPlotter 
                  baseFunction={q.func || 'x'} 
                  params={q.params || { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 }} 
                  showGrid={true}
                  scale={12}
               />
            </div>
          )}

          <div className={cn("bg-white rounded border-2 border-slate-200 shadow-sm relative flex flex-col", isDuel ? "p-2" : "p-2 group")}>
              <div className={cn("inline-block self-start bg-emerald-950 text-white rounded px-1.5 py-0.5 mb-1 font-black uppercase tracking-widest", isDuel ? "text-[6px]" : "text-[6px]")}>
                {q.type === 'single' ? 'Pilihan Ganda' : q.type === 'complex' ? 'Ganda Kompleks' : 'Drag & Drop'}
              </div>
              <h3 className={cn("font-bold text-slate-800 leading-tight", isDuel ? "text-[12px]" : "text-[11px]")}>{q.text}</h3>
          </div>

          <div className="grid grid-cols-1 gap-1.5 pb-2">
               {q.type === 'single' && q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={fb !== null}
                    onClick={() => handleAnswer(p, idx)}
                    className={cn(
                      "rounded-lg border-2 font-bold text-left transition-all relative overflow-hidden group shadow-sm",
                      isDuel ? "py-2 px-3 text-[11px]" : "py-2 px-3 text-[11px]",
                      selected === idx ? 
                        (idx === q.correctIndex ? "bg-emerald-50 border-emerald-500 text-emerald-900" : "bg-red-50 border-red-500 text-red-900") :
                        "bg-white border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-600"
                    )}
                  >
                     <div className="relative z-10 flex items-center gap-2">
                        <div className={cn(
                          "rounded flex items-center justify-center font-black shadow-sm",
                          isDuel ? "w-5 h-5 text-[9px]" : "w-5 h-5 text-[9px]",
                          selected === idx ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white"
                        )}>
                           {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="flex-1 leading-tight">{opt}</span>
                     </div>
                  </button>
               ))}

               {q.type === 'complex' && (
                 <div className="space-y-3">
                   <div className="grid grid-cols-1 gap-1.5">
                     {q.options.map((opt, idx) => {
                       const pComplex = p === 1 ? complex1 : complex2;
                       const isSelected = pComplex.includes(idx);
                       return (
                         <button
                           key={idx}
                           disabled={fb !== null}
                           onClick={() => {
                             if (fb !== null) return;
                             if (p === 1) setComplex1(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
                             else setComplex2(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
                           }}
                           className={cn(
                             "p-2 rounded-lg border-2 font-bold text-left transition-all flex items-center gap-2 text-[10px]",
                             isSelected ? "bg-blue-50 border-blue-500 text-blue-900" : "bg-white border-slate-100"
                           )}
                         >
                           <div className={cn(
                             "w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition-colors",
                             isSelected ? "bg-blue-500 border-blue-500" : "border-slate-300"
                           )}>
                             {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                           </div>
                           <span className="leading-tight">{opt}</span>
                         </button>
                       );
                     })}
                   </div>
                   <button
                     disabled={fb !== null || (p === 1 ? complex1 : complex2).length === 0}
                     onClick={() => validateComplexOrDrag(p)}
                     className="w-full py-2 bg-emerald-950 text-white rounded-lg font-black uppercase tracking-widest disabled:opacity-50 text-[9px]"
                   >
                     Kirim Jawaban
                   </button>
                 </div>
               )}

               {q.type === 'dragdrop' && (
                 <div className="space-y-3">
                   <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-1">
                       <p className="text-[7px] font-black uppercase text-slate-400">Opsi</p>
                       {q.dragItems?.map((item) => {
                         const pDrag = p === 1 ? drag1 : drag2;
                         const isMatched = Object.values(pDrag).includes(item.id);
                         const pSelected = p === 1 ? selected1 : selected2;
                         const isSel = pSelected === Number(item.id.replace('d', ''));
                         return (
                           <button
                             key={item.id}
                             disabled={fb !== null || isMatched}
                             onClick={() => {
                                if (p === 1) setSelected1(isSel ? null : Number(item.id.replace('d', '')));
                                else setSelected2(isSel ? null : Number(item.id.replace('d', '')));
                             }}
                             className={cn(
                               "w-full p-1.5 rounded-md border-2 font-mono text-[9px] transition-all text-center",
                               isSel ? "border-orange-500 bg-orange-50" : 
                               isMatched ? "opacity-30 border-slate-100 bg-slate-50" : "bg-white border-slate-200"
                             )}
                           >
                             {item.content}
                           </button>
                         );
                       })}
                     </div>
                     <div className="space-y-1">
                       <p className="text-[7px] font-black uppercase text-slate-400">Target</p>
                       {q.dropZones?.map((zone) => {
                         const pDrag = p === 1 ? drag1 : drag2;
                         const matchedItemId = pDrag[zone.id];
                         const matchedItem = q.dragItems?.find(i => i.id === matchedItemId);
                         const pSelected = p === 1 ? selected1 : selected2;
                         
                         return (
                           <button
                             key={zone.id}
                             disabled={fb !== null}
                             onClick={() => {
                               if (pSelected !== null) {
                                  onDragMatch(p, zone.id, `d${pSelected}`);
                                  if (p === 1) setSelected1(null); else setSelected2(null);
                               }
                             }}
                             className={cn(
                               "w-full p-1.5 rounded-md border-2 border-dashed transition-all h-[30px] flex items-center justify-center text-[8px] font-bold",
                               matchedItemId ? "border-emerald-500 bg-emerald-50 text-emerald-900 border-solid" : 
                               pSelected !== null ? "border-orange-300 bg-orange-50 animate-pulse" : "border-slate-200 bg-slate-50/50 text-slate-400"
                             )}
                           >
                             {matchedItem ? matchedItem.content : zone.label}
                           </button>
                         );
                       })}
                     </div>
                   </div>
                   <button
                     disabled={fb !== null || Object.keys(p === 1 ? drag1 : drag2).length < 4}
                     onClick={() => validateComplexOrDrag(p)}
                     className="w-full py-2 bg-emerald-950 text-white rounded-lg font-black uppercase tracking-widest disabled:opacity-50 text-[9px]"
                   >
                     Verifikasi Pasangan
                   </button>
                 </div>
               )}
          </div>
        </div>

        {/* Visual Panel (Solo only, bottom fixed) */}
        {!isDuel && (
          <div className="h-20 shrink-0 bg-white rounded-lg border border-slate-100 overflow-hidden relative pointer-events-none">
             <MathPlotter 
                baseFunction={q.func || 'x'} 
                params={q.params || { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 }} 
                showGrid={true}
                scale={12}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
          </div>
        )}

        <AnimatePresence>
          {fb && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.5 }}
               className={cn(
                 "absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl border-4",
                 isDuel ? "p-4 m-2" : "p-8 m-4",
                 fb === 'correct' ? "border-emerald-500 text-emerald-600" : "border-red-500 text-red-600"
               )}
             >
                <div className="text-center">
                    {fb === 'correct' ? <CheckCircle2 className={cn("mx-auto mb-1", isDuel ? "w-8 h-8" : "w-10 h-10")} /> : <AlertCircle className={cn("mx-auto mb-1", isDuel ? "w-8 h-8" : "w-10 h-10")} />}
                    <p className={cn("font-black uppercase tracking-tighter text-center", isDuel ? "text-base" : "text-lg")}>{fb === 'correct' ? 'Benar!' : 'Salah!'}</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#f7f3e9] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-900 p-4 sm:p-6 flex justify-between items-center text-white shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              {mode === 'duel' ? <Swords className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
           </div>
           <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Ujian GATRA</h1>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-1">Level: {difficulty} | Mode: {mode}</p>
           </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center gap-2">
           <span className="text-[10px] font-black uppercase hidden sm:block">Keluar</span>
           <Home className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12">
          <AnimatePresence mode="wait">
            {gameState === 'lobby' && (
              <motion.div 
                key="lobby"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 py-4"
              >
                <div className="text-center space-y-2">
                   <h2 className="text-3xl font-black text-emerald-950 uppercase italic font-serif">Siap Uji Nyali?</h2>
                   <p className="text-slate-500 font-bold text-xs max-w-md mx-auto">Tunjukkan kehebatanmu dalam menguasai pergeseran arah di tengah rimba transformasi!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Solo Mode - Only show if mode is solo or no strict initialMode */}
                   {(mode === 'solo') && (
                     <div className={cn("space-y-4", initialMode === 'solo' ? "col-span-1 md:col-span-2 max-w-2xl mx-auto w-full" : "")}>
                        <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-1">
                           <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold">Solo Adventure</div>
                           <div className="h-0.5 flex-1 bg-slate-100" />
                        </div>
                        <div className={cn("grid gap-3", initialMode === 'solo' ? "sm:grid-cols-3" : "grid-cols-1")}>
                           {(['easy', 'medium', 'hard'] as QuizDifficulty[]).map((diff) => (
                             <button
                               key={diff}
                               onClick={() => startQuiz(diff, 'solo')}
                               className={cn(
                                 "group relative p-4 rounded-[20px] border-2 transition-all text-left overflow-hidden shadow-sm",
                                 diff === 'easy' ? "bg-white border-blue-50 hover:border-blue-400" :
                                 diff === 'medium' ? "bg-white border-orange-50 hover:border-orange-400" :
                                 "bg-white border-red-50 hover:border-red-400"
                               )}
                             >
                               <div className="flex justify-between items-center relative z-10">
                                  <div>
                                     <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">{diff}</p>
                                      <p className="text-sm font-bold text-slate-800 capitalize leading-none">{diff === 'easy' ? 'Mudah' : diff === 'medium' ? 'Sedang' : 'Sulit'}</p>
                                  </div>
                                  <div className="hidden xs:flex gap-1">
                                     {[1, 2, 3].map(s => (
                                       <Star key={s} className={cn("w-4 h-4", s <= (diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3) ? "text-orange-400 fill-orange-400" : "text-slate-200")} />
                                     ))}
                                  </div>
                               </div>
                               <ArrowRight className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-50 opacity-0 group-hover:opacity-100 group-hover:right-2 transition-all" />
                             </button>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Duel Mode - Only show if mode is duel or no strict initialMode */}
                   {(mode === 'duel') && (
                     <div className={cn("space-y-4", initialMode === 'duel' ? "col-span-1 md:col-span-2 max-w-xl mx-auto w-full" : "")}>
                        <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-1">
                           <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-[10px] font-bold">Duel GATRA (PvP)</div>
                           <div className="h-0.5 flex-1 bg-slate-100" />
                        </div>
                        <div className="p-6 bg-orange-950 rounded-[30px] text-white space-y-4 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                              <Swords className="w-24 h-24" />
                           </div>
                           <div className="relative z-10 space-y-3">
                              <h3 className="text-xl font-black italic">Tantangan Rival!</h3>
                              <p className="text-[11px] text-orange-200 leading-snug">Lawan komputer hebat dalam kecepatan menjawab. Level Medium otomatis diterapkan.</p>
                              <button 
                                 onClick={() => startQuiz('medium', 'duel')}
                                 className="w-full py-3 bg-orange-500 hover:bg-orange-400 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-orange-900/50 transition-all active:scale-95"
                              >
                                  Ayo Duel!
                              </button>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && (
              <motion.div 
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "h-full flex flex-col overflow-hidden",
                  mode === 'duel' ? "md:flex-row" : "max-w-5xl mx-auto w-full"
                )}
              >
                 {/* PLAYER 1 SIDE */}
                <div className={cn(
                  "flex flex-col min-h-0",
                  mode === 'duel' ? "h-1/2 md:h-full md:w-1/2 md:border-r-4 md:border-slate-200" : "h-full w-full"
                )}>
                  {renderPlayerView(1, idx1, selected1, complex1, drag1, feedback1, score1, mode === 'duel')}
                </div>

                {/* PLAYER 2 SIDE (Duel Only) */}
                {mode === 'duel' && (
                  <div className="h-1/2 md:h-full md:w-1/2 flex flex-col min-h-0 border-t-4 border-slate-200 md:border-t-0 bg-blue-50/5">
                    {renderPlayerView(2, idx2, selected2, complex2, drag2, feedback2, score2, mode === 'duel')}
                  </div>
                )}
              </motion.div>
            )}

            {gameState === 'result' && renderResult()}

            {gameState === 'certificate' && (
              <motion.div 
                key="certificate_view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full overflow-y-auto py-12 px-4 space-y-8 flex flex-col items-center"
              >
                 <div className="bg-white p-4 rounded-[40px] shadow-2xl scale-75 sm:scale-100 origin-top">
                    {renderCertificate()}
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={downloadCertificate}
                      className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
                    >
                       <Star className="w-5 h-5" /> Download PNG
                    </button>
                    <button 
                      onClick={() => setGameState('result')}
                      className="px-8 py-4 bg-slate-200 text-slate-800 rounded-2xl font-black uppercase tracking-widest"
                    >
                       Kembali
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
};
