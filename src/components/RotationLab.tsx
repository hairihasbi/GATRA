import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  Wind, 
  Box, 
  CircleDot, 
  Tent,
  Info,
  RefreshCw,
  Compass
} from 'lucide-react';
import { TransformationParams } from '../types';
import { cn } from '../lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface RotationLabProps {
  params: TransformationParams;
  onUpdateParams: (updates: Partial<TransformationParams>) => void;
}

type RotationScene = 'door' | 'ferris' | 'windmill' | 'rubik' | 'merry';

export const RotationLab: React.FC<RotationLabProps> = ({ params, onUpdateParams }) => {
  const [activeScene, setActiveScene] = useState<RotationScene>('door');
  const angle = params.rotation || 0;

  const scenes: { id: RotationScene; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'door', label: 'Pintu Putar', icon: <RotateCw className="w-4 h-4" />, desc: 'Pintu putar hotel bergerak melingkar pada poros tengahnya.' },
    { id: 'ferris', label: 'Bianglala', icon: <CircleDot className="w-4 h-4" />, desc: 'Kabin bianglala berputar mengelilingi pusat roda raksasa.' },
    { id: 'windmill', label: 'Kincir Angin', icon: <Wind className="w-4 h-4" />, desc: 'Baling-baling kincir berputar karena dorongan angin.' },
    { id: 'merry', label: 'Komedi Putar', icon: <Tent className="w-4 h-4" />, desc: 'Wahana permainan yang berputar dengan kecepatan tetap.' },
    { id: 'rubik', label: 'Rubik', icon: <Box className="w-4 h-4" />, desc: 'Memutar lapisan rubik adalah contoh rotasi 90 derajat.' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f4f7fc] p-6 gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      {/* Header & Scene Selector */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-start gap-4 mt-0">
        <div className="flex items-center gap-2 bg-indigo-500/10 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-indigo-200">
          <Compass className="w-4 h-4 text-indigo-500" />
          <div className="text-left">
            <p className="text-[7px] font-black uppercase text-slate-500 leading-none">Sudut (θ)</p>
            <p className="text-xs font-mono font-bold text-indigo-600 leading-none">{angle}°</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-indigo-100 shadow-lg">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all shadow-sm group",
                activeScene === scene.id
                  ? "bg-indigo-600 text-white scale-105"
                  : "bg-white text-slate-500 hover:bg-indigo-50"
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeScene === 'door' && <DoorScene key="door" angle={angle} />}
          {activeScene === 'ferris' && <FerrisScene key="ferris" angle={angle} />}
          {activeScene === 'windmill' && <WindmillScene key="windmill" angle={angle} />}
          {activeScene === 'merry' && <MerryScene key="merry" angle={angle} />}
          {activeScene === 'rubik' && <RubikScene key="rubik" angle={angle} />}
        </AnimatePresence>

        {/* Interactive Rotation Control Dial/Slider */}
        <div className="absolute bottom-6 right-6 z-30 flex flex-col items-center gap-3 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-indigo-100 mb-20">
           <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="40" cy="40" r="36" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                 <circle 
                   cx="40" cy="40" r="36" fill="none" stroke="#4f46e5" strokeWidth="4" 
                   strokeDasharray={2 * Math.PI * 36}
                   strokeDashoffset={2 * Math.PI * 36 * (1 - (angle % 360) / 360)}
                   strokeLinecap="round"
                 />
              </svg>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Sudut</span>
                 <span className="text-sm font-mono font-bold text-indigo-600">{angle}°</span>
              </div>
           </div>

           <input 
             type="range"
             min="0"
             max="360"
             value={angle}
             onChange={(e) => onUpdateParams({ rotation: parseInt(e.target.value) })}
             className="w-32 accent-indigo-600"
           />

           <div className="flex gap-2 w-full">
              {[0, 90, 180, 270].map(val => (
                <button 
                  key={val}
                  onClick={() => onUpdateParams({ rotation: val })}
                  className="flex-1 py-1 text-[8px] font-bold bg-slate-100 text-slate-600 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                   {val}°
                </button>
              ))}
           </div>
        </div>

        {/* HUD Info */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end">
           <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                 <Info className="w-4 h-4 text-indigo-400" />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Apa itu Rotasi?</p>
              </div>
              <p className="text-xs text-white/70 leading-relaxed italic">
                 {scenes.find(s => s.id === activeScene)?.desc}
                 <br />
                 <span className="text-indigo-400 font-bold block mt-1">
                    Rotasi {angle}° berlawanan arah jarum jam terhadap titik pusat (0,0).
                 </span>
              </p>
           </div>
           
           <div className="flex flex-col gap-2 scale-75 origin-bottom-right">
              <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[8px] font-bold text-white/60 tracking-widest uppercase">
                 Matematika: (x, y) → (x cosθ - y sinθ, x sinθ + y cosθ)
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const DoorScene: React.FC<{ angle: number }> = ({ angle }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center p-10"
  >
    <div className="relative w-64 h-64 flex items-center justify-center">
       {/* Door frame */}
       <div className="absolute inset-0 border-4 border-slate-700/50 rounded-full" />
       
       {/* Revolving doors */}
       <motion.div 
         animate={{ rotate: angle }}
         className="relative w-full h-full flex items-center justify-center"
       >
          <div className="absolute w-full h-1 bg-slate-300 shadow-lg" />
          <div className="absolute w-1 h-full bg-slate-300 shadow-lg" />
          <div className="w-4 h-4 bg-slate-100 rounded-full z-10 shadow-xl" />
          
          {/* Glass panels */}
          <div className="absolute top-0 bottom-0 left-1/2 w-32 bg-blue-400/20" />
          <div className="absolute left-0 right-0 top-1/2 h-32 bg-blue-400/20" />
       </motion.div>
    </div>
    <div className="ml-10 text-white/50 space-y-2">
       <p className="text-xs font-black uppercase tracking-widest">Tampak Atas</p>
       <p className="text-[10px] italic">Setiap bilah pintu melambangkan garis yang berotasi pada titik pusat.</p>
    </div>
  </motion.div>
);

const FerrisScene: React.FC<{ angle: number }> = ({ angle }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center"
  >
    <div className="relative w-80 h-80 flex items-center justify-center">
       {/* Structure */}
       <div className="absolute bottom-0 w-32 h-48 border-x-4 border-slate-600 origin-bottom skew-x-[-10deg] translate-x-[-4px]" />
       <div className="absolute bottom-0 w-32 h-48 border-x-4 border-slate-600 origin-bottom skew-x-[10deg] translate-x-[4px]" />
       
       {/* The Wheel */}
       <motion.div 
         animate={{ rotate: angle }}
         className="relative w-64 h-64 border-4 border-white/20 rounded-full flex items-center justify-center"
       >
          {/* Spokes */}
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="absolute w-full h-0.5 bg-white/10" style={{ rotate: `${i * 45}deg` }} />
          ))}
          
          {/* Cabins */}
          {Array.from({length: 8}).map((_, i) => {
            const rot = i * 45;
            return (
              <div 
                key={i} 
                className="absolute" 
                style={{ 
                  transform: `rotate(${rot}deg) translate(128px) rotate(-${rot + angle}deg)` 
                }}
              >
                <div className="w-10 h-10 bg-indigo-500 rounded-lg border-2 border-white flex items-center justify-center shadow-xl">
                   <div className="w-6 h-3 bg-white/30 rounded-full" />
                </div>
              </div>
            );
          })}
       </motion.div>
       
       <div className="w-6 h-6 bg-white rounded-full z-10 shadow-2xl" />
    </div>
  </motion.div>
);

const WindmillScene: React.FC<{ angle: number }> = ({ angle }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center"
  >
    <div className="relative w-64 h-[400px] flex flex-col items-center justify-end">
       {/* Tower */}
       <div className="w-16 h-80 bg-slate-600" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
       
       {/* Blades hub - Centered at the top of the tower */}
       <div className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div 
            animate={{ rotate: angle * 2 }} 
            className="w-96 h-96 relative flex items-center justify-center"
          >
             {Array.from({length: 3}).map((_, i) => (
               <div 
                 key={i} 
                 className="absolute w-6 h-48 bg-gradient-to-t from-white to-slate-200 rounded-full origin-bottom shadow-lg border border-slate-300" 
                 style={{ rotate: `${i * 120}deg`, top: '0px' }} 
               />
             ))}
          </motion.div>
          {/* Hub cap */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-700 rounded-full border-4 border-slate-400 z-10 shadow-xl" />
       </div>
    </div>
  </motion.div>
);

const MerryScene: React.FC<{ angle: number }> = ({ angle }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center pt-20"
  >
    <div className="relative w-96 h-96 flex flex-col items-center justify-center">
       {/* Support Pole */}
       <div className="absolute w-4 h-full bg-slate-700/50 rounded-full" />
       
       {/* Top Roof */}
       <div className="absolute top-0 w-80 h-24 bg-red-600 rounded-t-full z-20 border-b-8 border-yellow-400 shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[repeating-conic-gradient(#fff_0_15deg,#000_15_30deg)]" />
       </div>
       
       {/* Rotating platform */}
       <motion.div 
         animate={{ rotate: angle }}
         className="relative w-80 h-80 rounded-full border-8 border-yellow-500 bg-red-700/30 flex items-center justify-center shadow-inner"
       >
          {/* Decorative lines */}
          <div className="absolute inset-0 border border-white/10 rounded-full scale-75" />
          
          {/* Items */}
          {Array.from({length: 6}).map((_, i) => {
            const rot = i * 60;
            return (
              <div 
                key={i} 
                className="absolute" 
                style={{ transform: `rotate(${rot}deg) translate(120px) rotate(-${rot}deg)` }}
              >
                 <div className="w-1.5 h-64 bg-yellow-400 -translate-y-1/2 rounded-full shadow-sm" />
                 <motion.div 
                   animate={{ y: [10, -30, 10] }}
                   transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                   className="w-14 h-14 bg-white rounded-xl shadow-xl flex items-center justify-center"
                 >
                    <img src={`https://img.icons8.com/color/96/${['horse', 'elephant', 'deer', 'giraffe', 'unicorn', 'cow'][i]}.png`} alt="animal" className="w-10 h-10" />
                 </motion.div>
              </div>
            );
          })}
       </motion.div>
       
       {/* Base */}
       <div className="absolute bottom-0 w-96 h-12 bg-slate-800 rounded-full shadow-2xl border-t-4 border-slate-700" />
    </div>
  </motion.div>
);

const RubikPiece = ({ position }: { position: [number, number, number] }) => {
  const colors = [
    '#B71234', // Right - Red
    '#FF5800', // Left - Orange
    '#FFFFFF', // Up - White
    '#FFD500', // Down - Yellow
    '#009B48', // Front - Green
    '#0046AD', // Back - Blue
  ];

  return (
    <mesh position={position}>
      <boxGeometry args={[0.98, 0.98, 0.98]} />
      {colors.map((color, index) => (
        <meshStandardMaterial 
          key={index} 
          attach={`material-${index}`} 
          color={color} 
          roughness={0.1}
          metalness={0.2}
        />
      ))}
    </mesh>
  );
};

const RubikCube3D = ({ rotationY }: { rotationY: number }) => {
  const groupRef = React.useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smoothly interpolate to the target rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotationY,
        0.1
      );
    }
  });

  const pieces: [number, number, number][] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        pieces.push([x, y, z]);
      }
    }
  }

  return (
    <group ref={groupRef}>
      {pieces.map((pos, index) => (
        <RubikPiece key={index} position={pos} />
      ))}
    </group>
  );
};

const RubikScene: React.FC<{ angle: number }> = ({ angle }) => {
  const snappedAngle = Math.round(angle / 90) * (Math.PI / 2);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0"
    >
      <div className="w-full h-full relative">
        <Canvas>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={40} />
          <ambientLight intensity={1.0} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <RubikCube3D rotationY={snappedAngle} />

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={4} 
            maxDistance={10} 
          />
        </Canvas>

        {/* Floating Labels and Instructions */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
           <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 text-center mb-1">Eksplorasi 3D</p>
              <div className="flex items-center gap-4 text-white text-xs font-bold">
                 <span>Klik & Seret untuk Putar Kamera</span>
                 <div className="w-px h-3 bg-white/20" />
                 <span>Gunakan Slider untuk Rotasi Matematika</span>
              </div>
           </div>
        </div>

        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
           <div className="px-6 py-2 bg-indigo-600/40 backdrop-blur rounded-3xl border border-indigo-500/30 text-center">
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-200">Sudut Terpilih (Snap 90°)</p>
              <p className="text-xl font-mono font-black text-white italic tracking-tighter">
                {(snappedAngle * 180 / Math.PI).toFixed(0)}°
              </p>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
