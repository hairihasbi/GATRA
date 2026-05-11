import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Map, 
  Maximize, 
  Camera, 
  Image as ImageIcon, 
  Search, 
  Tv,
  Info,
  Wind
} from 'lucide-react';
import { TransformationParams } from '../types';
import { cn } from '../lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface DilationLabProps {
  params: TransformationParams;
  onUpdateParams: (updates: Partial<TransformationParams>) => void;
}

type DilationScene = 'miniatur' | 'peta' | 'kamera' | 'foto' | 'mikroskop' | 'proyeksi' | 'balloon';

export const DilationLab: React.FC<DilationLabProps> = ({ params, onUpdateParams }) => {
  const [activeScene, setActiveScene] = useState<DilationScene>('miniatur');

  // Faktor skala k = params.a
  const scaleFactor = params.a;

  const scenes: { id: DilationScene; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'miniatur', label: 'Maket', icon: <Building2 className="w-4 h-4" />, desc: 'Pengecilan bangunan asli menjadi model miniatur skala 1:k' },
    { id: 'peta', label: 'Peta', icon: <Map className="w-4 h-4" />, desc: 'Wilayah geografis dipetakan dengan skala tertentu' },
    { id: 'kamera', label: 'Zoom HP', icon: <Camera className="w-4 h-4" />, desc: 'Fitur Zoom In/Out memperbesar atau memperkecil tampilan objek' },
    { id: 'foto', label: 'Cetak Foto', icon: <ImageIcon className="w-4 h-4" />, desc: 'Mengubah ukuran foto (3x4, 4x6, 10R) dengan faktor skala' },
    { id: 'mikroskop', label: 'Mikroskop', icon: <Search className="w-4 h-4" />, desc: 'Memperbesar objek mikro agar terlihat jelas' },
    { id: 'proyeksi', label: 'Bioskop', icon: <Tv className="w-4 h-4" />, desc: 'Proyeksi gambar kecil ke layar raksasa' },
    { id: 'balloon', label: '3D Balon', icon: <Wind className="w-4 h-4" />, desc: 'Volume balon bertambah secara 3 dimensi saat ditiup' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#fcfaf4] p-6 gap-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10 pointer-events-none" />

      {/* Header & Scene Selector */}
      <div className="relative z-10 flex items-center justify-between gap-4 mt-0">
        <div className="flex items-center gap-4">
           {/* Scale Indicator */}
           <div className="flex items-center gap-2 bg-orange-600 px-4 py-2 rounded-2xl shadow-xl shadow-orange-200/50 border border-orange-400">
             <Maximize className="w-5 h-5 text-white" />
             <div className="text-left">
               <p className="text-[8px] font-black uppercase text-orange-200 leading-none mb-0.5">Skala (k)</p>
               <p className="text-sm font-mono font-bold text-white leading-none">{scaleFactor.toFixed(1)}x</p>
             </div>
           </div>

           {/* Scene Selector */}
           <div className="flex flex-wrap gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-orange-100 shadow-lg">
             {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all shadow-sm group",
                activeScene === scene.id
                  ? "bg-orange-500 text-white scale-105"
                  : "bg-white text-slate-500 hover:bg-orange-50"
              )}
            >
              {scene.icon}
              <span className="hidden xs:inline">{scene.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Main Simulation Area */}
    <div className="flex-1 rounded-[40px] bg-slate-900 shadow-2xl relative overflow-hidden border-8 border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeScene === 'miniatur' && <MiniaturScene key="miniatur" k={scaleFactor} />}
          {activeScene === 'peta' && <PetaScene key="peta" k={scaleFactor} />}
          {activeScene === 'kamera' && <KameraScene key="kamera" k={scaleFactor} />}
          {activeScene === 'foto' && <FotoScene key="foto" k={scaleFactor} />}
          {activeScene === 'mikroskop' && <MikroskopScene key="mikroskop" k={scaleFactor} />}
          {activeScene === 'proyeksi' && <ProyeksiScene key="proyeksi" k={scaleFactor} />}
          {activeScene === 'balloon' && <BalloonScene key="balloon" k={scaleFactor} />}
        </AnimatePresence>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end gap-10">
           <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                 <Info className="w-4 h-4 text-orange-400" />
                 <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Apa yang Terjadi?</p>
              </div>
              <p className="text-xs text-white/70 leading-relaxed italic">
                 {scenes.find(s => s.id === activeScene)?.desc}
                 <br />
                 <span className="text-orange-400 font-bold">
                    {scaleFactor > 1 ? "Objek diperbesar (k > 1)" : scaleFactor < 1 ? "Objek diperkecil (k < 1)" : "Ukuran tetap (k = 1)"}
                 </span>
              </p>
           </div>
           
           <div className="flex flex-col gap-2">
              <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[8px] font-bold text-white/60 tracking-widest uppercase">
                 Dilatasi (Perkalian Skala)
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MiniaturScene: React.FC<{ k: number }> = ({ k }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center gap-20 p-10"
  >
    {/* Original Building */}
    <div className="flex flex-col items-center">
       <div className="w-40 h-64 bg-slate-200 rounded-t-lg border-x-4 border-t-4 border-slate-300 relative">
          <div className="grid grid-cols-3 gap-2 p-4">
             {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="w-full aspect-square bg-blue-400/30 rounded-sm" />
             ))}
          </div>
          <div className="absolute -bottom-2 w-48 h-2 bg-emerald-500 rounded-full" />
       </div>
       <p className="mt-4 text-[10px] font-black text-white uppercase tracking-widest">Gedung Asli</p>
    </div>

    {/* Scaled Model (Maket) */}
    <div className="flex flex-col items-center">
       <motion.div 
         animate={{ scale: k }}
         transition={{ type: 'spring', damping: 12 }}
         className="w-40 h-64 bg-amber-200 border-x-4 border-t-4 border-amber-300 relative shadow-2xl origin-bottom"
       >
          <div className="grid grid-cols-12 gap-1 p-2">
             {Array.from({length: 48}).map((_, i) => (
                <div key={i} className="w-full aspect-square bg-slate-800/40 rounded-[1px]" />
             ))}
          </div>
       </motion.div>
       <p className="mt-4 text-[10px] font-black text-white uppercase tracking-widest">Maket (Skala {k.toFixed(1)}x)</p>
    </div>
  </motion.div>
);

const PetaScene: React.FC<{ k: number }> = ({ k }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center p-10"
  >
    <div className="relative w-full max-w-2xl h-[300px] bg-blue-900/20 rounded-3xl border-2 border-white/10 overflow-hidden">
       {/* Geographic Shapes */}
       <motion.div 
         animate={{ scale: k }}
         className="absolute inset-0 flex items-center justify-center pointer-events-none"
       >
          <div className="w-60 h-40 bg-emerald-500/30 border-4 border-emerald-400 rounded-full blur-[2px]" />
          <div className="w-32 h-32 bg-emerald-600/30 border-4 border-emerald-500 rounded-lg rotate-45 -ml-10 blur-[2px]" />
       </motion.div>

       {/* Map Overlay Grid */}
       <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 opacity-20 pointer-events-none">
          {Array.from({length: 60}).map((_, i) => <div key={i} className="border border-white/20" />)}
       </div>

       <div className="absolute top-4 right-4 bg-black/40 backdrop-blur rounded-xl p-3 border border-white/10">
          <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Skala Peta</p>
          <p className="text-xs font-mono text-white">1 : {(1000/k).toFixed(0)}</p>
       </div>
    </div>
    <p className="mt-6 text-[10px] font-black text-white uppercase tracking-widest italic">Digitasi Wilayah ke Lembaran Peta</p>
  </motion.div>
);

const KameraScene: React.FC<{ k: number }> = ({ k }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center"
  >
    <div className="w-80 h-[500px] bg-black rounded-[50px] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
       {/* Screen */}
       <div className="flex-1 bg-slate-900 m-2 rounded-[40px] relative overflow-hidden flex items-center justify-center">
          <motion.div 
             animate={{ scale: k }}
             transition={{ duration: 0.3 }}
          >
             <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-white" />
             </div>
          </motion.div>

          {/* Viewfinder elements */}
          <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-white/50" />
          <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-white/50" />
          <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-white/50" />
          <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-white/50" />
       </div>

       {/* Camera UI */}
       <div className="h-24 bg-black flex items-center justify-around px-8">
          <div className="w-12 h-12 rounded-full border-2 border-white/20" />
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
             <div className="w-14 h-14 rounded-full border-2 border-black" />
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl" />
       </div>
    </div>
    <p className="mt-4 text-[10px] font-black text-white uppercase tracking-widest italic">Simulasi Digital Zoom Kamera</p>
  </motion.div>
);

const FotoScene: React.FC<{ k: number }> = ({ k }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center gap-10 p-10"
  >
    {/* Negative Film */}
    <div className="flex flex-col items-center">
       <div className="w-12 h-16 bg-slate-800 rounded-sm border-2 border-slate-700 relative flex items-center justify-center p-2">
          <div className="w-full h-full bg-blue-500/20 rounded-sm overflow-hidden grayscale">
             <div className="w-4 h-4 bg-white/40 rounded-full mx-auto" />
             <div className="w-6 h-8 bg-white/20 rounded-t-lg mx-auto" />
          </div>
       </div>
       <p className="mt-4 text-[8px] font-black text-white/40 uppercase tracking-widest">Film Negatif</p>
    </div>

    {/* Printed Photos */}
    <div className="flex items-end gap-6">
       <motion.div 
         animate={{ scale: k }}
         className="w-40 h-60 bg-white p-4 shadow-xl origin-bottom"
       >
          <div className="w-full h-full bg-emerald-500 rounded-sm overflow-hidden relative">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=photo" className="w-full h-full" alt="photo" referrerPolicy="no-referrer" />
             <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-sm p-1 text-[6px] font-bold text-center">PRINTED</div>
          </div>
       </motion.div>
    </div>
    <p className="absolute bottom-1/4 translate-y-12 text-[10px] font-black text-white uppercase tracking-widest italic">Cetak Foto Berbagai Ukuran</p>
  </motion.div>
);

const MikroskopScene: React.FC<{ k: number }> = ({ k }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center p-10"
  >
    {/* Microscope Lens View */}
    <div className="w-72 h-72 rounded-full border-[15px] border-slate-700 bg-black shadow-inner shadow-black relative overflow-hidden">
       {/* Microbes */}
       <motion.div 
         animate={{ scale: k * 3 }} // Extra multiplier for microscope effect
         className="absolute inset-0 flex items-center justify-center"
       >
          <div className="relative">
             <motion.div 
               animate={{ x: [-2, 2, -1], y: [1, -1, 0] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="w-10 h-6 bg-emerald-400/40 border-2 border-emerald-300 rounded-full blur-[1px]" 
             />
             <motion.div 
               animate={{ x: [2, -2, 1], y: [-1, 1, 0] }}
               transition={{ duration: 3, repeat: Infinity }}
               className="w-4 h-4 bg-blue-400/40 border-2 border-blue-300 rounded-full absolute -top-4 -left-2 blur-[1px]" 
             />
          </div>
       </motion.div>

       {/* Lens Reflections */}
       <div className="absolute top-10 right-10 w-20 h-10 bg-white/10 rounded-full rotate-45 blur-xl" />
       
       <div className="absolute inset-0 border-[20px] border-black/40 rounded-full pointer-events-none" />
    </div>
    <div className="ml-10 max-w-xs space-y-4">
       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Perbesaran Okuler</p>
          <p className="text-2xl font-black text-white">{(k * 10).toFixed(0)}x</p>
       </div>
       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Eksplorasi Dunia Mikro</p>
    </div>
  </motion.div>
);

const ProyeksiScene: React.FC<{ k: number }> = ({ k }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center p-10"
  >
    <div className="flex items-center gap-20">
       {/* Projector */}
       <div className="relative">
          <div className="w-24 h-16 bg-slate-300 rounded-lg relative border-b-4 border-slate-400">
             <div className="absolute left-full top-4 -translate-y-1/2 w-4 h-8 bg-slate-400 rounded-r-lg" />
             <div className="absolute left-full top-4 -translate-y-1/2 w-2 h-6 bg-slate-900 rounded-r-sm" />
          </div>
          {/* Light Beam */}
          <div className="absolute left-24 top-4 -translate-y-1/2 w-64 h-32 bg-white/5 origin-left clip-path-beam" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)' }} />
       </div>

       {/* Screen */}
       <div className="w-72 h-48 bg-black/40 border-8 border-white/20 rounded shadow-2xl relative flex items-center justify-center overflow-hidden">
          <motion.div 
             animate={{ scale: k }}
             className="relative"
          >
             <div className="w-32 h-20 bg-blue-500 rounded flex items-center justify-center overflow-hidden border-2 border-white/50">
                <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-900 relative">
                   <div className="absolute bottom-2 left-2 text-[10px] font-black text-white italic">MOVIE</div>
                   <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full animate-pulse" />
                </div>
             </div>
          </motion.div>
       </div>
    </div>
    <p className="mt-10 text-[10px] font-black text-white uppercase tracking-widest italic">Proyeksi Layar Bioskop (Perbesaran Gambar)</p>
  </motion.div>
);

const Balloon = ({ k }: { k: number }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(k, k, k), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#f97316" 
          roughness={0.1} 
          metalness={0.2} 
          emissive="#c2410c"
          emissiveIntensity={0.2}
        />
        {/* Balloon Knot/Bottom */}
        <mesh position={[0, -0.9, 0]}>
           <coneGeometry args={[0.2, 0.4, 16]} />
           <meshStandardMaterial color="#c2410c" />
        </mesh>
      </mesh>
    </Float>
  );
};

export const BalloonScene: React.FC<{ k: number }> = ({ k }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Balloon k={k} />

        <OrbitControls enablePan={false} maxDistance={10} minDistance={2} />
      </Canvas>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400 mb-1">Simulasi Volume 3D</p>
         <h3 className="text-3xl font-black text-white italic tracking-tighter">
            Dilatasi XYZ
         </h3>
      </div>
      
      <div className="absolute top-1/2 left-10 flex flex-col gap-4">
         <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-[8px] font-bold text-orange-200 uppercase tracking-widest mb-2">Koordinat Berubah</p>
            <div className="space-y-1">
               <div className="flex justify-between gap-4">
                  <span className="text-[10px] text-white/40">X' = </span>
                  <span className="text-[10px] font-mono text-white">{k.toFixed(1)}x</span>
               </div>
               <div className="flex justify-between gap-4">
                  <span className="text-[10px] text-white/40">Y' = </span>
                  <span className="text-[10px] font-mono text-white">{k.toFixed(1)}y</span>
               </div>
               <div className="flex justify-between gap-4">
                  <span className="text-[10px] text-white/40">Z' = </span>
                  <span className="text-[10px] font-mono text-white">{k.toFixed(1)}z</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
