import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, 
  FlaskConical, 
  ChevronRight, 
  Compass, 
  TreePine, 
  Wind, 
  Mountain, 
  Menu,
  X,
  Target,
  Tent,
  BookOpen,
  ArrowRight,
  Info,
  Sparkles,
  Zap,
  Swords,
  Trophy,
  RotateCcw,
  RotateCw,
  Maximize,
  Layers,
  User,
  GraduationCap,
  Award
} from 'lucide-react';
import { MathPlotter } from './components/MathPlotter.tsx';
import { GPSLab } from './components/GPSLab.tsx';
import { GeometryLab } from './components/GeometryLab.tsx';
import { Controls } from './components/Controls.tsx';
import { ModuleId, TransformationParams } from './types.ts';
import { cn } from './lib/utils.ts';

type GameState = 'map' | 'lesson' | 'level' | 'lab';
type LabMode = 'graph' | 'gps' | 'geometry' | 'simulasi';

const MODULES = [
  { id: 'translasi', title: 'Tahap 1: Jalan Setapak', subtitle: 'Translasi', icon: <MapIcon className="w-6 h-6" />, color: 'emerald', discovery: 'Papan Penunjuk Arah' },
  { id: 'refleksi', title: 'Tahap 2: Danau Cermin', subtitle: 'Refleksi', icon: <Compass className="w-6 h-6" />, color: 'blue', discovery: 'Permukaan Air Kristal' },
  { id: 'dilatasi', title: 'Tahap 3: Hutan Raksasa', subtitle: 'Dilatasi', icon: <TreePine className="w-6 h-6" />, color: 'orange', discovery: 'Jamur Ajaib' },
  { id: 'rotasi', title: 'Tahap 4: Pusaran Angin', subtitle: 'Rotasi', icon: <Wind className="w-6 h-6" />, color: 'indigo', discovery: 'Batu Kompas Kuno' },
  { id: 'kombinasi', title: 'Tahap 5: Gerbang Goa', subtitle: 'Kombinasi', icon: <Mountain className="w-6 h-6" />, color: 'amber', discovery: 'Artefak Gerbang' },
];

import { Quiz } from './components/Quiz.tsx';
import { ReflectionLab } from './components/ReflectionLab.tsx';
import { DilationLab } from './components/DilationLab.tsx';
import { RotationLab } from './components/RotationLab.tsx';
import { CombinationLab } from './components/CombinationLab.tsx';
import { useCollab } from './components/CollaborationContext.tsx';
import { CollaborationControls } from './components/CollaborationControls.tsx';
import { BackgroundMusic } from './components/BackgroundMusic.tsx';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('map');
  const [showStory, setShowStory] = useState(false);
  const [showObjectives, setShowObjectives] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleId>('translasi');
  const [labMode, setLabMode] = useState<LabMode>('graph');
  const [currentSubTopic, setCurrentSubTopic] = useState<string>('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizInitialMode, setQuizInitialMode] = useState<'solo' | 'duel'>('solo');
  const [params, setParams] = useState<TransformationParams>({
    a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0
  });
  const [baseFunc, setBaseFunc] = useState('x^2');
  const [showPoints, setShowPoints] = useState(true);
  const [showGhost, setShowGhost] = useState(true);
  const [plotScale, setPlotScale] = useState(40);
  const [completedModules, setCompletedModules] = useState<Set<ModuleId>>(() => {
    const saved = localStorage.getItem('gatra_completed');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const { role, remoteLabState, updateGlobalState, isCollabActive } = useCollab();

  // If Host: Sync local state to Firebase (Throttle/Debounce in a real app, but simple sync for now)
  React.useEffect(() => {
    if (role === 'host' && isCollabActive) {
      updateGlobalState({ params, sceneId: activeModule });
    }
  }, [params, activeModule, role, isCollabActive]);

  // If Student: Sync remote state to local
  React.useEffect(() => {
    if (role === 'student' && remoteLabState) {
      if (remoteLabState.params) {
        // Deep compare or just set if different
        setParams(remoteLabState.params);
      }
      if (remoteLabState.sceneId && remoteLabState.sceneId !== activeModule) {
        setActiveModule(remoteLabState.sceneId as ModuleId);
      }
    }
  }, [remoteLabState, role, activeModule]);

  const allModulesCompleted = completedModules.size >= 5;

  React.useEffect(() => {
    localStorage.setItem('gatra_completed', JSON.stringify([...completedModules]));
  }, [completedModules]);

  React.useEffect(() => {
    const hasSeenStory = localStorage.getItem('gatra_story_seen');
    if (!hasSeenStory) {
      setShowStory(true);
      localStorage.setItem('gatra_story_seen', 'true');
    }
  }, []);

  const enterLevel = (id: ModuleId) => {
    setActiveModule(id);
    setCurrentSubTopic('');
    setGameState('lesson'); // Enter full-screen lesson first
    resetParams(id);
    
    if (id === 'translasi') setBaseFunc('x^2');
  };

  const handleSubTopicSelect = (topic: string) => {
    setCurrentSubTopic(topic);
    if (topic === 'linear') setBaseFunc('2x + 1');
    if (topic === 'kuadrat') setBaseFunc('x^2');
    if (topic === 'eksponensial') setBaseFunc('2^x');
    if (topic === '') setBaseFunc('x^2');
  };

  const resetParams = (id: ModuleId) => {
    setParams({ a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 });
  };

  return (
    <div className="flex flex-col h-[100dvh] elegant-jungle font-sans text-slate-900 overflow-hidden relative">
      <div className="elegant-jungle-overlay" />
      
      {/* Story Modal */}
      <AnimatePresence>
        {showStory && (
          <StoryModal onClose={() => setShowStory(false)} />
        )}
        {showObjectives && (
          <ObjectivesModal onClose={() => setShowObjectives(false)} />
        )}
        {showProfile && (
          <ProfileModal onClose={() => setShowProfile(false)} />
        )}
      </AnimatePresence>

      {/* Dynamic Header */}
      <header className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 bg-emerald-950 text-white z-30 shrink-0 shadow-xl border-b border-emerald-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setGameState('map')} className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-orange-900/20">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="hidden xs:block">
            <h1 className="text-sm sm:text-md font-black tracking-tighter uppercase leading-none">GATRA</h1>
            <p className="hidden md:block text-[9px] uppercase tracking-widest font-bold text-emerald-400">Grafik Algebra Transformasi</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setGameState('lab')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
              gameState === 'lab' ? "bg-white text-emerald-950" : "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
            )}
          >
            <FlaskConical className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Tenda Riset (LAB)</span>
            <span className="sm:hidden">LAB</span>
          </button>
          {gameState !== 'map' && (
            <button 
              onClick={() => setGameState('map')}
              className="bg-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase shadow-lg hover:bg-orange-600 transition-all"
            >
              Peta
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {gameState === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 flex flex-col items-center justify-start xl:justify-center p-4 sm:p-8 overflow-y-auto z-10"
            >
              <div className="max-w-4xl w-full py-8 sm:py-12 relative">
                {/* Decorative jungle elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-8 sm:mb-12">
                   <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">Peta Hutan Aljabar</h2>
                   <div className="h-1 w-24 bg-orange-500 mx-auto mt-4 rounded-full shadow-lg shadow-orange-500/50" />
                   
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6">
                      <button 
                        onClick={() => setShowStory(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black uppercase text-white hover:bg-white/30 transition-all border-b-2 border-white/10 shadow-lg"
                      >
                        <BookOpen className="w-4 h-4 text-orange-400" />
                        Legenda GATRA
                      </button>
                      <button 
                        onClick={() => setShowObjectives(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black uppercase text-white hover:bg-white/30 transition-all border-b-2 border-white/10 shadow-lg"
                      >
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        Tujuan Pembelajaran
                      </button>
                      <button 
                        onClick={() => setShowProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black uppercase text-white hover:bg-white/30 transition-all border-b-2 border-white/10 shadow-lg"
                      >
                        <User className="w-4 h-4 text-emerald-400" />
                        Profil Pengajar
                      </button>
                      <button 
                        onClick={() => {
                          setQuizInitialMode('duel');
                          setShowQuiz(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-full text-[10px] font-black uppercase text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/50 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1"
                      >
                        <Swords className="w-4 h-4" />
                        Duel Penjelajah
                      </button>
                   </div>

                    {allModulesCompleted && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 flex justify-center"
                      >
                         <button 
                           onClick={() => {
                             setActiveModule('evaluasi' as any);
                             setQuizInitialMode('solo');
                             setShowQuiz(true);
                           }}
                           className="group relative px-10 py-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[40px] text-white shadow-2xl shadow-orange-900/40 hover:scale-105 transition-all"
                         >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                  <Trophy className="w-8 h-8" />
                               </div>
                               <div className="text-left">
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100 mb-0.5">Misi Pamungkas</p>
                                  <p className="text-2xl font-black tracking-tight uppercase">EVALUASI AKHIR</p>
                                </div>
                            </div>
                         </button>
                      </motion.div>
                    )}
                 </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10 justify-items-center">
                  {MODULES.map((m, idx) => (
                    <motion.button
                      key={m.id}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => enterLevel(m.id as ModuleId)}
                      className="group relative flex flex-col items-center w-full max-w-[140px]"
                    >
                      <div className={cn(
                        "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shadow-2xl mb-4 transition-all border-4 relative",
                        activeModule === m.id && gameState !== 'map' 
                          ? "bg-orange-500 border-white text-white rotate-6" 
                          : "bg-emerald-800/90 backdrop-blur-md border-emerald-400/50 text-white group-hover:border-emerald-300 group-hover:bg-emerald-700 group-hover:scale-105"
                      )}>
                        {m.icon}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-950 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-400 shadow-lg">
                          0{idx + 1}
                        </div>
                      </div>
                      <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-100 group-hover:text-orange-400 transition-colors text-center shadow-emerald-950 px-2 py-1 rounded bg-black/20 backdrop-blur-sm">{m.subtitle}</h3>
                      <p className="font-bold text-[8px] uppercase tracking-tighter text-emerald-400/60 mt-1">{m.discovery}</p>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-16 flex justify-center">
                   <button 
                    onClick={() => setGameState('lab')}
                    className="group bg-emerald-800 backdrop-blur-md text-white p-5 sm:p-7 rounded-[40px] flex items-center gap-6 shadow-2xl hover:bg-emerald-700 transition-all border-2 border-emerald-400/50 w-full sm:w-auto mx-4"
                   >
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-800 rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg border border-emerald-400/20">
                       <Tent className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
                     </div>
                     <div className="text-left">
                       <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Mulai Eksplorasi Bebas</p>
                       <p className="text-lg sm:text-2xl font-black tracking-tight">Masuk ke Tenda Riset Lab</p>
                     </div>
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'lesson' && (
            <motion.div 
              key="lesson"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 bg-[#fcfaf4] overflow-y-auto z-10"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] opacity-50 pointer-events-none" />
              <div className="max-w-4xl mx-auto p-6 sm:p-12 pb-32 relative">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setGameState('map')}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 italic">Misi Tahap #0{MODULES.findIndex(m=>m.id === activeModule)+1}</p>
                      <h2 className="text-3xl font-black text-emerald-950 leading-tight">Misteri {MODULES.find(m => m.id === activeModule)?.subtitle}</h2>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-800 shadow-sm border border-slate-100">
                    {MODULES.find(m => m.id === activeModule)?.icon}
                  </div>
                </div>

                {/* Sub-Topic Navigation Bar */}
                <div className="mb-10">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest text-center">
                    {activeModule === 'refleksi' ? 'Pilih Jenis Refleksi:' : 'Pilih Fungsi untuk Eksplorasi:'}
                  </p>
                  
                  {activeModule === 'refleksi' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                       {[
                         { id: '', label: 'Utama' },
                         { id: 'ref-x', label: 'Sumbu X' },
                         { id: 'ref-y', label: 'Sumbu Y' },
                         { id: 'ref-o', label: 'Asal O' },
                         { id: 'ref-yx', label: 'y = x' },
                         { id: 'ref-ynx', label: 'y = -x' },
                         { id: 'ref-xh', label: 'x = h' },
                         { id: 'ref-yk', label: 'y = k' },
                       ].map((topic) => (
                         <button 
                           key={topic.id}
                           onClick={() => handleSubTopicSelect(topic.id)} 
                           className={cn(
                             "py-2 px-1 rounded-xl text-[9px] font-black uppercase transition-all border-2",
                             currentSubTopic === topic.id 
                              ? "bg-blue-950 text-white border-blue-950 shadow-lg" 
                              : "bg-white text-blue-900 border-slate-200 hover:border-blue-500"
                           )}
                         >
                           {topic.label}
                         </button>
                       ))}
                    </div>
                  ) : activeModule === 'dilatasi' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {[
                         { id: '', label: 'Materi Utama' },
                         { id: 'pusatO', label: 'Pusat O(0,0)' },
                         { id: 'pusatA', label: 'Pusat A(a,b)' },
                       ].map((topic) => (
                         <button 
                           key={topic.id}
                           onClick={() => handleSubTopicSelect(topic.id)} 
                           className={cn(
                             "py-3 px-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2",
                             currentSubTopic === topic.id 
                              ? "bg-orange-600 text-white border-orange-600 shadow-lg scale-105" 
                              : "bg-white text-orange-900 border-slate-200 hover:border-orange-50"
                           )}
                         >
                           {topic.label}
                         </button>
                       ))}
                    </div>
                  ) : activeModule === 'rotasi' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {[
                         { id: '', label: 'Materi Utama' },
                         { id: 'pusatO', label: 'Pusat O(0,0)' },
                         { id: 'pusatA', label: 'Pusat A(a,b)' },
                       ].map((topic) => (
                         <button 
                           key={topic.id}
                           onClick={() => handleSubTopicSelect(topic.id)} 
                           className={cn(
                             "py-3 px-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2",
                             currentSubTopic === topic.id 
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105" 
                              : "bg-white text-indigo-900 border-slate-200 hover:border-indigo-50"
                           )}
                         >
                           {topic.label}
                         </button>
                       ))}
                    </div>
                  ) : activeModule === 'kombinasi' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       {[
                         { id: '', label: 'Materi Utama' },
                         { id: 'komp-translasi', label: 'Komposisi 2 Translasi' },
                         { id: 'komp-refleksi', label: 'Komposisi 2 Refleksi' },
                         { id: 'komp-rotasi', label: 'Komposisi 2 Rotasi' },
                       ].map((topic) => (
                         <button 
                           key={topic.id}
                           onClick={() => handleSubTopicSelect(topic.id)} 
                           className={cn(
                             "py-3 px-4 rounded-xl text-[9px] font-black uppercase transition-all border-2",
                             currentSubTopic === topic.id 
                               ? "bg-amber-600 text-white border-amber-600 shadow-lg scale-105" 
                               : "bg-white text-amber-900 border-slate-200 hover:border-amber-50"
                           )}
                         >
                           {topic.label}
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                       <button 
                         onClick={() => handleSubTopicSelect('')} 
                         className={cn(
                           "py-3 px-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2",
                           currentSubTopic === '' 
                            ? "bg-emerald-950 text-white border-emerald-950 shadow-lg scale-105" 
                            : "bg-white text-emerald-900 border-slate-200 hover:border-emerald-50"
                         )}
                       >
                         Materi Utama
                       </button>
                       <button 
                         onClick={() => handleSubTopicSelect('linear')} 
                         className={cn(
                           "py-3 px-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2",
                           currentSubTopic === 'linear' 
                            ? "bg-emerald-950 text-white border-emerald-950 shadow-lg scale-105" 
                            : "bg-white text-emerald-900 border-slate-200 hover:border-emerald-50"
                         )}
                       >
                         Linear
                       </button>
                       <button 
                         onClick={() => handleSubTopicSelect('kuadrat')} 
                         className={cn(
                           "py-3 px-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2",
                           currentSubTopic === 'kuadrat' 
                            ? "bg-emerald-950 text-white border-emerald-950 shadow-lg scale-105" 
                            : "bg-white text-emerald-900 border-slate-200 hover:border-emerald-50"
                         )}
                       >
                         Kuadrat
                       </button>
                       <button 
                         onClick={() => handleSubTopicSelect('eksponensial')} 
                         className={cn(
                           "py-3 px-4 rounded-2xl text-[10px] font-black uppercase transition-all border-2",
                           currentSubTopic === 'eksponensial' 
                            ? "bg-emerald-950 text-white border-emerald-950 shadow-lg scale-105" 
                            : "bg-white text-emerald-900 border-slate-200 hover:border-emerald-50"
                         )}
                       >
                         Eksponen
                       </button>
                    </div>
                  )}
                </div>

                <DetailedLessonContent 
                  id={activeModule} 
                  subTopic={currentSubTopic}
                  onSubTopicSelect={handleSubTopicSelect}
                  onStartQuiz={() => {
                    setQuizInitialMode('solo');
                    setShowQuiz(true);
                  }}
                  onStartLab={() => setGameState('level')}
                />

                <div className="pt-12 flex flex-col sm:flex-row gap-4 border-t border-slate-200 mt-12">
                   <button 
                      onClick={() => {
                        setQuizInitialMode('solo');
                        setShowQuiz(true);
                      }}
                      className="flex-1 p-6 bg-orange-500 hover:bg-orange-600 text-white rounded-[32px] flex items-center justify-center gap-4 shadow-xl shadow-orange-900/10 active:scale-[0.98] transition-all group border-b-4 border-orange-700"
                   >
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                         <Target className="w-8 h-8" />
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Siap Uji Nyali?</p>
                         <p className="text-xl font-bold">Mulai Ujian</p>
                      </div>
                   </button>

                   <button 
                      onClick={() => setGameState('level')}
                      className="flex-1 p-6 bg-emerald-950 hover:bg-black text-white rounded-[32px] flex items-center justify-center gap-4 shadow-xl shadow-emerald-900/10 active:scale-[0.98] transition-all group border-b-4 border-emerald-800"
                   >
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                         <FlaskConical className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Eksperimen?</p>
                         <p className="text-xl font-bold">Buka Lab</p>
                      </div>
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {(gameState === 'level' || gameState === 'lab') && (
            <motion.div 
              key="workspace"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 flex flex-col lg:flex-row bg-white overflow-hidden"
            >
              {/* Plotter View */}
              <div className="flex-1 relative flex flex-col overflow-hidden min-h-[40%]">
                <div className="flex-1 relative bg-slate-50">
                  {activeModule === 'translasi' && labMode === 'gps' ? (
                    <GPSLab 
                      params={params} 
                      scale={plotScale} 
                      onUpdateParams={(updates) => setParams(prev => ({ ...prev, ...updates }))} 
                    />
                  ) : activeModule === 'translasi' && labMode === 'geometry' ? (
                    <GeometryLab 
                      params={params} 
                      scale={plotScale} 
                      onUpdateParams={(updates) => setParams(prev => ({ ...prev, ...updates }))}
                    />
                  ) : activeModule === 'refleksi' && labMode === 'simulasi' ? (
                    <ReflectionLab 
                      params={params} 
                      onUpdateParams={(updates) => setParams(prev => ({ ...prev, ...updates }))}
                    />
                  ) : activeModule === 'dilatasi' && labMode === 'simulasi' ? (
                    <DilationLab 
                      params={params} 
                      onUpdateParams={(updates) => setParams(prev => ({ ...prev, ...updates }))}
                    />
                  ) : activeModule === 'rotasi' && labMode === 'simulasi' ? (
                    <RotationLab 
                      params={params} 
                      onUpdateParams={(updates) => setParams(prev => ({ ...prev, ...updates }))}
                    />
                  ) : activeModule === 'kombinasi' && labMode === 'simulasi' ? (
                    <CombinationLab 
                      params={params} 
                      onUpdateParams={(updates) => setParams(prev => ({ ...prev, ...updates }))}
                    />
                  ) : (
                    <MathPlotter 
                      baseFunction={baseFunc} 
                      params={params} 
                      showPoints={showPoints} 
                      showGhost={showGhost} 
                      scale={plotScale}
                    />
                  )}
                  
                  {/* Mode Toggles for Translasi */}

                  {/* Mode Toggles for all Modules */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 z-40 w-max max-w-[calc(100%-40px)]">
                    {/* Common Modes for Translasi */}
                    {activeModule === 'translasi' && (
                      <div className="flex gap-2 p-1.5 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-200">
                        {['graph', 'geometry', 'gps'].map((mode) => (
                          <button 
                            key={mode}
                            onClick={() => setLabMode(mode as LabMode)}
                            className={cn(
                              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              labMode === mode ? "bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            )}
                          >
                            {mode === 'graph' ? 'Grafik' : mode === 'geometry' ? 'Bangun Datar' : 'Navigasi GPS'}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Specialized Simulation Modes for Refleksi, Dilatasi, Rotasi, & Kombinasi */}
                    {(activeModule === 'refleksi' || activeModule === 'dilatasi' || activeModule === 'rotasi' || activeModule === 'kombinasi') && (
                      <div className="flex gap-2 p-1.5 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-200">
                        {['graph', 'simulasi'].map((mode) => (
                          <button 
                            key={mode}
                            onClick={() => setLabMode(mode as LabMode)}
                            className={cn(
                              "px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                              labMode === mode 
                                ? (activeModule === 'refleksi' ? "bg-blue-600 ring-blue-500/20" : 
                                   activeModule === 'rotasi' ? "bg-indigo-600 ring-indigo-500/20" : 
                                   activeModule === 'kombinasi' ? "bg-amber-600 ring-amber-500/20" :
                                   "bg-orange-600 ring-orange-500/20") + " text-white shadow-lg ring-2" 
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            )}
                          >
                            {mode === 'simulasi' && <Sparkles className="w-3.5 h-3.5" />}
                            {mode === 'graph' ? 'Grafik' : 'Simulasi Dunia Nyata'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Floating Lab Info/HUD */}
                  {gameState === 'lab' && (
                    <div className="absolute top-28 right-4 flex flex-col gap-2 pointer-events-none z-40">
                       <motion.div 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-2xl shadow-xl border-r-4 border-r-emerald-500 text-right"
                       >
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Koordinat Kursor</p>
                          <p className="text-xs font-mono font-bold text-emerald-950 italic">Eksplorasi {baseFunc}</p>
                       </motion.div>
                    </div>
                  )}

                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
                     <button 
                       onClick={() => setPlotScale(s => Math.min(100, s + 5))}
                       className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center font-black text-emerald-900 hover:bg-slate-50 transition-all"
                     >
                       +
                     </button>
                     <button 
                       onClick={() => setPlotScale(s => Math.max(10, s - 5))}
                       className="w-10 h-10 bg-white border border-slate-200 rounded-xl shadow-lg flex items-center justify-center font-black text-emerald-900 hover:bg-slate-50 transition-all"
                     >
                       -
                     </button>
                  </div>
                  </div>
                </div>

              {/* Sidebar Controls */}
              <div className="w-full lg:w-80 h-auto lg:h-full shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto bg-[#f7f3e9]">
                <Controls 
                   params={params} 
                   setParams={setParams} 
                   disabledFields={gameState === 'lab' ? [] : getDisabledFields(activeModule)}
                   baseFunction={baseFunc}
                   onBaseFuncChange={setBaseFunc}
                   showPoints={showPoints}
                   setShowPoints={setShowPoints}
                   showGhost={showGhost}
                   setShowGhost={setShowGhost}
                   labMode={labMode}
                   activeModule={activeModule}
                   readOnly={role === 'student'}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
         {/* Deleted showJournal modal implementation */}
      </AnimatePresence>

      {showQuiz && (
        <Quiz 
          initialMode={quizInitialMode} 
          activeModule={activeModule as any}
          onClose={() => setShowQuiz(false)} 
          onFinish={(score) => {
            if (score >= 70 && activeModule !== ('evaluasi' as any)) {
              setCompletedModules(prev => new Set([...prev, activeModule]));
            }
          }}
        />
      )}

      <CollaborationControls currentParams={params} activeScene={activeModule} />
      <BackgroundMusic />
    </div>
  );
}

function StoryModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-xl w-full max-h-[90vh] overflow-y-auto bg-[#fdfaf3] rounded-[40px] shadow-2xl relative border-4 border-emerald-800 scrollbar-hide"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] opacity-20 pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full border border-emerald-100 flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border-2 border-emerald-200">
            <BookOpen className="w-8 h-8 text-emerald-800" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 uppercase tracking-tighter mb-4 italic font-serif leading-tight">Legenda GATRA</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed text-sm sm:text-base font-medium italic">
            <p>
              "Dahulu kala, di kedalaman <span className="text-emerald-800 font-black">GATRA</span> (Grafik Algebra Transformasi), terdapat sebuah dimensi ajaib yang dikenal sebagai Hutan Transformasi. Di sini, segala sesuatunya hidup dalam bentuk fungsi-fungsi murni."
            </p>
            <p>
              "Pohon-pohon tumbuh mengikuti kurva eksponensial, dan sungai-sungai mengalir setenang fungsi linear. Namun, keseimbangan dimensi ini dijaga oleh empat kekuatan rahasia: <span className="text-orange-600 font-bold">Pergeseran</span>, <span className="text-blue-600 font-bold">Cermin Ajaib</span>, <span className="text-indigo-600 font-bold">Peregangan</span>, dan <span className="text-purple-600 font-bold">Pusaran Angin</span>."
            </p>
            <p>
              "Kamu adalah seorang <span className="text-emerald-900 font-black">Penjelajah Aljabar</span> yang terpilih untuk menguasai kekuatan ini guna memulihkan harmoni di GATRA. Jelajahilah setiap tahap, temukan artefak kuno, dan hadapilah tantangan para rival untuk menjadi Sang Maestro Fungsi!"
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-10 w-full sm:w-auto px-10 py-4 bg-emerald-950 text-white rounded-full font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-900/40 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1"
          >
            Mulai Petualangan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ObjectivesModal({ onClose }: { onClose: () => void }) {
  const objectives = [
    "Menjelaskan Transformasi Pada Suatu Fungsi Linear, Kuadrat, dan Fungsi Eksponen",
    "Menentukan Transformasi Translasi Pada Suatu Fungsi",
    "Menentukan Transformasi Refleksi Pada Suatu Fungsi",
    "Menentukan Transformasi Dilatasi Pada Suatu Fungsi",
    "Menentukan Transformasi Rotasi Pada Suatu Fungsi",
    "Menentukan Kombinasi Transformasi Pada Suatu Fungsi"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-xl w-full max-h-[90vh] overflow-y-auto bg-[#fdfaf3] rounded-[40px] shadow-2xl relative border-4 border-blue-800 scrollbar-hide"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] opacity-20 pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full border border-blue-100 flex items-center justify-center text-blue-900 hover:bg-blue-50 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-xl border-2 border-blue-200">
              <GraduationCap className="w-7 h-7 text-blue-800" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter mb-2 italic font-serif leading-tight">Tujuan Pembelajaran</h2>
            <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full shadow-lg shadow-blue-500/50" />
          </div>

          <div className="space-y-6">
            <div className="bg-white/50 p-6 rounded-3xl border border-blue-100 shadow-inner">
               <div className="flex items-center gap-2 mb-4">
                 <Award className="w-4 h-4 text-orange-500" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-900 underline decoration-orange-300 decoration-2 underline-offset-4">Capaian Pembelajaran (BSKAP No. 032/H/KR/2024)</h3>
               </div>
               <p className="text-sm text-slate-700 leading-relaxed font-medium italic bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                 "Di akhir fase F, peserta didik dapat melakukan operasi aljabar pada fungsi dan menentukan fungsi invers, komposisi fungsi, dan transformasi fungsi untuk memodelkan situasi dunia nyata menggunakan fungsi yang sesuai (linear, kuadrat, eksponensial)."
               </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Indikator Keberhasilan:</h3>
               <div className="grid grid-cols-1 gap-3">
                 {objectives.map((obj, i) => (
                   <div key={i} className="flex gap-4 items-start p-2 hover:bg-blue-50 rounded-xl transition-colors">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 border-b-2 border-blue-800">{i+1}</div>
                      <p className="text-sm font-bold text-slate-700 leading-tight">{obj}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-10 w-full px-10 py-4 bg-emerald-950 text-white rounded-full font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-900/40 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1"
          >
            Mengerti, Lanjutkan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full max-h-[90vh] overflow-y-auto bg-[#fdfaf3] rounded-[40px] shadow-2xl relative border-4 border-emerald-700 scrollbar-hide"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] opacity-20 pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full border border-emerald-100 flex items-center justify-center text-emerald-900 hover:bg-emerald-50 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 relative z-10 text-center">
          <div className="flex justify-center mb-6 relative">
             <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
             <div className="w-24 h-24 sm:w-28 sm:h-28 bg-emerald-100 rounded-[32px] overflow-hidden border-4 border-white shadow-xl relative z-10 flex items-center justify-center group hover:rotate-6 transition-transform">
                <div className="absolute inset-0 bg-emerald-800/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <User className="w-12 h-12 text-emerald-800" />
             </div>
             <div className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 w-10 h-10 bg-orange-500 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center z-20">
                <Award className="w-5 h-5 text-white" />
             </div>
          </div>
          
          <div className="text-center">
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
               Guru Matematika
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 uppercase tracking-tighter mb-1 font-serif italic">Hairi Hasbi</h2>
            <div className="flex items-center justify-center gap-2 text-slate-500 font-bold text-xs mb-6">
               <MapIcon className="w-3 h-3 text-orange-500" />
               SMAN 5 Banjarbaru
            </div>
            
            <div className="bg-white/80 p-5 rounded-3xl border border-emerald-100 shadow-inner mb-6 text-left">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center">
                     <Award className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Pengajar</p>
                     <p className="text-[11px] font-bold text-emerald-950 uppercase">Profil Profesional</p>
                  </div>
               </div>
               <p className="text-[12px] text-slate-600 leading-relaxed italic font-medium">
                 "Mengabdi untuk mencerdaskan generasi bangsa melalui pendekatan matematika yang inovatif dan interaktif. Selamat datang di GATRA!"
               </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full px-10 py-4 bg-emerald-950 text-white rounded-full font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-900/40 border-b-4 border-emerald-900 active:translate-y-1 active:border-b-0"
            >
              Tutup Profil
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getDisabledFields(id: ModuleId): (keyof TransformationParams)[] {
  switch (id) {
    case 'translasi': return ['a', 'b', 'reflectX', 'reflectY', 'rotation'];
    case 'refleksi': return ['a', 'b', 'c', 'd', 'rotation'];
    case 'dilatasi': return ['c', 'd', 'reflectX', 'reflectY', 'rotation'];
    case 'rotasi': return ['a', 'b', 'c', 'd'];
    default: return [];
  }
}

function MiniPlotter({ func, params, title, scale = 20 }: { func: string, params: TransformationParams, title: string, scale?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg group hover:border-emerald-500 transition-colors">
      <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center group-hover:bg-emerald-50 transition-colors">
        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{title}</span>
        <code className="text-[10px] font-bold text-emerald-700">{func}</code>
      </div>
      <div className="h-32 w-full relative">
        <MathPlotter 
          baseFunction={func} 
          params={params} 
          showGrid={true} 
          scale={scale} 
          hideLegend={true} 
        />
        {/* Absolute indicators for shift */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1">
          {params.c !== 0 && (
            <div className="px-1.5 py-0.5 bg-orange-500 text-white text-[8px] font-bold rounded shadow-sm">
              X: {params.c > 0 ? '+' : ''}{params.c}
            </div>
          )}
          {params.d !== 0 && (
            <div className="px-1.5 py-0.5 bg-blue-500 text-white text-[8px] font-bold rounded shadow-sm">
              Y: {params.d > 0 ? '+' : ''}{params.d}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailedLessonContent({ id, subTopic, onSubTopicSelect, onStartQuiz, onStartLab }: { id: ModuleId, subTopic?: string, onSubTopicSelect?: (topic: string) => void, onStartQuiz?: () => void, onStartLab?: () => void }) {
  const emptyParams: TransformationParams = { a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 };

  const ExampleBox = ({ title, soal, ditanya, langkah, plotFunc, plotParams, plotScale = 10 }: { title: string, soal: string, ditanya: string, langkah: string[], plotFunc?: string, plotParams?: TransformationParams, plotScale?: number }) => (
    <div className="space-y-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-emerald-50 pb-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-xs shadow-lg">?</div>
        <h4 className="font-black text-emerald-900 text-sm uppercase tracking-tight">{title}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-orange-400">
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-1">Soal:</p>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">{soal}</p>
          </div>
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">Penyelesaian:</p>
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3">
              <p className="text-xs font-bold text-emerald-900 italic">Ditanya: <span className="font-medium text-slate-700 not-italic">{ditanya}</span></p>
              <div className="space-y-2">
                {langkah.map((l, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-[11px] font-black text-emerald-600 bg-white w-5 h-5 rounded-md flex items-center justify-center border border-emerald-100 shrink-0">{i + 1}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {plotFunc && plotParams && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Visualisasi Transformasi:</p>
            <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 grow h-full min-h-[180px]">
              <MiniPlotter title="Hasil Transformasi" func={plotFunc} params={plotParams} scale={plotScale} />
            </div>
            <p className="text-[9px] text-slate-400 italic px-2 text-center">Garis putus-putus adalah fungsi asal f(x)</p>
          </div>
        )}
      </div>
    </div>
  );

  switch (id) {
    case 'translasi':
      if (subTopic === 'linear') {
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-emerald-900 border-b-4 border-emerald-100 pb-2 uppercase tracking-tighter">Sub-Materi: Translasi Fungsi Linear</h3>
              <p className="text-sm text-slate-600 leading-relaxed italic bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                Fungsi linear <code className="font-bold">f(x) = ax + b</code> akan tetap menjadi garis lurus dengan kemiringan yang sama setelah ditranslasikan. Pergeseran ke kanan/kiri mengubah konstanta di dalam kurung <code className="font-bold font-mono">(x-c)</code>, sedangkan pergeseran atas/bawah menambah konstanta di luar fungsi <code className="font-bold font-mono">+d</code>.
              </p>
            </div>
            
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Pergeseran Vertikal (Ke Atas)"
                soal="Diketahui fungsi linear f(x) = 3x - 1. Tentukan persamaan bayangan jika digeser ke atas sejauh 5 satuan!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Identifikasi pergeseran: Ke atas 5 satuan berarti d = 5.",
                  "Gunakan rumus: g(x) = f(x) + d.",
                  "Substitusi: g(x) = (3x - 1) + 5.",
                  "Sederhanakan: g(x) = 3x + 4."
                ]}
                plotFunc="3x-1"
                plotParams={{...emptyParams, d: 5}}
              />

              <ExampleBox 
                title="Contoh 2: Pergeseran Horizontal (Ke Kiri)"
                soal="Diketahui fungsi f(x) = 2x + 4. Tentukan bayangannya jika digeser sejauh 3 satuan ke kiri!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Ke kiri 3 satuan berarti c = -3.",
                  "Rumus: g(x) = f(x - c) → g(x) = f(x - (-3)) = f(x + 3).",
                  "Substitusi: g(x) = 2(x + 3) + 4.",
                  "Jabarkan: g(x) = 2x + 6 + 4 = 2x + 10."
                ]}
                plotFunc="2x+4"
                plotParams={{...emptyParams, c: -3}}
              />

              <ExampleBox 
                title="Contoh 3: Kombinasi Kanan dan Bawah"
                soal="Fungsi f(x) = x - 2 digeser 4 satuan ke kanan dan 1 satuan ke bawah. Tentukan hasilnya!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Kanan 4 (c = 4), Bawah 1 (d = -1).",
                  "Rumus: g(x) = f(x - 4) - 1.",
                  "Substitusi: g(x) = (x - 4 - 2) - 1.",
                  "Sederhanakan: g(x) = x - 7."
                ]}
                plotFunc="x-2"
                plotParams={{...emptyParams, c: 4, d: -1}}
              />

              <ExampleBox 
                title="Contoh 4: Translasi oleh Matriks T(a, b)"
                soal="Tentukan bayangan garis y = 5x + 2 oleh translasi T(2, 3)!"
                ditanya="Persamaan garis bayangan."
                langkah={[
                  "Translasi T(2, 3) berarti c = 2 dan d = 3.",
                  "Rumus: y - d = f(x - c) atau g(x) = f(x - 2) + 3.",
                  "Masukkan ke persamaan: g(x) = 5(x - 2) + 2 + 3.",
                  "Sederhanakan: g(x) = 5x - 10 + 5 = 5x - 5."
                ]}
                plotFunc="5x+2"
                plotParams={{...emptyParams, c: 2, d: 3}}
              />

              <ExampleBox 
                title="Contoh 5: Menentukan Pergeseran"
                soal="Fungsi f(x) = 2x ditranslasikan menjadi g(x) = 2x - 6. Jika g(x) dianggap hasil pergeseran horizontal saja, ke mana dan sejauh mana fungsi tersebut bergeser?"
                ditanya="Arah dan besar pergeseran c."
                langkah={[
                  "Bentuk g(x) harus diubah ke f(x - c): 2x - 6 = 2(x - 3).",
                  "Maka f(x - 3) berarti c = 3.",
                  "Jawaban: Fungsi bergeser ke KANAN sejauh 3 satuan."
                ]}
                plotFunc="2x"
                plotParams={{...emptyParams, c: 3}}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'kuadrat') {
        return (
          <div className="space-y-12">
             <div className="space-y-4">
              <h3 className="text-2xl font-black text-emerald-900 border-b-4 border-emerald-100 pb-2 uppercase tracking-tighter">Sub-Materi: Translasi Fungsi Kuadrat</h3>
              <p className="text-sm text-slate-600 leading-relaxed italic bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                Pada parabola <code className="font-bold">f(x) = x²</code>, translasi memindahkan titik puncak <code className="font-bold">(0,0)</code> ke koordinat baru <code className="font-bold">(c, d)</code>. Bentuk umum hasil translasi adalah <code className="font-bold">g(x) = (x - c)² + d</code>.
              </p>
            </div>

            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Pergeseran Standar"
                soal="Tentukan bayangan f(x) = x² jika digeser 3 satuan ke kanan dan 2 satuan ke atas!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Kanan 3 (c = 3), Atas 2 (d = 2).",
                  "Rumus: g(x) = (x - 3)² + 2.",
                  "Penyelesaian: g(x) = x² - 6x + 9 + 2 = x² - 6x + 11."
                ]}
                plotFunc="x^2"
                plotParams={{...emptyParams, c: 3, d: 2}}
                plotScale={15}
              />

              <ExampleBox 
                title="Contoh 2: Pergeseran Parabola Kompleks"
                soal="Fungsi f(x) = x² + 4x + 3 digeser sejauh T(2, -1). Tentukan persamaan barunya!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "c = 2, d = -1. Rumus: g(x) = f(x - 2) - 1.",
                  "Substitusi: g(x) = (x - 2)² + 4(x - 2) + 3 - 1.",
                  "Jabarkan: g(x) = (x² - 4x + 4) + (4x - 8) + 2.",
                  "Sederhanakan: g(x) = x² - 2."
                ]}
                plotFunc="x^2+4x+3"
                plotParams={{...emptyParams, c: 2, d: -1}}
                plotScale={15}
              />

              <ExampleBox 
                title="Contoh 3: Menemukan Bayangan Titik Puncak"
                soal="Jika f(x) = (x + 1)² memiliki puncak di (-1, 0), di mana titik puncak bayangannya setelah digerak 5 satuan ke kanan?"
                ditanya="Koordinat puncak g(x)."
                langkah={[
                  "Pergeseran ke kanan 5 berarti c = 5.",
                  "Puncak awal (-1, 0) ditambah (5, 0).",
                  "Hasil: (-1 + 5, 0 + 0) = (4, 0).",
                  "Persamaan g(x) = (x - 4)²."
                ]}
                plotFunc="(x+1)^2"
                plotParams={{...emptyParams, c: 5}}
                plotScale={15}
              />

              <ExampleBox 
                title="Contoh 4: Translasi Terbalik"
                soal="Sebuah grafik g(x) = x² - 4 adalah hasil translasi f(x) = x² sejauh d satuan. Tentukan nilai d dan arahnya!"
                ditanya="Nilai d dan arah pergeseran."
                langkah={[
                  "Bandingkan f(x) = x² dan g(x) = x² - 4.",
                  "Sesuai rumus f(x) + d, maka d = -4.",
                  "Jawaban: Bergeser ke BAWAH sejauh 4 satuan."
                ]}
                plotFunc="x^2"
                plotParams={{...emptyParams, d: -4}}
                plotScale={15}
              />

              <ExampleBox 
                title="Contoh 5: Translasi Fungsi f(x) = -x²"
                soal="Bayangan f(x) = -x² oleh pergeseran 2 ke kiri dan 3 ke atas adalah?"
                ditanya="Persamaan g(x)."
                langkah={[
                  "c = -2, d = 3. Rumus: g(x) = f(x + 2) + 3.",
                  "Substitusi: g(x) = -(x + 2)² + 3.",
                  "Jabarkan: g(x) = -(x² + 4x + 4) + 3.",
                  "Hasil: g(x) = -x² - 4x - 1."
                ]}
                plotFunc="-x^2"
                plotParams={{...emptyParams, c: -2, d: 3}}
                plotScale={15}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'eksponensial') {
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-emerald-900 border-b-4 border-emerald-100 pb-2 uppercase tracking-tighter">Sub-Materi: Translasi Fungsi Eksponensial</h3>
              <p className="text-sm text-slate-600 leading-relaxed italic bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                Translasi pada fungsi eksponensial <code className="font-bold">f(x) = a^x</code> sangat penting untuk melihat perubahan asimtot. Pergeseran vertikal <code className="font-bold">d</code> akan mengubah garis asimtot horizontal dari <code className="font-bold">y = 0</code> menjadi <code className="font-bold">y = d</code>.
              </p>
            </div>

            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Perubahan Asimtot (a > 1)"
                soal="Tentukan bayangan y = 2^x jika digeser 3 satuan ke atas!"
                ditanya="Persamaan bayangan dan asimtot baru."
                langkah={[
                  "Atas 3 berarti d = 3.",
                  "Bentuk baru: y' = 2^x + 3.",
                  "Asimtot horizontal bergeser dari y = 0 menjadi y = 3."
                ]}
                plotFunc="2^x"
                plotParams={{...emptyParams, d: 3}}
              />

              <ExampleBox 
                title="Contoh 2: Pergeseran Kanan (0 < a < 1)"
                soal="Grafik y = (1/2)^x digeser sejauh 2 satuan ke kanan. Tentukan persamaannya!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Kanan 2 berarti c = 2.",
                  "Rumus: g(x) = (1/2)^(x - 2).",
                  "Hasil ini sama dengan 2^{-(x-2)} atau 2^{2-x}."
                ]}
                plotFunc="(1/2)^x"
                plotParams={{...emptyParams, c: 2}}
              />

              <ExampleBox 
                title="Contoh 3: Translasi T(-1, -4)"
                soal="Tentukan hasil translasi f(x) = 3^x oleh matriks T(-1, -4)!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "c = -1, d = -4.",
                  "Rumus: g(x) = 3^(x + 1) - 4.",
                  "Grafik bergeser 1 ke kiri dan 4 ke bawah."
                ]}
                plotFunc="3^x"
                plotParams={{...emptyParams, c: -1, d: -4}}
              />

              <ExampleBox 
                title="Contoh 4: Kombinasi Eksponen"
                soal="Fungsi f(x) = 5^x digeser ke kanan 2 satuan lalu ke atas 1 satuan. Tentukan titik potong sumbu Y bayangannya!"
                ditanya="Titik potong sumbu Y (saat x = 0)."
                langkah={[
                  "Persamaan bayangan: g(x) = 5^(x - 2) + 1.",
                  "Cari g(0): 5^(0 - 2) + 1 = 5^{-2} + 1.",
                  "Hitung: 1/25 + 1 = 1.04.",
                  "Titik potong: (0, 1.04)."
                ]}
                plotFunc="5^x"
                plotParams={{...emptyParams, c: 2, d: 1}}
              />

              <ExampleBox 
                title="Contoh 5: Menentukan Aturan Geser"
                soal="Jika y = 2^x berubah menjadi y = 2^{x+3}, ke arah mana grafik bergeser?"
                ditanya="Arah dan besar pergeseran."
                langkah={[
                  "Bentuk x + 3 sesuai dengan x - (-3), maka c = -3.",
                  "Artinya grafik bergeser ke KIRI sejauh 3 satuan."
                ]}
                plotFunc="2^x"
                plotParams={{...emptyParams, c: -3}}
              />
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-12">
          <section className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24" />
            </div>
            <h3 className="text-2xl font-black text-emerald-900 flex items-center gap-2 mb-4 uppercase tracking-tight">
              <MapIcon className="w-6 h-6 text-orange-500" /> Penjelasan Utama: Translasi
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
              Translasi adalah jenis transformasi yang memindahkan setiap titik pada grafik fungsi sejauh jarak tetap dalam arah yang ditentukan. Secara visual, grafik hanya "bergeser" tanpa berputar atau berubah ukuran.
            </p>
            
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-inner space-y-4">
              <p className="text-xs font-black uppercase text-emerald-600 tracking-widest">Rumus Translasional:</p>
              <div className="flex justify-center items-center gap-4 py-2">
                <div className="text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Horizontal</span>
                  <code className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">x - c</code>
                </div>
                <div className="text-2xl font-light text-slate-300">+</div>
                <div className="text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Vertikal</span>
                  <code className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">d</code>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic text-center">
                Ingat: Pergeseran ke <span className="font-bold underline">Kanan</span> berarti nilai <code className="font-bold text-slate-800">c</code> positif (rumus menjadi <code className="font-bold">x - c</code>).
              </p>
            </div>
          </section>

          <div className="space-y-8">
            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight border-l-4 border-orange-500 pl-4">Contoh Soal Pengantar</h4>
            
            <ExampleBox 
              title="Contoh 1: Pergeseran Titik"
              soal="Sebuah grafik y = f(x) melalui titik (2, 5). Jika grafik ini digeser 3 satuan ke kanan dan 4 satuan ke bawah, di titik mana koordinat (2, 5) akan berpindah?"
              ditanya="Koordinat baru (x', y')."
              langkah={[
                "Translasi ke kanan 3 berarti x' = x + 3.",
                "Translasi ke bawah 4 berarti y' = y - 4.",
                "Titik asal: (2, 5).",
                "Hitung: x' = 2 + 3 = 5, y' = 5 - 4 = 1.",
                "Koordinat baru adalah (5, 1)."
              ]}
            />

            <ExampleBox 
              title="Contoh 2: Translasi Fungsi Dasar"
              soal="Tentukan hasil translasi f(x) = x oleh pergeseran T(2, 3)!"
              ditanya="Persamaan bayangan g(x)."
              langkah={[
                "Rumus: g(x) = f(x - c) + d.",
                "Gunakan c = 2 dan d = 3.",
                "Substitusi: g(x) = (x - 2) + 3.",
                "Penyelesaian: g(x) = x + 1."
              ]}
            />

            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                 <Info className="w-5 h-5 text-amber-600" />
                 <h5 className="font-black text-amber-900 uppercase text-xs">Petunjuk Navigasi</h5>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Gunakan tombol di bagian atas halaman (<b>Linear, Kuadrat, Eksponen</b>) untuk melihat 5 contoh soal mendalam untuk masing-masing jenis fungsi!
              </p>
            </div>
          </div>
        </div>
      );


    case 'refleksi':
      if (subTopic === 'ref-x') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-blue-900 border-b-2 border-blue-100 pb-2 uppercase tracking-tighter">Sub-Materi: Refleksi Terhadap Sumbu X</h3>
            <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
              Pencerminan terhadap sumbu X akan mengubah tanda nilai y. Rumus: (x, y) → (x, -y) atau g(x) = -f(x).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Bayangan Garis"
                soal="Tentukan bayangan f(x) = 3x + 2 terhadap sumbu X!"
                ditanya="Persamaan g(x)."
                langkah={["Rumus: g(x) = -f(x).", "g(x) = -(3x + 2).", "Jawaban: g(x) = -3x - 2."]}
                plotFunc="3x+2" plotParams={{...emptyParams, reflectX: true}}
              />
              <ExampleBox 
                title="Contoh 2: Bayangan Parabola"
                soal="Bayangan f(x) = x² - 4 terhadap sumbu X adalah?"
                ditanya="Persamaan g(x)."
                langkah={["Rumus: g(x) = -f(x).", "g(x) = -(x² - 4).", "Jawaban: g(x) = -x² + 4."]}
                plotFunc="x^2-4" plotParams={{...emptyParams, reflectX: true}} plotScale={15}
              />
              <ExampleBox 
                title="Contoh 3: Bayangan Kurva Eksponen"
                soal="Tentukan hasil refleksi y = 2^x terhadap sumbu X!"
                ditanya="Persamaan g(x)."
                langkah={["Rumus: g(x) = -f(x).", "Jawaban: y = -2^x."]}
                plotFunc="2^x" plotParams={{...emptyParams, reflectX: true}}
              />
              <ExampleBox 
                title="Contoh 4: Titik Puncak Bayangan"
                soal="Puncak parabola f(x) adalah (1, 5). Di mana puncaknya setelah refleksi sumbu X?"
                ditanya="Koordinat (x', y')."
                langkah={["Aturan sumbu X: (x, y) → (x, -y).", "(1, 5) → (1, -5).", "Jawaban: (1, -5)."]}
                plotFunc="(x-1)^2+5" plotParams={{...emptyParams, reflectX: true}} plotScale={15}
              />
              <ExampleBox 
                title="Contoh 5: Garis Mendatar"
                soal="Bayangan garis y = 4 terhadap sumbu X adalah?"
                ditanya="Persamaan g(x)."
                langkah={["f(x) = 4.", "Pencerminan: g(x) = -f(x).", "Jawaban: y = -4."]}
                plotFunc="4" plotParams={{...emptyParams, reflectX: true}}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'ref-y') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-blue-900 border-b-2 border-blue-100 pb-2 uppercase tracking-tighter">Sub-Materi: Refleksi Terhadap Sumbu Y</h3>
            <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
              Pencerminan terhadap sumbu Y akan mengubah tanda nilai x. Rumus: (x, y) → (-x, y) atau g(x) = f(-x).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Bayangan Garis"
                soal="Bayangan f(x) = 2x - 5 terhadap sumbu Y adalah?"
                ditanya="Persamaan g(x)."
                langkah={["Rumus: g(x) = f(-x).", "g(x) = 2(-x) - 5.", "Jawaban: g(x) = -2x - 5."]}
                plotFunc="2x-5" plotParams={{...emptyParams, reflectY: true}}
              />
              <ExampleBox 
                title="Contoh 2: Bayangan Parabola"
                soal="Tentukan hasil refleksi f(x) = (x-3)² terhadap sumbu Y!"
                ditanya="Persamaan g(x)."
                langkah={["Rumus: g(x) = f(-x).", "g(x) = (-x - 3)² = (x + 3)².", "Jawaban: g(x) = (x + 3)²."]}
                plotFunc="(x-3)^2" plotParams={{...emptyParams, reflectY: true}} plotScale={15}
              />
              <ExampleBox 
                title="Contoh 3: Bayangan Kurva Eksponen"
                soal="Refleksi pertumbuhan y = 3^x terhadap sumbu Y menghasilkan?"
                ditanya="Persamaan g(x)."
                langkah={["y = 3^{-x} atau y = (1/3)^x.", "Jawaban: y = (1/3)^x."]}
                plotFunc="3^x" plotParams={{...emptyParams, reflectY: true}}
              />
              <ExampleBox 
                title="Contoh 4: Titik Potong Sumbu X"
                soal="f(x) memotong sumbu X di (4, 0). Di mana titik potong bayangannya setelah refleksi sumbu Y?"
                ditanya="Titik potong baru."
                langkah={["Aturan sumbu Y: (x, y) → (-x, y).", "(4, 0) → (-4, 0).", "Jawaban: (-4, 0)."]}
                plotFunc="x-4" plotParams={{...emptyParams, reflectY: true}}
              />
              <ExampleBox 
                title="Contoh 5: Kurva Simetris"
                soal="Apa bayangan f(x) = x² terhadap sumbu Y?"
                ditanya="Analisis grafik."
                langkah={["g(x) = (-x)² = x².", "Grafik tetap sama karena simetris (fungsi genap).", "Jawaban: g(x) = x²."]}
                plotFunc="x^2" plotParams={{...emptyParams, reflectY: true}} plotScale={15}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'ref-o') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-blue-900 border-b-2 border-blue-100 pb-2 uppercase tracking-tighter">Sub-Materi: Refleksi Terhadap Titik O(0,0)</h3>
            <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
              Pencerminan terhadap titik asal setara dengan rotasi 180°. Rumus: (x, y) → (-x, -y) atau g(x) = -f(-x).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Bayangan Garis"
                soal="Tentukan bayangan f(x) = x + 4 terhadap titik O(0,0)!"
                ditanya="Persamaan g(x)."
                langkah={["Langkah 1 (Sumbu Y): f(-x) = -x + 4.", "Langkah 2 (Sumbu X): -f(-x) = -(-x + 4).", "Jawaban: g(x) = x - 4."]}
                plotFunc="x+4" plotParams={{...emptyParams, reflectX: true, reflectY: true}}
              />
              <ExampleBox 
                title="Contoh 2: Bayangan Parabola"
                soal="Bayangan y = x² - 2 terhadap titik pusat adalah?"
                ditanya="Persamaan g(x)."
                langkah={["g(x) = -((-x)² - 2).", "g(x) = -(x² - 2) = -x² + 2.", "Jawaban: g(x) = -x² + 2."]}
                plotFunc="x^2-2" plotParams={{...emptyParams, reflectX: true, reflectY: true}} plotScale={15}
              />
              <ExampleBox 
                title="Contoh 3: Refleksi Titik"
                soal="Refleksi titik (-3, 7) terhadap O(0,0) adalah..."
                ditanya="Koordinat baru."
                langkah={["Aturan: (-x, -y).", "-(-3) = 3 dan -(7) = -7.", "Jawaban: (3, -7)."]}
                plotFunc="x+10" plotParams={{...emptyParams, reflectX: true, reflectY: true}}
              />
              <ExampleBox 
                title="Contoh 4: Bayangan Kurva Eksponen"
                soal="Bayangan y = 2^x terhadap titik O(0,0) adalah?"
                ditanya="Persamaan g(x)."
                langkah={["y = -(2^{-x}) atau y = -(1/2)^x.", "Jawaban: y = -(1/2)^x."]}
                plotFunc="2^x" plotParams={{...emptyParams, reflectX: true, reflectY: true}}
              />
              <ExampleBox 
                title="Contoh 5: Diagonal Melalui Pusat"
                soal="Apa bayangan y = x terhadap titik O(0,0)?"
                ditanya="Analisis kemiringan."
                langkah={["g(x) = -(-x) = x.", "Grafik tetap sama karena melewati titik pusat.", "Jawaban: y = x."]}
                plotFunc="x" plotParams={{...emptyParams, reflectX: true, reflectY: true}}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'ref-yx') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-blue-900 border-b-2 border-blue-100 pb-2 uppercase tracking-tighter">Sub-Materi: Refleksi Terhadap Garis y = x</h3>
            <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
              Pencerminan terhadap y = x berarti menukar posisi x dan y. Hasilnya adalah fungsi invers. Rumus: (x, y) → (y, x).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Bayangan Garis"
                soal="Tentukan bayangan f(x) = 2x + 6 terhadap garis y = x!"
                ditanya="Persamaan g(x)."
                langkah={["Ganti y dengan x dan x dengan y: x = 2y + 6.", "Selesaikan untuk y: 2y = x - 6.", "Hasil: y = 0.5x - 3."]}
                plotFunc="0.5x-3" plotParams={emptyParams}
              />
              <ExampleBox 
                title="Contoh 2: Perubahan Koordinat"
                soal="Refleksi titik A(2, -5) terhadap y = x adalah..."
                ditanya="Titik A'."
                langkah={["Tukar posisi x dan y.", "(2, -5) menjadi (-5, 2).", "Jawaban: (-5, 2)."]}
              />
              <ExampleBox 
                title="Contoh 3: Bayangan Kurva Eksponen (Invers)"
                soal="Bayangan y = 2^x terhadap garis y = x adalah?"
                ditanya="Fungsi Logaritma."
                langkah={["Ganti variabel: x = 2^y.", "Gunakan logaritma: y = ²log x.", "Jawaban: y = log2(x)."]}
                plotFunc="log2(x)" plotParams={emptyParams}
              />
              <ExampleBox 
                title="Contoh 4: Garis Tegak Lurus"
                soal="Tentukan refleksi y = -x + 4 terhadap y = x!"
                ditanya="Persamaan g(x)."
                langkah={["x = -y + 4.", "y = -x + 4.", "Grafik tetap sama karena tegak lurus dengan cermin.", "Jawaban: y = -x + 4."]}
                plotFunc="-x+4" plotParams={emptyParams}
              />
              <ExampleBox 
                title="Contoh 5: Bayangan Parabola (Akar)"
                soal="Tentukan bayangan y = x² untuk x ≥ 0 terhadap y = x!"
                ditanya="Akar kuadrat."
                langkah={["Ganti variabel: x = y².", "y = √x.", "Jawaban: y = sqrt(x)."]}
                plotFunc="sqrt(x)" plotParams={emptyParams} plotScale={15}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'ref-ynx') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-blue-900 border-b-2 border-blue-100 pb-2 uppercase tracking-tighter">Sub-Materi: Refleksi Terhadap Garis y = -x</h3>
            <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
              Pencerminan terhadap y = -x berarti menukar x dan y serta mengubah tanda keduanya. Rumus: (x, y) → (-y, -x).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Bayangan Garis"
                soal="Tentukan bayangan y = 3x - 1 terhadap garis y = -x!"
                ditanya="Persamaan g(x)."
                langkah={["Ganti x dengan -y dan y dengan -x: -x = 3(-y) - 1.", "-x = -3y - 1.", "3y = x - 1 → y = (x - 1)/3.", "Jawaban: y = 1/3 x - 1/3."]}
                plotFunc="1/3*x-1/3" plotParams={emptyParams}
              />
              <ExampleBox 
                title="Contoh 2: Simetri Koordinat"
                soal="Titik P(-2, 4) dicerminkan terhadap y = -x. Hasilnya?"
                ditanya="P'(-y, -x)."
                langkah={["Tukar dan ubah tanda.", "x' = -(4) = -4.", "y' = -(-2) = 2.", "Jawaban: (-4, 2)."]}
              />
              <ExampleBox 
                title="Contoh 3: Bayangan Parabola"
                soal="Tentukan bayangan y = x² terhadap y = -x!"
                ditanya="Analisis x = -y²."
                langkah={["Substitusi: -x = (-y)².", "-x = y².", "Penyelesaian untuk y: y = ±√(-x).", "Bayangan parabola terbuka ke kiri."]}
              />
              <ExampleBox 
                title="Contoh 4: Garis Horizontal"
                soal="Cermin y = 5 terhadap garis y = -x adalah?"
                ditanya="Garis Vertikal."
                langkah={["Ganti y dengan -x: -x = 5.", "x = -5.", "Jawaban: Garis vertikal x = -5."]}
              />
              <ExampleBox 
                title="Contoh 5: Kemiringan Negatif"
                soal="y = -2x + 4 dicerminkan ke y = -x menjadi?"
                ditanya="Persamaan g(x)."
                langkah={["Substitusi: -x = -2(-y) + 4.", "-x = 2y + 4.", "2y = -x - 4 → y = -0.5x - 2.", "Jawaban: y = -0.5x - 2."]}
                plotFunc="-0.5x-2" plotParams={emptyParams}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'ref-xh') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-blue-900 border-b-2 border-blue-100 pb-2 uppercase tracking-tighter">Sub-Materi: Refleksi Terhadap Garis x = h</h3>
            <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
              Pencerminan terhadap garis vertikal x = h. Rumus: (x, y) → (2h - x, y) atau g(x) = f(2h - x).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Bayangan Garis"
                soal="Bayangan f(x) = 2x + 1 terhadap garis x = 3 adalah?"
                ditanya="Persamaan g(x)."
                langkah={["Aturan x → 2(3) - x = 6 - x.", "g(x) = 2(6 - x) + 1.", "g(x) = 12 - 2x + 1.", "Jawaban: g(x) = -2x + 13."]}
                plotFunc="2x+1" plotParams={{...emptyParams, reflectY: true, c: 6}}
              />
              <ExampleBox 
                title="Contoh 2: Bayangan Parabola"
                soal="Tentukan hasil refleksi y = x² terhadap garis x = 2!"
                ditanya="Persamaan g(x)."
                langkah={["Ganti x dengan 2(2) - x = 4 - x.", "y = (4 - x)² = (x - 4)².", "Jawaban: y = (x - 4)²."]}
                plotFunc="x^2" plotParams={{...emptyParams, reflectY: true, c: 4}} plotScale={15}
              />
              <ExampleBox 
                title="Contoh 3: Kurva Tetap (Statis)"
                soal="Jika titik (2, 5) dicerminkan terhadap x = 2, di mana bayangannya?"
                ditanya="Analisis posisi."
                langkah={["Substitusi: x → 2(2) - 2 = 2.", "Titik tetap (2, 5) karena berada pada garis cermin.", "Jawaban: (2, 5)."]}
              />
              <ExampleBox 
                title="Contoh 4: Bayangan Kurva Eksponen"
                soal="Bayangan y = 2^x terhadap garis x = -1 adalah?"
                ditanya="Persamaan g(x)."
                langkah={["Aturan x → 2(-1) - x = -2 - x.", "y = 2^{-2-x}.", "Jawaban: y = (1/2)^{x+2}."]}
                plotFunc="2^x" plotParams={{...emptyParams, reflectY: true, c: -2}}
              />
              <ExampleBox 
                title="Contoh 5: Mencari Jarak h"
                soal="Titik (4, 1) dicerminkan menjadi (0, 1). Berapa nilai h?"
                ditanya="Garis x = h."
                langkah={["Gunakan rumus x' = 2h - x.", "0 = 2h - 4 → 2h = 4.", "Jawaban: h = 2."]}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'ref-yk') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-blue-900 border-b-2 border-blue-100 pb-2 uppercase tracking-tighter">Sub-Materi: Refleksi Terhadap Garis y = k</h3>
            <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
              Pencerminan terhadap garis horizontal y = k. Rumus: (x, y) → (x, 2k - y) atau g(x) = 2k - f(x).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Bayangan Garis"
                soal="Bayangan f(x) = x + 1 terhadap garis y = 2 adalah?"
                ditanya="Persamaan g(x)."
                langkah={["Rumus: g(x) = 2(2) - f(x) = 4 - (x + 1).", "Sederhanakan: g(x) = 3 - x.", "Jawaban: g(x) = -x + 3."]}
                plotFunc="x+1" plotParams={{...emptyParams, reflectX: true, d: 4}}
              />
              <ExampleBox 
                title="Contoh 2: Bayangan Parabola"
                soal="Tentukan hasil refleksi y = x² terhadap garis y = -1!"
                ditanya="Persamaan g(x)."
                langkah={["g(x) = 2(-1) - x² = -2 - x².", "Jawaban: y = -x² - 2."]}
                plotFunc="x^2" plotParams={{...emptyParams, reflectX: true, d: -2}} plotScale={15}
              />
              <ExampleBox 
                title="Contoh 3: Bayangan Kurva Eksponen"
                soal="Bayangan y = 2^x + 3 terhadap garis y = 1 adalah?"
                ditanya="Persamaan g(x)."
                langkah={["g(x) = 2(1) - (2^x + 3) = 2 - 2^x - 3.", "g(x) = -2^x - 1.", "Jawaban: y = -2^x - 1."]}
                plotFunc="2^x+3" plotParams={{...emptyParams, reflectX: true, d: 2}}
              />
              <ExampleBox 
                title="Contoh 4: Titik Puncak Bayangan"
                soal="Puncak f(x) adalah (0, 4). Direfleksikan ke y = 10. Di mana posisi puncak baru?"
                ditanya="Koordinat y'."
                langkah={["Aturan: y' = 2k - y.", "y' = 2(10) - 4 = 16.", "Jawaban: (0, 16)."]}
              />
              <ExampleBox 
                title="Contoh 5: Menentukan Garis k"
                soal="Garis y = 3 direfleksikan menjadi y = 7 terhadap garis y = k. Berapa k?"
                ditanya="Nilai k."
                langkah={["k = (y + y')/2 = (3 + 7)/2 = 5.", "Jawaban: k = 5."]}
              />
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-12">
          <section className="bg-blue-50 p-8 rounded-[40px] border border-blue-100">
            <h3 className="text-2xl font-black text-blue-900 flex items-center gap-2 mb-4 uppercase tracking-tight">
               <RotateCcw className="w-6 h-6 text-blue-500" /> Penjelasan Utama: Refleksi
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed italic mb-8">
               Refleksi atau pencerminan adalah transformasi yang memindahkan setiap titik pada bidang dengan menggunakan sifat bayangan cermin dari titik-titik yang akan dipindahkan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 { line: 'Sumbu X', formula: '(x, -y)' },
                 { line: 'Sumbu Y', formula: '(-x, y)' },
                 { line: 'Titik Asal O', formula: '(-x, -y)' },
                 { line: 'Garis y = x', formula: '(y, x)' },
                 { line: 'Garis y = -x', formula: '(-y, -x)' },
                 { line: 'Garis x = h', formula: '(2h-x, y)' },
                 { line: 'Garis y = k', formula: '(x, 2k-y)' },
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-blue-800 uppercase">{item.line}</span>
                    <code className="text-sm font-black text-slate-600">{item.formula}</code>
                 </div>
               ))}
            </div>
          </section>
          
          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
               <Info className="w-5 h-5 text-amber-600" />
               <h5 className="font-black text-amber-900 uppercase text-xs">Petunjuk Belajar</h5>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Pilih menu navigasi di atas (<b>Sumbu X, Sumbu Y, dll.</b>) untuk mempelajari aturan pencerminan secara spesifik dengan 5 variasi contoh soal dan grafik visualnya!
            </p>
          </div>
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Pilih jenis refleksi di atas untuk eksplorasi detil.</p>
        </div>
      );

    case 'dilatasi':
      if (subTopic === 'pusatO') {
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-orange-900 border-b-4 border-orange-100 pb-2 uppercase tracking-tighter">Dilatasi terhadap Pusat O(0,0)</h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-orange-50 p-4 rounded-2xl border border-orange-100">
                Pada pusat O(0,0), titik-titik pada grafik akan menjauh atau mendekat langsung dari titik asal. Rumus bayangannya adalah <b>y = k · f(x/k)</b> atau secara sederhana untuk dilatasi vertikal <b>y = k · f(x)</b>.
              </p>
            </div>

            <section className="space-y-8">
              <div className="grid grid-cols-1 gap-10">
                <ExampleBox 
                  title="Contoh 1: Fungsi Linear (Peregangan Vertikal)"
                  soal="Garis f(x) = 3x - 1 didilatasi vertikal dengan faktor skala 2 terhadap pusat O(0,0). Tentukan bayangannya!"
                  ditanya="Persamaan g(x)."
                  langkah={[
                    "Langkah 1: Identifikasi faktor skala k = 2.",
                    "Langkah 2: Gunakan rumus y = k · f(x).",
                    "Langkah 3: Substitusi: g(x) = 2(3x - 1).",
                    "Hasil: g(x) = 6x - 2."
                  ]}
                  plotFunc="3x-1"
                  plotParams={{...emptyParams, a: 2}}
                />
                <ExampleBox 
                  title="Contoh 2: Fungsi Kuadrat (Pusat O(0,0) Murni)"
                  soal="Parabola f(x) = x² + 1 didilatasi pusat O(0,0) faktor k = 2. Tentukan bayangan!"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: Gunakan rumus x' = 2x dan y' = 2y.",
                    "Langkah 2: Substitusi x = x'/2 dan y = y'/2.",
                    "Langkah 3: y/2 = (x/2)² + 1 → y/2 = x²/4 + 1.",
                    "Langkah 4: Kalikan 2: y = 1/2 x² + 2.",
                    "Hasil: g(x) = 1/2 x² + 2."
                  ]}
                  plotFunc="x^2+1"
                  plotParams={{...emptyParams, a: 2, b: 0.5}}
                  plotScale={15}
                />
                <ExampleBox 
                  title="Contoh 3: Fungsi Eksponensial (Perekalan Sumbu X)"
                  soal="Bayangan y = 10^x didilatasi sejajar sumbu X faktor k = 1/2 terhadap pusat O(0,0) adalah?"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: k = 1/2 (horizontal), maka substitusi x dengan x / (1/2) = 2x.",
                    "Langkah 2: g(x) = 10^(2x).",
                    "Langkah 3: 10^(2x) = (10²)^x = 100^x.",
                    "Hasil: y = 100^x."
                  ]}
                  plotFunc="10^x"
                  plotParams={{...emptyParams, b: 2}}
                />
              </div>
            </section>
            
            <button 
              onClick={() => onSubTopicSelect && onSubTopicSelect('')}
              className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 rounded-3xl border border-dashed border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Kembali ke Materi Utama
            </button>
          </div>
        );
      }
      
      if (subTopic === 'pusatA') {
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-orange-900 border-b-4 border-orange-100 pb-2 uppercase tracking-tighter">Dilatasi terhadap Pusat A(a,b)</h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-orange-50 p-4 rounded-2xl border border-orange-100">
                Pusat A(a,b) bertindak sebagai "jangkar" transformasi. Titik-titik akan menjauh atau mendekat ke (a,b). 
                Rumus umum: <b>x' = a + k(x - a)</b> dan <b>y' = b + k(y - b)</b>.
              </p>
            </div>

            <section className="space-y-8">
              <div className="grid grid-cols-1 gap-10">
                <ExampleBox 
                  title="Contoh 1: Garis Linear terhadap Pusat A(2,1)"
                  soal="Garis y = x + 3 didilatasi dengan pusat A(2,1) dan faktor skala 2. Tentukan bayangannya!"
                  ditanya="Hasil g(x)."
                  langkah={[
                    "Langkah 1: x = 2 + (x' - 2)/2 dan y = 1 + (y' - 1)/2.",
                    "Langkah 2: Substitusi ke persamaan y = x + 3.",
                    "Langkah 3: 1 + (y' - 1)/2 = [2 + (x' - 2)/2] + 3.",
                    "Langkah 4: (y' - 1)/2 = (x' - 2)/2 + 4.",
                    "Langkah 5: Kalikan 2: y' - 1 = x' - 2 + 8.",
                    "Hasil: y = x + 7."
                  ]}
                  plotFunc="x+3"
                  plotParams={{...emptyParams, a: 2, b: 0.5, x1: 2, y1: 1}}
                />
                <ExampleBox 
                  title="Contoh 2: Parabola terhadap Pusat A(1,0)"
                  soal="y = x² didilatasi pusat A(1,0) faktor k = 2. Bagaimana persamaannya?"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: Substitusi x = 1 + (x' - 1)/2 dan y = y'/2.",
                    "Langkah 2: y'/2 = [1 + (x' - 1)/2]².",
                    "Langkah 3: y' = 2 [ (x' + 1) / 2 ]² = 2(x' + 1)² / 4.",
                    "Langkah 4: y = 1/2 (x + 1)².",
                    "Hasil: y = 1/2 (x + 1)²."
                  ]}
                  plotFunc="x^2"
                  plotParams={{...emptyParams, a: 2, b: 0.5, x1: 1}}
                  plotScale={15}
                />
                <ExampleBox 
                  title="Contoh 3: Eksponen terhadap Pusat A(0,1)"
                  soal="y = 2^x didilatasi pusat (0,1) faktor 2. Tentukan persamaannya!"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: Titik (0,1) adalah perpotongan sumbu Y.",
                    "Langkah 2: Gunakan rumus y - 1 = 2(2^x - 1).",
                    "Langkah 3: y - 1 = 2 · 2^x - 2.",
                    "Langkah 4: y = 2^(x+1) - 1.",
                    "Hasil: y = 2^(x+1) - 1 atau y = 2 · 2^x - 1."
                  ]}
                  plotFunc="2^x"
                  plotParams={{...emptyParams, a: 2, x1: 0, y1: 1}}
                />
              </div>
            </section>

            <button 
              onClick={() => onSubTopicSelect && onSubTopicSelect('')}
              className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 rounded-3xl border border-dashed border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Kembali ke Materi Utama
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-12">
          <section className="bg-orange-50 p-8 rounded-[40px] border-2 border-orange-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Maximize className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-black text-orange-900 flex items-center gap-4 mb-6 uppercase tracking-tighter">
              <Maximize className="w-8 h-8 text-orange-500" /> Master Class: Dilatasi
            </h3>
            <div className="prose prose-orange max-w-none text-slate-600 text-sm leading-relaxed mb-8">
              <p>
                <b>Dilatasi (Perkalian)</b> adalah transformasi yang mengubah jarak setiap titik terhadap suatu titik pusat dengan faktor pengali tertentu (skala).
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
                <li className="bg-white p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
                   <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                   <span><b>k &gt; 1:</b> Objek diperbesar (Peregangan)</span>
                </li>
                <li className="bg-white p-4 rounded-2xl border border-orange-100 flex items-start gap-3">
                   <div className="w-2 h-2 rounded-full bg-orange-200 mt-1.5 shrink-0" />
                   <span><b>0 &lt; k &lt; 1:</b> Objek diperkecil (Penyusutan)</span>
                </li>
              </ul>
            </div>

            <div className="bg-emerald-950 p-6 rounded-3xl text-white">
               <h5 className="font-black uppercase text-[10px] tracking-widest text-emerald-400 mb-4">Rumus Utama (Vektor/Analitik)</h5>
               <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                     <span className="text-orange-400 font-bold">X' - a</span> = k(X - a)
                  </div>
                  <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                     <span className="text-orange-400 font-bold">Y' - b</span> = k(Y - b)
                  </div>
               </div>
            </div>
          </section>
        </div>
      );

    case 'rotasi':
      if (subTopic === 'pusatO') {
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-indigo-900 border-b-4 border-indigo-100 pb-2 uppercase tracking-tighter">Rotasi terhadap Pusat O(0,0)</h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                Pada rotasi pusat O(0,0), grafik diputar sejauh sudut α mengelilingi titik asal koordinat. 
                Arah positif adalah berlawanan arah jarum jam (CCW).
              </p>
            </div>

            <section className="space-y-8">
              <div className="grid grid-cols-1 gap-10">
                <ExampleBox 
                  title="Contoh 1: Rotasi 90° CCW"
                  soal="Fungsi f(x) = 2x + 1 dirotasikan sejauh 90° terhadap titik pusat O(0,0). Tentukan bayangannya!"
                  ditanya="Persamaan g(x)."
                  langkah={[
                    "Langkah 1: Matriks rotasi 90°: (x', y') = (-y, x).",
                    "Langkah 2: Substitusi x = y' dan y = -x'.",
                    "Langkah 3: Masukkan ke f(x): -x' = 2(y') + 1.",
                    "Langkah 4: Ubah ke x dalam y: x = -2y - 1.",
                    "Hasil: x = -2y - 1."
                  ]}
                  plotFunc="2x+1"
                  plotParams={{...emptyParams, rotation: 90}}
                />
                <ExampleBox 
                  title="Contoh 2: Rotasi 180°"
                  soal="Parabola f(x) = x² dirotasikan sejauh 180° terhadap titik pusat O(0,0). Tentukan bayangannya!"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: Rotasi 180°: x' = -x dan y' = -y.",
                    "Langkah 2: Substitusi y = -y' dan x = -x' ke y = x².",
                    "Langkah 3: -y' = (-x')² → -y = x².",
                    "Hasil: y = -x²."
                  ]}
                  plotFunc="x^2"
                  plotParams={{...emptyParams, rotation: 180}}
                  plotScale={15}
                />
                <ExampleBox 
                  title="Contoh 3: Rotasi 270° CCW"
                  soal="Garis y = 3x - 4 dirotasi 270° terhadap O(0,0). Bagaimana bayangannya?"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: Rotasi 270°: (x', y') = (y, -x).",
                    "Langkah 2: Substitusi x = -y' dan y = x'.",
                    "Langkah 3: x' = 3(-y') - 4.",
                    "Langkah 4: x = -3y - 4 → 3y = -x - 4.",
                    "Hasil: y = -1/3 x - 4/3."
                  ]}
                  plotFunc="3x-4"
                  plotParams={{...emptyParams, rotation: 270}}
                />
                <ExampleBox 
                  title="Contoh 4: Identitas 360°"
                  soal="Garis y = x + 5 dirotasi 360° terhadap pusat O(0,0). Tentukan bayangannya!"
                  ditanya="Hasil g(x)."
                  langkah={[
                    "Langkah 1: Rotasi 360° mengembalikan titik ke posisi semula.",
                    "Langkah 2: (x', y') = (x, y).",
                    "Hasil: y = x + 5."
                  ]}
                  plotFunc="x+5"
                  plotParams={{...emptyParams, rotation: 360}}
                />
              </div>
            </section>
            
            <button 
              onClick={() => onSubTopicSelect && onSubTopicSelect('')}
              className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 rounded-3xl border border-dashed border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Kembali ke Materi Utama
            </button>
          </div>
        );
      }

      if (subTopic === 'pusatA') {
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-indigo-900 border-b-4 border-indigo-100 pb-2 uppercase tracking-tighter">Rotasi terhadap Pusat A(a,b)</h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                Rotasi terhadap pusat (a,b) melibatkan translasi ke titik asal, pemutaran, lalu translasi kembali. 
                Rumus: <b>x' = a + (x-a)cos α - (y-b)sin α</b> dan <b>y' = b + (x-a)sin α + (y-b)cos α</b>.
              </p>
            </div>

            <section className="space-y-8">
              <div className="grid grid-cols-1 gap-10">
                <ExampleBox 
                  title="Contoh 1: Rotasi 90° Pusat A(1,2)"
                  soal="Titik P(3,4) dirotasi 90° terhadap pusat A(1,2). Tentukan bayangannya!"
                  ditanya="P'(x', y')"
                  langkah={[
                    "Langkah 1: a=1, b=2, x=3, y=4, α=90°.",
                    "Langkah 2: x' = 1 + (3-1)cos90 - (4-2)sin90 = 1 + 0 - 2 = -1.",
                    "Langkah 3: y' = 2 + (3-1)sin90 + (4-2)cos90 = 2 + 2 + 0 = 4.",
                    "Hasil: P'(-1, 4)."
                  ]}
                  plotFunc="x+1"
                  plotParams={{...emptyParams, rotation: 90, x1: 1, y1: 2}}
                />
                <ExampleBox 
                  title="Contoh 2: Rotasi 180° Pusat A(0,1)"
                  soal="Garis y = 2x + 1 dirotasi 180° terhadap pusat A(0,1). Tentukan bayangannya!"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: Untuk 180°: x' = 2a - x dan y' = 2b - y.",
                    "Langkah 2: x = -x' dan y = 2 - y'.",
                    "Langkah 3: 2 - y' = 2(-x') + 1.",
                    "Langkah 4: 2 - y = -2x + 1 → y = 2x + 1.",
                    "Hasil: y = 2x + 1 (Garis melewati pusat rotasi)."
                  ]}
                  plotFunc="2x+1"
                  plotParams={{...emptyParams, rotation: 180, x1: 0, y1: 1}}
                />
                <ExampleBox 
                  title="Contoh 3: Rotasi 90° Parabola Pusat A(1,0)"
                  soal="Kurva y = x² dirotasi 90° CCW terhadap pusat A(1,0). Tentukan bayangannya!"
                  ditanya="Hasil g(x)."
                  langkah={[
                    "Langkah 1: x' = 1 - (y-0) = 1-y dan y' = 0 + (x-1) = x-1.",
                    "Langkah 2: Substitusi y = 1 - x' dan x = y' + 1.",
                    "Langkah 3: (1 - x') = (y' + 1)².",
                    "Langkah 4: x = 1 - (y + 1)².",
                    "Hasil: x = 1 - (y + 1)²."
                  ]}
                  plotFunc="x^2"
                  plotParams={{...emptyParams, rotation: 90, x1: 1, y1: 0}}
                  plotScale={15}
                />
                <ExampleBox 
                  title="Contoh 4: Rotasi 270° Garis Pusat A(2,2)"
                  soal="Garis y = x dirotasi 270° terhadap pusat A(2,2). Tentukan bayangannya!"
                  ditanya="g(x)"
                  langkah={[
                    "Langkah 1: x' = 2 + (y-2) = y dan y' = 2 - (x-2) = 4-x.",
                    "Langkah 2: Substitusi y = x' dan x = 4 - y'.",
                    "Hasil: y = 4 - x."
                  ]}
                  plotFunc="x"
                  plotParams={{...emptyParams, rotation: 270, x1: 2, y1: 2}}
                />
              </div>
            </section>

            <button 
              onClick={() => onSubTopicSelect && onSubTopicSelect('')}
              className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 rounded-3xl border border-dashed border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Kembali ke Materi Utama
            </button>
          </div>
        );
      }

      return (
        <div className="space-y-12">
          <section className="bg-indigo-50 p-8 rounded-[40px] border-2 border-indigo-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <RotateCw className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-4 mb-6 uppercase tracking-tighter">
              <RotateCw className="w-8 h-8 text-indigo-500" /> Master Class: Rotasi
            </h3>
            <div className="prose prose-indigo max-w-none text-slate-600 text-sm leading-relaxed mb-8">
              <p>
                <b>Rotasi (Perputaran)</b> adalah transformasi geometri yang memindahkan setiap titik pada bidang dengan memutar sejauh sudut α terhadap sebuah titik pusat. Bayangan hasil rotasi dipengaruhi oleh besar sudut dan arah perputarannya.
              </p>
              
              <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 mb-6">
                <h6 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-indigo-500 rounded-full" /> Rumus Matriks Umum
                </h6>
                <div className="bg-slate-50 p-4 rounded-xl flex justify-center overflow-x-auto">
                   <code className="text-sm font-mono font-bold text-indigo-700 whitespace-nowrap">
                     (x', y') = [cos α  -sin α] [x - a] + [a]<br />
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[sin α   cos α] [y - b]   [b]
                   </code>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic text-center">Di mana (a,b) adalah titik pusat rotasi.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-indigo-100">
                  <h6 className="font-bold text-indigo-900 mb-2">Arah Perputaran</h6>
                  <ul className="text-xs space-y-2 list-none p-0 m-0">
                    <li className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                       <span><b>Sudut Positif:</b> Berlawanan arah jarum jam (CCW).</span>
                    </li>
                    <li className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-slate-300 rounded-full" />
                       <span><b>Sudut Negatif:</b> Searah jarum jam (CW).</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-indigo-100">
                  <h6 className="font-bold text-indigo-900 mb-2 text-indigo-700">Jenis Pusat</h6>
                  <ul className="text-xs space-y-2 list-none p-0 m-0">
                    <li className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                       <span>Pusat O(0,0): Dari titik asal.</span>
                    </li>
                    <li className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-amber-500 rounded-full" />
                       <span>Pusat A(a,b): Dari titik sembarang.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>
      );

    case 'kombinasi':
      if (subTopic === 'komp-translasi') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-amber-900 border-b-2 border-amber-100 pb-2 uppercase tracking-tighter">Komposisi Dua Translasi</h3>
            <p className="text-sm text-slate-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 italic">
              Komposisi dua translasi T₁ diikuti T₂ setara dengan satu translasi T yang merupakan hasil penjumlahan kedua translasi tersebut. T(a, b) + T(c, d) = T(a+c, b+d).
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Penjumlahan Translasi"
                soal="Fungsi f(x) = 2x + 3 ditranslasikan oleh T₁(2, 1) kemudian dilanjutkan dengan T₂(3, 4). Tentukan bayangannya!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Tentukan translasi total: T = T₁ + T₂ = (2+3, 1+4) = (5, 5).",
                  "Gunakan rumus translasi: g(x) = f(x - 5) + 5.",
                  "Substitusi: g(x) = 2(x - 5) + 3 + 5.",
                  "Hasil: g(x) = 2x - 10 + 8 = 2x - 2."
                ]}
                plotFunc="2x+3"
                plotParams={{...emptyParams, c: 5, d: 5}}
              />
              <ExampleBox 
                title="Contoh 2: Translasi Balik"
                soal="Jika y = x² ditranslasikan oleh T₁(a, b) lalu T₂(-1, 3) menghasilkan y = (x-2)² + 5. Tentukan nilai a dan b!"
                ditanya="Nilai a dan b."
                langkah={[
                  "Translasi total adalah T(a-1, b+3).",
                  "Dari hasil y = (x-2)² + 5, diketahui total geser kanan = 2 dan atas = 5.",
                  "a - 1 = 2 → a = 3.",
                  "b + 3 = 5 → b = 2.",
                  "Jawaban: T₁(3, 2)."
                ]}
                plotFunc="x^2"
                plotParams={{...emptyParams, c: 2, d: 5}}
                plotScale={15}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'komp-refleksi') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-amber-900 border-b-2 border-amber-100 pb-2 uppercase tracking-tighter">Komposisi Dua Refleksi</h3>
            <p className="text-sm text-slate-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 italic">
              Dua refleksi terhadap dua garis sejajar setara dengan translasi. Dua refleksi terhadap dua garis yang berpotongan setara dengan rotasi.
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Cermin Sejajar (Translasi)"
                soal="Tentukan bayangan f(x) = x² jika direfleksikan terhadap garis x = 1 lalu x = 4!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Dua refleksi terhadap garis sejajar x=a dan x=b setara dengan translasi sejauh 2(b-a).",
                  "Geser horizontal = 2(4 - 1) = 6 satuan ke kanan.",
                  "Hasil: g(x) = f(x - 6) = (x - 6)²."
                ]}
                plotFunc="x^2"
                plotParams={{...emptyParams, c: 6}}
                plotScale={15}
              />
              <ExampleBox 
                title="Contoh 2: Sumbu X lalu Sumbu Y"
                soal="Bayangan y = 2x + 1 oleh refleksi sumbu X dilanjutkan sumbu Y adalah..."
                ditanya="Persamaan g(x)."
                langkah={[
                  "Refleksi sumbu X: y' = -(2x + 1) = -2x - 1.",
                  "Refleksi sumbu Y: y'' = -2(-x) - 1 = 2x - 1.",
                  "Ini setara dengan refleksi terhadap titik pusat O(0,0)."
                ]}
                plotFunc="2x+1"
                plotParams={{...emptyParams, reflectX: true, reflectY: true}}
              />
            </div>
          </div>
        );
      }
      if (subTopic === 'komp-rotasi') {
        return (
          <div className="space-y-12">
            <h3 className="text-xl font-black text-amber-900 border-b-2 border-amber-100 pb-2 uppercase tracking-tighter">Komposisi Dua Rotasi</h3>
            <p className="text-sm text-slate-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 italic">
              Dua rotasi berurutan dengan pusat yang sama (0,0) setara dengan satu rotasi dengan sudut yang merupakan jumlah dari kedua sudut rotasi tersebut: α + β.
            </p>
            <div className="space-y-10">
              <ExampleBox 
                title="Contoh 1: Rotasi Berurutan"
                soal="f(x) = x + 2 dirotasi 30° dilanjutkan 60° terhadap pusat O(0,0). Tentukan bayangannya!"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Total rotasi = 30° + 60° = 90°.",
                  "Matriks rotasi 90°: (x, y) → (-y, x).",
                  "Substitusi: x = y' dan y = -x'.",
                  "Hasil: -x = y + 2 → x = -y - 2."
                ]}
                plotFunc="x+2"
                plotParams={{...emptyParams, rotation: 90}}
              />
              <ExampleBox 
                title="Contoh 2: Rotasi Berlawanan"
                soal="y = x² dirotasi 45° lalu dirotasi -45° (searah jarum jam). Apa bayangannya?"
                ditanya="Persamaan g(x)."
                langkah={[
                  "Total rotasi = 45° + (-45°) = 0°.",
                  "Rotasi 0° berarti posisi tetap (identitas).",
                  "Hasil: y = x²."
                ]}
                plotFunc="x^2"
                plotParams={{...emptyParams, rotation: 0}}
                plotScale={15}
              />
            </div>
          </div>
        );
      }
      return (
        <div className="space-y-12">
          <section className="bg-amber-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Trophy className="w-24 h-24" />
            </div>
            <h4 className="text-2xl font-black uppercase mb-4">Materi Utama: Komposisi Transformasi</h4>
            <p className="text-sm text-amber-200 mb-6 italic">Menguasai penggabungan dua atau lebih transformasi pada fungsi aljabar (linear, kuadrat, eksponensial).</p>
            <div className="bg-black/30 p-6 rounded-2xl border border-white/10 italic text-sm text-center">
              "Suatu fungsi yang ditransformasikan secara berurutan dapat dinyatakan sebagai komposisi transformasi."
            </div>
          </section>

          <div className="space-y-8">
            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight border-l-4 border-amber-500 pl-4">Konsep Dasar</h4>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
               <p className="text-sm text-slate-600">Jika T₁ dan T₂ adalah dua jenis transformasi, maka komposisi transformasi (T₂ ∘ T₁) berarti melakukan transformasi T₁ terlebih dahulu, kemudian hasilnya dilanjutkan dengan transformasi T₂.</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-black uppercase text-amber-800 mb-1">Translasi</p>
                    <p className="text-xs text-slate-500">Hasilnya berupa penjumlahan vektor geser.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-black uppercase text-blue-800 mb-1">Refleksi</p>
                    <p className="text-xs text-slate-500">Dapat menghasilkan translasi atau rotasi.</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] font-black uppercase text-indigo-800 mb-1">Rotasi</p>
                    <p className="text-xs text-slate-500">Hasilnya berupa penjumlahan sudut putar.</p>
                  </div>
               </div>
            </div>
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Pilih jenis komposisi di atas untuk eksplorasi detil.</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
