import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ThermometerSun, 
  Map as MapIcon, 
  DollarSign, 
  Lightbulb, 
  Image as ImageIcon, 
  BarChart3,
  Info,
  Layers,
  ArrowRightLeft,
  Maximize2,
  Box,
  Plus,
  Trash2,
  Play,
  ArrowDown,
  Sparkles,
  Settings2
} from 'lucide-react';
import { TransformationParams } from '../types';
import { cn } from '../lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface CombinationLabProps {
  params: TransformationParams;
  onUpdateParams: (updates: Partial<TransformationParams>) => void;
}

type ComboScene = 'suhu' | 'peta' | 'kurs' | 'cahaya' | 'editor' | 'ekonomi' | 'sandbox' | 'komposisi';

export const CombinationLab: React.FC<CombinationLabProps> = ({ params, onUpdateParams }) => {
  const [activeScene, setActiveScene] = useState<ComboScene>('suhu');

  const scenes: { id: ComboScene; label: string; icon: React.ReactNode; desc: string; math: string; combo: string }[] = [
    { 
      id: 'suhu', 
      label: 'Suhu Harian', 
      icon: <ThermometerSun className="w-4 h-4" />, 
      desc: 'Pemodelan suhu harian menggunakan fungsi sinusoidal. Translasi vertikal (d) mewakili kenaikan suhu rata-rata, sedangkan dilatasi (a) mewakili rentang suhu ekstrem.',
      math: 'T(t) = a · sin(b(t - c)) + d',
      combo: 'Translasi + Dilatasi'
    },
    { 
      id: 'peta', 
      label: 'Peta Digital', 
      icon: <MapIcon className="w-4 h-4" />, 
      desc: 'Dilatasi digunakan untuk memperbesar (zoom in) atau memperkecil (zoom out) tampilan peta digital tanpa mengubah proporsi objek di dalamnya.',
      math: 'P\'(x,y) = [k · x, k · y]',
      combo: 'Dilatasi + Translasi'
    },
    { 
      id: 'kurs', 
      label: 'Nilai Kurs', 
      icon: <DollarSign className="w-4 h-4" />, 
      desc: 'Grafik nilai tukar sering kali ditransformasikan untuk membandingkan tren pada periode berbeda atau menyesuaikan rentang nilai harga.',
      math: 'C(t) = k · f(t - c) + d',
      combo: 'Translasi + Dilatasi'
    },
    { 
      id: 'cahaya', 
      label: 'Sensor Cahaya', 
      icon: <Lightbulb className="w-4 h-4" />, 
      desc: 'Intensitas cahaya lampu bertambah secara bertahap berdasarkan fungsi yang mengatur intensitas cahaya sesuai dengan waktu atau input sensor.',
      math: 'L(s) = f(s) + d',
      combo: 'Translasi + Dilatasi'
    },
    { 
      id: 'editor', 
      label: 'Edit Gambar', 
      icon: <ImageIcon className="w-4 h-4" />, 
      desc: 'Kombinasi transformasi (dilatasi untuk zoom, refleksi untuk flip, dan translasi untuk crop) digunakan untuk memodifikasi aset visual.',
      math: 'Img\' = T(R(D(Img)))',
      combo: 'Dilatasi + Refleksi'
    },
    { 
      id: 'ekonomi', 
      label: 'Kurva Ekonomi', 
      icon: <BarChart3 className="w-4 h-4" />, 
      desc: 'Perubahan faktor eksternal (seperti pajak atau subsidi) menggeser kurva penawaran/permintaan secara horizontal atau vertikal.',
      math: 'Qd(P) = f(P - c) + d',
      combo: 'Translasi Ganda'
    },
    { 
      id: 'sandbox', 
      label: '3D Sandbox', 
      icon: <Box className="w-4 h-4" />, 
      desc: 'Eksplorasi semua transformasi secara bersamaan dalam ruang 3D. Perhatikan bagaimana urutan operasi mempengaruhi hasil akhir.',
      math: 'P\' = T(R(Ref(D(P))))',
      combo: 'Semua Transformasi'
    },
    { 
      id: 'komposisi', 
      label: 'Komposisi', 
      icon: <Layers className="w-4 h-4" />, 
      desc: 'Terapkan beberapa transformasi secara berurutan. Urutan sangat menentukan hasil akhir (A o B != B o A). Cocok untuk memahami konsep fungsi komposisi.',
      math: '(g o f)(x) = g(f(x))',
      combo: 'Multi-Step'
    },
  ];

  const currentScene = scenes.find(s => s.id === activeScene);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] p-6 gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-5 pointer-events-none" />

      {/* Header & Scene Selector */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-start gap-4 mt-0">
        <div className="flex items-center gap-2 bg-amber-500/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-amber-200">
          <Layers className="w-4 h-4 text-amber-600" />
          <div className="text-left">
            <p className="text-[7px] font-black uppercase text-slate-500 leading-none">Modul</p>
            <p className="text-xs font-bold text-amber-700 leading-none">Kombinasi Lab</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-amber-100 shadow-lg">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all shadow-sm group",
                activeScene === scene.id
                  ? "bg-amber-600 text-white scale-105"
                  : "bg-white text-slate-500 hover:bg-amber-50"
              )}
            >
              {scene.icon}
              <span className="hidden xs:inline">{scene.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 rounded-[40px] bg-slate-900 shadow-2xl relative overflow-hidden border-8 border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeScene === 'suhu' && <SuhuScene key="suhu" params={params} />}
          {activeScene === 'peta' && <PetaComboScene key="peta" params={params} />}
          {activeScene === 'kurs' && <KursScene key="kurs" params={params} />}
          {activeScene === 'cahaya' && <CahayaScene key="cahaya" params={params} />}
          {activeScene === 'editor' && <EditorScene key="editor" params={params} />}
          {activeScene === 'ekonomi' && <EkonomiScene key="ekonomi" params={params} />}
          {activeScene === 'sandbox' && <SandboxScene key="sandbox" params={params} />}
          {activeScene === 'komposisi' && <KomposisiScene key="komposisi" />}
        </AnimatePresence>

        {/* HUD Info */}
        <div className="absolute top-6 right-6 z-10">
           <motion.div 
             key={activeScene}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 max-w-[220px] shadow-2xl"
           >
              <div className="flex items-center justify-between gap-4 mb-1.5">
                 <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none">{currentScene?.label}</p>
                 </div>
                 <div className="px-1.5 py-0.5 bg-amber-500 rounded text-[7px] font-black text-black uppercase">
                    {currentScene?.combo?.split(' ')[0]}
                 </div>
              </div>
              <p className="text-[10px] text-white/70 leading-tight mb-2">
                 {currentScene?.desc}
              </p>
              <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
                 <code className="text-amber-400 text-[9px] font-mono font-bold break-all">{currentScene?.math}</code>
                 <span className="text-[7px] font-bold text-white/30 tracking-widest uppercase">Formula Dasar</span>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

const SuhuScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  const { a, b, c, d } = params;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-10"
    >
      <div className="relative w-full max-w-lg h-64 border-b-2 border-l-2 border-slate-700">
         {/* Simple Sine Visualization */}
         <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
            <path 
              d={`M ${Array.from({ length: 401 }, (_, i) => {
                const x = i;
                const t = i / 20;
                const val = a * Math.sin(b * (t - c)) + d;
                return `${x},${50 - val * 10}`;
              }).join(' L ')}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            {/* Grid lines */}
            <line x1="0" y1="50" x2="400" y2="50" stroke="#475569" strokeDasharray="4" />
         </svg>
         <div className="absolute top-0 right-0 flex items-center gap-2 text-white/40 font-mono text-[10px]">
            <ThermometerSun className="w-4 h-4" />
            <span>Simulasi Suhu</span>
         </div>
      </div>
      <div className="mt-6 flex gap-8">
         <div className="text-center">
            <p className="text-[10px] font-black text-amber-500 uppercase">Amplitudo</p>
            <p className="text-sm font-bold text-white">{a.toFixed(1)}°C</p>
         </div>
         <div className="text-center">
            <p className="text-[10px] font-black text-amber-500 uppercase">Offset</p>
            <p className="text-sm font-bold text-white">{d.toFixed(1)}°C</p>
         </div>
      </div>
    </motion.div>
  );
};

const PetaComboScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  const { a } = params;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative w-64 h-64 overflow-hidden border-4 border-slate-700 shadow-2xl rounded-2xl bg-[#cad2d3]">
         <motion.div 
           animate={{ scale: a }}
           transition={{ type: 'spring', damping: 20 }}
           className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] flex items-center justify-center relative"
         >
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]" />
            <div className="w-20 h-20 bg-emerald-500/40 rounded-full border-4 border-emerald-600 flex items-center justify-center">
               <MapIcon className="w-10 h-10 text-emerald-800" />
            </div>
            <div className="absolute top-10 left-10 w-4 h-4 bg-red-500 rounded-full" />
            <div className="absolute bottom-10 right-20 w-8 h-8 bg-blue-500/20 border-2 border-blue-500 rounded-lg" />
         </motion.div>
         {/* Zoom marker */}
         <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-lg text-[10px] font-bold text-white">
            Zoom: {a.toFixed(1)}x
         </div>
      </div>
    </motion.div>
  );
};

const KursScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  const { a, c, d } = params;
  // Kurs needs to be more dynamic
  const dataPoints = Array.from({ length: 50 }, (_, i) => {
    const x = i * 8;
    // Base noisy signal
    const base = Math.sin(i * 0.4) * 5 + Math.cos(i * 0.9) * 3 + 40;
    return { x, base };
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-10"
    >
      <div className="relative w-full max-w-lg h-64 border-b-2 border-l-2 border-slate-700 bg-black/40 rounded-t-xl overflow-hidden glass-reflection">
         <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent" />
         
         <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible preserve-3d" style={{ perspective: '1000px' }}>
            {/* Grid lines */}
            {Array.from({length: 5}).map((_, i) => (
               <line key={i} x1="0" y1={i * 25} x2="400" y2={i * 25} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}

            {/* Kurs Path */}
            <motion.path 
              animate={{ 
                d: `M ${dataPoints.map((p) => {
                  const val = p.base * a + d * 4;
                  // Shift horizontal with c
                  const shiftX = p.x - c * 5;
                  return `${shiftX},${100 - val}`;
                }).join(' L ')}`
              }}
              transition={{ type: 'spring', damping: 20 }}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            />
            
            {/* Area under the path */}
            <motion.path
                animate={{ 
                  d: `M ${dataPoints.map((p) => {
                    const val = p.base * a + d * 4;
                    const shiftX = p.x - c * 5;
                    return `${shiftX},${100 - val}`;
                  }).join(' L ')} L 400,100 L 0,100 Z`
                }}
                fill="url(#kursGradient)"
                opacity="0.2"
            />
            
            <defs>
              <linearGradient id="kursGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
         </svg>
         
         <div className="absolute left-4 top-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-black font-mono tracking-tighter">BITCOIN / USD</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Market</span>
            </div>
         </div>

         {/* Overlay values */}
         <div className="absolute right-4 top-4 text-right">
            <p className="text-[8px] font-black text-white/40 uppercase">Price Action (ax + d)</p>
            <p className="text-lg font-mono font-black text-white tracking-widest">
               ${((a * 50000) + (d * 1000)).toLocaleString()}
            </p>
         </div>
      </div>

      <div className="mt-8 flex gap-4">
         <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            <div className="px-4 py-2 bg-slate-800 rounded-xl">
                <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">D (Translasi)</p>
                <p className="text-xs font-bold text-white uppercase italic">Shift Market</p>
            </div>
            <div className="px-4 py-2 bg-slate-800 rounded-xl">
                <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">A (Dilatasi)</p>
                <p className="text-xs font-bold text-white uppercase italic">Volatility</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

const CahayaScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  const { d } = params;
  const brightness = Math.max(0, Math.min(100, 50 + d * 10));
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center"
    >
       <div className="relative">
          <motion.div 
            animate={{ 
              backgroundColor: `rgba(251, 191, 36, ${brightness / 100})`,
              boxShadow: `0 0 ${brightness}px rgba(251, 191, 36, ${brightness / 200})`
            }}
            className="w-32 h-32 rounded-full border-4 border-slate-700 flex items-center justify-center"
          >
             <Lightbulb className={cn("w-16 h-16 transition-colors", brightness > 30 ? "text-slate-900" : "text-white/20")} />
          </motion.div>
       </div>
       <div className="mt-8 text-center">
          <p className="text-xl font-black text-white uppercase tracking-tighter">Intensitas: {brightness.toFixed(0)}%</p>
          <p className="text-xs text-amber-500 font-bold uppercase mt-1 tracking-widest">Adjusted by d = {d}</p>
       </div>
    </motion.div>
  );
};

const EditorScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  const { a, reflectX, reflectY } = params;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      <div className="relative group">
         <motion.div 
           animate={{ 
             scale: a, 
             scaleX: reflectY ? -a : a,
             scaleY: reflectX ? -a : a
           }}
           className="w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white"
         >
            <ImageIcon className="w-32 h-32 text-white/50" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
         </motion.div>
         {/* Selection corners */}
         <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm" />
         <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm" />
         <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm" />
         <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-sm" />
      </div>
      <div className="ml-10 space-y-4">
         <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-[10px] font-black text-amber-500 uppercase">Flip Status</p>
            <p className="text-xs text-white">X: {reflectX ? 'ON' : 'OFF'} | Y: {reflectY ? 'ON' : 'OFF'}</p>
         </div>
         <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
            <p className="text-[10px] font-black text-amber-500 uppercase">Scale</p>
            <p className="text-xs text-white">{a.toFixed(1)}x</p>
         </div>
      </div>
    </motion.div>
  );
};

const EkonomiScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  const { c, d } = params;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-10"
    >
      <div className="relative w-full max-w-lg h-64 border-b-2 border-l-2 border-slate-700">
         <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
            {/* Supply Curve (Fixed) */}
            <line x1="20" y1="80" x2="380" y2="20" stroke="#ef4444" strokeWidth="2" />
            <text x="360" y="15" fill="#ef4444" fontSize="10" className="font-bold">Supply (S)</text>
            
            {/* Demand Curve (Shiftable) */}
            <motion.line 
              animate={{ x: c * 20, y: -d * 10 }}
              x1="20" y1="20" x2="380" y2="80" 
              stroke="#fbbf24" 
              strokeWidth="4" 
            />
            <text x="50" y="30" fill="#fbbf24" fontSize="10" className="font-bold">Demand (D)</text>
         </svg>
         <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase">Quantity (Q)</div>
         <div className="absolute top-1/2 left-[-40px] -rotate-90 text-[10px] font-bold text-slate-500 uppercase">Price (P)</div>
      </div>
      <div className="mt-8 flex gap-4">
         <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Shift Factor: {c > 0 ? 'Increase' : c < 0 ? 'Decrease' : 'Stable'}</span>
         </div>
      </div>
    </motion.div>
  );
};

const TransformingObject = ({ params }: { params: TransformationParams }) => {
  const meshRef = React.useRef<THREE.Group>(null);
  const { a, b, c, d, reflectX, reflectY } = params;

  useFrame(() => {
    if (meshRef.current) {
      // Dilation (Scale)
      meshRef.current.scale.lerp(new THREE.Vector3(a, a, a), 0.1);
      
      // Translation (Shift) - Mapping c to X and d to Y
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, c, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, d, 0.1);

      // Rotation
      const targetRotationZ = (b * Math.PI) / 180;
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotationZ, 0.1);

      // Reflection (Simplified visual flip via scale)
      if (reflectX) meshRef.current.scale.y *= -1;
      if (reflectY) meshRef.current.scale.x *= -1;
    }
  });

  return (
    <group ref={meshRef}>
      <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4}>
         <meshStandardMaterial color="#fbbf24" emissive="#b45309" emissiveIntensity={0.2} />
      </RoundedBox>
      <mesh position={[0.6, 0, 0]}>
         <sphereGeometry args={[0.1, 16, 16]} />
         <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
         <sphereGeometry args={[0.1, 16, 16]} />
         <meshStandardMaterial color="#22c55e" />
      </mesh>
    </group>
  );
};

export const SandboxScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
        <gridHelper args={[10, 10, "#475569", "#1e293b"]} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <axesHelper args={[5]} />
        
        <TransformingObject params={params} />

        <OrbitControls enablePan={true} maxDistance={20} minDistance={2} />
      </Canvas>

      <div className="absolute top-10 left-10 flex flex-col gap-2">
         <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Koordinat XYZ</p>
            <div className="space-y-1 font-mono text-[10px]">
               <div className="flex justify-between gap-6 text-white/40">
                  <span>SCALE:</span> <span className="text-white font-bold">{params.a.toFixed(2)}x</span>
               </div>
               <div className="flex justify-between gap-6 text-white/40">
                  <span>TRANS X:</span> <span className="text-white font-bold">{params.c.toFixed(2)}</span>
               </div>
               <div className="flex justify-between gap-6 text-white/40">
                  <span>TRANS Y:</span> <span className="text-white font-bold">{params.d.toFixed(2)}</span>
               </div>
               <div className="flex justify-between gap-6 text-white/40">
                  <span>ROTASI:</span> <span className="text-white font-bold">{params.b}°</span>
               </div>
            </div>
         </div>
         
         <div className="flex gap-2">
            {params.reflectX && <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-[8px] font-black text-red-100 uppercase">Reflect X</div>}
            {params.reflectY && <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-[8px] font-black text-blue-100 uppercase">Reflect Y</div>}
         </div>
      </div>
      
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
         <div className="bg-amber-600/20 backdrop-blur border border-amber-500/30 px-6 py-2 rounded-full uppercase text-[10px] font-black tracking-[0.4em] text-amber-200">
            Laboratorium Sandbox 3D
         </div>
      </div>
    </div>
  );
};

interface Step {
  id: string;
  type: 'translasi' | 'refleksi' | 'dilatasi' | 'rotasi';
  value: any;
}

const KomposisiScene: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', type: 'translasi', value: { x: 2, y: 0 } }
  ]);

  const addStep = (type: Step['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    let value: any = {};
    if (type === 'translasi') value = { x: 1, y: 0 };
    if (type === 'refleksi') value = { axis: 'x' };
    if (type === 'dilatasi') value = { k: 2 };
    if (type === 'rotasi') value = { angle: 90 };
    
    setSteps([...steps, { id, type, value }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStepValue = (id: string, newValue: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, value: { ...s.value, ...newValue } } : s));
  };

  const applyTransform = (point: { x: number, y: number }, step: Step) => {
    const { type, value } = step;
    let newX = point.x;
    let newY = point.y;

    if (type === 'translasi') {
      newX += value.x;
      newY += value.y;
    } else if (type === 'refleksi') {
      if (value.axis === 'x') newY = -newY;
      if (value.axis === 'y') newX = -newX;
      if (value.axis === 'y=x') [newX, newY] = [newY, newX];
      if (value.axis === 'y=-x') [newX, newY] = [-newY, -newX];
    } else if (type === 'dilatasi') {
      newX *= value.k;
      newY *= value.k;
    } else if (type === 'rotasi') {
      const rad = (value.angle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const rx = newX * cos - newY * sin;
      const ry = newX * sin + newY * cos;
      newX = rx;
      newY = ry;
    }

    return { x: newX, y: newY };
  };

  const getPoints = (initialPoint: { x: number, y: number }) => {
    const points = [initialPoint];
    let current = initialPoint;
    for (const step of steps) {
      current = applyTransform(current, step);
      points.push(current);
    }
    return points;
  };

  const gridPoints = [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 1 } // A simple square
  ];

  const transformedShapes = steps.reduce((acc, step, index) => {
    const lastShape = acc[index];
    const nextShape = lastShape.map(p => applyTransform(p, step));
    return [...acc, nextShape];
  }, [gridPoints]);

  return (
    <div className="absolute inset-0 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Interface: Controls */}
      <div className="w-full lg:w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto z-20">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-xs uppercase tracking-widest">Daftar Langkah</h3>
          <span className="px-2 py-0.5 bg-amber-500 rounded text-[8px] font-black text-black uppercase">Urutan Berlaku</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-amber-500 rounded-md flex items-center justify-center text-[10px] font-black text-black">
                      {idx + 1}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">{step.type}</span>
                  </div>
                  <button 
                    onClick={() => removeStep(step.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-md transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>

                {step.type === 'translasi' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-white/40 uppercase">Sumbu X</p>
                      <input 
                        type="number" 
                        value={step.value.x} 
                        onChange={(e) => updateStepValue(step.id, { x: Number(e.target.value) })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-white/40 uppercase">Sumbu Y</p>
                      <input 
                        type="number" 
                        value={step.value.y} 
                        onChange={(e) => updateStepValue(step.id, { y: Number(e.target.value) })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                {step.type === 'refleksi' && (
                  <div className="grid grid-cols-2 gap-1">
                    {['x', 'y', 'y=x', 'y=-x'].map(ax => (
                      <button
                        key={ax}
                        onClick={() => updateStepValue(step.id, { axis: ax })}
                        className={cn(
                          "px-2 py-1 rounded text-[9px] font-bold uppercase transition-all",
                          step.value.axis === ax ? "bg-amber-500 text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
                        )}
                      >
                        {ax}
                      </button>
                    ))}
                  </div>
                )}

                {step.type === 'dilatasi' && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-white/40 uppercase">Faktor Skala (k)</p>
                    <input 
                      type="range" min="0.1" max="3" step="0.1"
                      value={step.value.k} 
                      onChange={(e) => updateStepValue(step.id, { k: Number(e.target.value) })}
                      className="w-full h-1 bg-amber-500/20 appearance-none rounded-lg accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-amber-500 font-mono">
                      <span>0.1x</span>
                      <span>{step.value.k}x</span>
                      <span>3.0x</span>
                    </div>
                  </div>
                )}

                {step.type === 'rotasi' && (
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-white/40 uppercase">Sudut Derajat</p>
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                      {[-180, -90, 90, 180, 270].map(ang => (
                        <button
                          key={ang}
                          onClick={() => updateStepValue(step.id, { angle: ang })}
                          className={cn(
                            "px-2 py-1 rounded text-[9px] font-bold shrink-0 transition-all",
                            step.value.angle === ang ? "bg-amber-500 text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
                          )}
                        >
                          {ang}°
                        </button>
                      ))}
                    </div>
                    <input 
                      type="number" 
                      value={step.value.angle} 
                      onChange={(e) => updateStepValue(step.id, { angle: Number(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto pt-6 border-t border-white/10">
          <button 
            onClick={() => addStep('translasi')}
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white hover:bg-white/10 transition-all uppercase"
          >
            <Plus className="w-3 h-3" /> Translasi
          </button>
          <button 
            onClick={() => addStep('refleksi')}
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white hover:bg-white/10 transition-all uppercase"
          >
            <Plus className="w-3 h-3" /> Refleksi
          </button>
          <button 
            onClick={() => addStep('dilatasi')}
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white hover:bg-white/10 transition-all uppercase"
          >
            <Plus className="w-3 h-3" /> Dilatasi
          </button>
          <button 
            onClick={() => addStep('rotasi')}
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-white hover:bg-white/10 transition-all uppercase"
          >
            <Plus className="w-3 h-3" /> Rotasi
          </button>
        </div>
      </div>

      {/* Right Content: Visualization */}
      <div className="flex-1 relative bg-slate-950 flex flex-col">
        <div className="absolute top-6 left-6 z-10">
           <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Status Komposisi</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[12px] font-bold text-white uppercase tracking-tight italic">
                   {steps.length === 0 ? 'Terapkan langkah' : `${steps.length} Langkah Aktif`}
                 </span>
              </div>
           </div>
        </div>

        <div className="flex-1 relative cursor-crosshair">
          <svg viewBox="-10 -10 20 20" className="w-full h-full">
            {/* Grid */}
            <defs>
              <pattern id="grid" width="1" height="1" patternUnits="userSpaceOnUse">
                <path d="M 1 0 L 0 0 0 1" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.05"/>
              </pattern>
            </defs>
            <rect x="-10" y="-10" width="20" height="20" fill="url(#grid)" />
            <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.05" />
            <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="0.05" />

            {/* Render shapes for each step */}
            {transformedShapes.map((shape, idx) => (
              <motion.path
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: idx === transformedShapes.length - 1 ? 1 : 0.3,
                  stroke: idx === transformedShapes.length - 1 ? '#fbbf24' : '#475569',
                  strokeWidth: idx === transformedShapes.length - 1 ? 0.2 : 0.1,
                  d: `M ${shape.map(p => `${p.x},${-p.y}`).join(' L ')}`
                }}
                className={idx === transformedShapes.length - 1 ? "drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" : ""}
                fill={idx === transformedShapes.length - 1 ? 'rgba(251,191,36,0.1)' : 'transparent'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Trace path of the first point */}
            <polyline
              points={transformedShapes.map(shape => `${shape[0].x},${-shape[0].y}`).join(' ')}
              fill="none"
              stroke="#64748b"
              strokeWidth="0.05"
              strokeDasharray="0.2 0.2"
            />
            {transformedShapes.map((shape, idx) => (
              <circle
                key={idx}
                cx={shape[0].x}
                cy={-shape[0].y}
                r={0.15}
                fill={idx === transformedShapes.length - 1 ? "#fbbf24" : "#475569"}
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm border border-slate-500 opacity-30" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Awal</span>
           </div>
           <div className="flex items-center gap-2">
              <ArrowDown className="w-3 h-3 text-slate-500 rotate-[-90deg]" d="M12 5v14M5 12l7 7 7-7" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Proses</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-amber-500 shadow-[0_0_5px_rgba(251,191,36,0.5)]" />
              <span className="text-[9px] font-bold text-white uppercase tracking-widest">Akhir (Hasil Komposisi)</span>
           </div>
        </div>
      </div>
    </div>
  );
};
