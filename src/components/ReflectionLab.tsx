import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Waves, Sparkles, Image as ImageIcon, Ruler, HelpCircle, ArrowRightLeft, ArrowUpDown, Box } from 'lucide-react';
import { TransformationParams } from '../types';
import { cn } from '../lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ReflectionLabProps {
  params: TransformationParams;
  onUpdateParams?: (updates: Partial<TransformationParams>) => void;
}

type ReflectScene = 'lake' | 'photography' | 'butterfly' | 'monolith';

export const ReflectionLab: React.FC<ReflectionLabProps> = ({ params, onUpdateParams }) => {
  const [activeScene, setActiveScene] = useState<ReflectScene>('lake');
  const [showGrid, setShowGrid] = useState(true);

  const toggleReflect = (axis: 'X' | 'Y') => {
    if (onUpdateParams) {
      if (axis === 'X') onUpdateParams({ reflectX: !params.reflectX });
      else onUpdateParams({ reflectY: !params.reflectY });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden font-sans select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black/40 pointer-events-none" />

      {/* Tab Selectors */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-2xl flex gap-1 shadow-2xl">
          {[
            { id: 'lake', icon: <Waves className="w-4 h-4" />, label: 'Danau' },
            { id: 'photography', icon: <Camera className="w-4 h-4" />, label: 'Fotografi' },
            { id: 'butterfly', icon: <Sparkles className="w-4 h-4" />, label: 'Simetri' },
            { id: 'monolith', icon: <Box className="w-4 h-4" />, label: '3D Space' },
          ].map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id as ReflectScene)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all",
                activeScene === scene.id 
                  ? "bg-white text-blue-900 shadow-lg" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {scene.icon}
              <span className="hidden xs:inline">{scene.label}</span>
            </button>
          ))}
        </div>

        {/* Reflection Switches */}
        <div className="flex gap-1.5">
          <button 
            onClick={() => toggleReflect('X')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border transition-all shadow-lg",
              params.reflectX ? "bg-orange-500 border-white text-white" : "bg-white/10 border-white/20 text-white/40"
            )}
          >
            <ArrowUpDown className="w-3 h-3" />
            Sumbu X
          </button>
          <button 
            onClick={() => toggleReflect('Y')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border transition-all shadow-lg",
              params.reflectY ? "bg-blue-500 border-white text-white" : "bg-white/10 border-white/20 text-white/40"
            )}
          >
            <ArrowRightLeft className="w-3 h-3" />
            Sumbu Y
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeScene === 'lake' && (
            <LakeScene key="lake" reflectX={params.reflectX} />
          )}
          {activeScene === 'photography' && (
            <PhotographyScene key="photo" reflectY={params.reflectY} />
          )}
          {activeScene === 'butterfly' && (
             <ButterflyScene key="nature" reflectY={params.reflectY} />
          )}
          {activeScene === 'monolith' && (
            <MonolithScene key="3d" reflectX={params.reflectX} reflectY={params.reflectY} />
          )}
        </AnimatePresence>
      </div>

      {/* Grid Overlay for reference */}
      <AnimatePresence>
        {showGrid && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
              backgroundSize: `40px 40px`,
              backgroundPosition: 'center center'
            }}
          />
        )}
      </AnimatePresence>

      {/* Legend / Info Panel */}
      <div className="absolute bottom-4 right-4 z-20">
         <div className="bg-slate-900/90 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl max-w-[240px] transition-all hover:border-blue-400">
            <div className="flex items-center gap-2 mb-1.5">
               <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
               <p className="text-[9px] font-black uppercase text-blue-100 tracking-widest">Wawasan Refleksi</p>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight italic">
               {activeScene === 'lake' && "Bayangan pada permukaan air tenang adalah contoh Refleksi Sumbu X (vertikal)."}
               {activeScene === 'photography' && "Saat berfoto di depan cermin, terjadi Refleksi Sumbu Y (horizontal)." }
               {activeScene === 'butterfly' && "Sayap kupu-kupu menunjukkan simetri lipat (refleksi)."}
               {activeScene === 'monolith' && "Dalam ruang 3D, refleksi membalikkan koordinat terhadap bidang tertentu."}
            </p>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Matematika</span>
                <span className="text-[9px] font-mono font-bold text-white">
                   {activeScene === 'lake' ? "(x, y) → (x, -y)" : "(x, y) → (-x, y)"}
                </span>
              </div>
              <button 
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors border",
                  showGrid ? "bg-white/10 border-white/20 text-white" : "bg-transparent border-white/10 text-white/40"
                )}
              >
                <Ruler className="w-3 h-3" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const LakeScene: React.FC<{ reflectX: boolean }> = ({ reflectX }) => {
  const shapes = (
    <div className="flex items-end gap-1 px-10">
      <div className="w-32 h-40 bg-emerald-700/80 rounded-t-full relative overflow-hidden">
         <div className="absolute inset-x-0 top-0 h-1/2 bg-emerald-600/40" />
         <div className="absolute inset-x-0 bottom-0 h-1/4 bg-emerald-900/40" />
      </div>
      <div className="w-20 h-24 bg-emerald-600/80 rounded-t-full" />
      <div className="w-16 h-32 bg-emerald-800/80 rounded-t-full" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="relative flex flex-col items-center"
    >
      {/* Upper Content (Real Object) */}
      <div className="relative z-10 pt-20">
         {shapes}
         <div className="absolute top-10 right-0 w-12 h-12 bg-orange-400 rounded-full blur-xl opacity-60" />
      </div>

      {/* Water Line / Mirror Axis */}
      <div className="w-[600px] h-1 bg-white/40 shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20 relative" />

      {/* Reflected Content Area */}
      <div className="relative h-48 w-full flex flex-col items-center">
        <motion.div
          animate={{ 
            opacity: reflectX ? 0.5 : 0,
            scaleY: reflectX ? -1 : 1,
            y: reflectX ? 0 : -20,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 80 }}
          style={{ originY: 0 }} // Flip at the water line (top of this container)
          className="blur-[2px] grayscale-[0.3]"
        >
          {shapes}
        </motion.div>
        
        {/* Wave Distortions overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />
        <motion.div 
           animate={{ x: [-10, 10, -10] }}
           transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
           className="absolute inset-0 opacity-30 pointer-events-none"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.1) 16px)',
             backgroundSize: '100% 20px'
           }}
        />
      </div>
    </motion.div>
  );
};

const PhotographyScene: React.FC<{ reflectY: boolean }> = ({ reflectY }) => {
  const person = (
    <div className="w-48 h-64 bg-slate-800 rounded-[32px] border-4 border-slate-700 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
      <div className="w-20 h-20 bg-blue-500/20 rounded-full mb-4 animate-pulse" />
      <div className="w-32 h-4 bg-slate-700 rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=photographer" className="w-32 h-32" alt="subject" referrerPolicy="no-referrer" />
      </div>
      <div className="absolute top-4 left-4 bg-red-500 w-3 h-3 rounded-full animate-ping" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center justify-center"
    >
      {/* Subject Area */}
      <div className="relative pr-10">
        <div className="relative z-10">
          {person}
          <p className="absolute -bottom-8 left-0 right-0 text-center font-black text-[8px] text-white/40 tracking-[0.4em] uppercase">Objek Asli</p>
        </div>
      </div>

      {/* Mirror Divider */}
      <div className="w-1.5 h-[400px] bg-white/40 relative z-30 shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-full">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-0.5 h-48 rounded-full blur-[1px]" />
      </div>

      {/* Reflection Area */}
      <div className="relative pl-10">
        <motion.div
          animate={{ 
            opacity: reflectY ? 0.6 : 0,
            scaleX: reflectY ? -1 : 1,
            x: reflectY ? 0 : 20,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ originX: 0 }} // Flip at the mirror line (left of this container)
          className="blur-[1px] grayscale-[0.2]"
        >
          {person}
        </motion.div>
        <p className="absolute -bottom-8 left-10 right-0 text-center font-black text-[8px] text-blue-400/40 tracking-[0.4em] uppercase">Bayangan Cermin</p>
      </div>
    </motion.div>
  );
};

const ButterflyScene: React.FC<{ reflectY: boolean }> = ({ reflectY }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.2 }}
    className="relative p-20"
  >
     <div className="relative flex items-center">
        {/* Left Wing (Original) */}
        <div className="w-40 h-64 bg-gradient-to-br from-orange-400 to-red-500 rounded-l-full rounded-r-[40px] relative overflow-hidden shadow-xl border-y-8 border-l-8 border-slate-900">
           <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse" />
           <div className="absolute bottom-10 left-5 w-16 h-16 bg-black/20 rounded-full blur-md" />
           <div className="absolute top-1/2 left-0 w-full h-2 bg-black/10 -rotate-45" />
        </div>

        {/* Body */}
        <div className="w-6 h-72 bg-slate-900 rounded-full z-10 relative">
           <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-10">
              <motion.div animate={{ rotate: [-20, -15, -20] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1 h-16 bg-slate-900 origin-bottom rounded-full" />
              <motion.div animate={{ rotate: [20, 15, 20] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1 h-16 bg-slate-900 origin-bottom rounded-full" />
           </div>
        </div>

        {/* Right Wing (Reflected) Area */}
        <div className="relative h-64 overflow-visible">
           <motion.div
             animate={{ 
               opacity: reflectY ? 1 : 0.05,
               scaleX: reflectY ? 1 : -0.2, // Start slightly peeking or hidden
               rotateY: reflectY ? 0 : -90, // Folding effect
             }}
             transition={{ type: 'spring', damping: 20, stiffness: 80 }}
             className="origin-left"
           >
              <div className="w-40 h-64 bg-gradient-to-bl from-orange-400 to-red-500 rounded-r-full rounded-l-[40px] relative overflow-hidden shadow-xl border-y-8 border-r-8 border-slate-900">
                 <div className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse" />
                 <div className="absolute bottom-10 right-5 w-16 h-16 bg-black/20 rounded-full blur-md" />
                 <div className="absolute top-1/2 right-0 w-full h-2 bg-black/10 rotate-45" />
              </div>
           </motion.div>
        </div>
     </div>

     {/* Interaction Hint */}
     <AnimatePresence>
       {!reflectY && (
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
         >
            <div className="px-4 py-2 bg-white rounded-full text-[9px] font-black uppercase text-blue-900 shadow-xl border-2 border-blue-500 animate-bounce">
               Klik "Refleksi Sumbu Y" untuk Melengkapi Sayap!
            </div>
         </motion.div>
       )}
     </AnimatePresence>
  </motion.div>
);

const Monolith = ({ isReflection = false, reflectX = false, reflectY = false }: { isReflection?: boolean, reflectX?: boolean, reflectY?: boolean }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Target position
      let targetY = 1;
      let targetX = 0;

      if (isReflection) {
        if (reflectX) targetY = -1;
        if (reflectY) targetX = 3; // Shift for visibility
      }

      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1);
      
      // If reflection X is active, flip vertically
      if (isReflection && reflectX) {
        meshRef.current.scale.y = -1;
      } else {
        meshRef.current.scale.y = 1;
      }

      // If reflection Y is active, flip horizontally
      if (isReflection && reflectY) {
        meshRef.current.scale.x = -1;
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1);
      } else if (isReflection) {
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
        meshRef.current.scale.x = 1;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial 
        color={isReflection ? "#3b82f6" : "#6366f1"} 
        emissive={isReflection ? "#1d4ed8" : "#4338ca"}
        emissiveIntensity={0.5}
        transparent={isReflection}
        opacity={isReflection ? 0.6 : 1}
      />
    </mesh>
  );
};

export const MonolithScene: React.FC<{ reflectX: boolean, reflectY: boolean }> = ({ reflectX, reflectY }) => {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[5, 3, 8]} fov={50} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Monolith />
        </Float>

        {(reflectX || reflectY) && (
          <Monolith isReflection reflectX={reflectX} reflectY={reflectY} />
        )}

        {reflectX && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
            <gridHelper args={[10, 20, "#ffffff", "#ffffff"]} rotation={[Math.PI / 2, 0, 0]} />
          </mesh>
        )}

        {reflectY && (
          <mesh rotation={[0, -Math.PI / 2, 0]} position={[1.5, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.1} side={THREE.DoubleSide} />
            <gridHelper args={[10, 20, "#3b82f6", "#3b82f6"]} rotation={[0, 0, Math.PI / 2]} />
          </mesh>
        )}

        <OrbitControls enablePan={false} maxDistance={15} minDistance={5} />
      </Canvas>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:opacity-20 transition-opacity">
         {!reflectX && !reflectY && (
           <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full uppercase text-[10px] font-black tracking-[0.4em] text-white/40">
              Menunggu Transfomasi Refleksi
           </div>
         )}
      </div>
    </div>
  );
};
