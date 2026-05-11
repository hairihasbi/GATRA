import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Navigation, Map as MapIcon, Flag, Target, MapPin, Play, RotateCcw, Trees, Waves, Satellite, Wifi, Globe } from 'lucide-react';
import { TransformationParams } from '../types';
import { cn } from '../lib/utils';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

interface GPSLabProps {
  params: TransformationParams;
  scale?: number;
  onUpdateParams?: (updates: Partial<TransformationParams>) => void;
}

type GPSScene = 'radar' | 'globe';

export const GPSLab: React.FC<GPSLabProps> = ({ params, scale = 40, onUpdateParams }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<GPSScene>('radar');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isSimulating, setIsSimulating] = useState(false);

  // Local state for inputs to allow smooth typing
  const [inputC, setInputC] = useState(params.c.toString());
  const [inputD, setInputD] = useState(params.d.toString());
  const [inputX1, setInputX1] = useState(params.x1.toString());
  const [inputY1, setInputY1] = useState(params.y1.toString());

  useEffect(() => {
    setInputC(params.c.toString());
    setInputD(params.d.toString());
    setInputX1(params.x1.toString());
    setInputY1(params.y1.toString());
  }, [params.c, params.d, params.x1, params.y1]);

  const handleInputChange = (field: 'c' | 'd' | 'x1' | 'y1', value: string) => {
    if (field === 'c') setInputC(value);
    else if (field === 'd') setInputD(value);
    else if (field === 'x1') setInputX1(value);
    else setInputY1(value);

    const num = parseFloat(value);
    if (!isNaN(num) && onUpdateParams) {
      onUpdateParams({ [field]: num });
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    updateDimensions();
    return () => observer.disconnect();
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  const scenes: { id: GPSScene; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'radar', label: 'Radar GATRA', icon: <Compass className="w-4 h-4" />, desc: 'Simulasi navigasi 2D dalam GATRA' },
    { id: 'globe', label: '3D Globe', icon: <Globe className="w-4 h-4" />, desc: 'Visualisasi koordinat bumi dalam ruang 3D' },
  ];

  // Convert math coordinates to pixels
  const toX = (x: number) => centerX + x * scale;
  const toY = (y: number) => centerY - y * scale;

  const startSimulation = () => {
    setIsSimulating(true);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a1a0a] overflow-hidden font-mono select-none flex flex-col">
      {/* Scene Selection Header */}
      <div className="flex bg-[#0d1f0d] border-b border-emerald-900/50 p-2 gap-2 z-30 shrink-0 overflow-x-auto no-scrollbar">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeScene === scene.id 
                  ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                  : "text-emerald-500/50 hover:bg-emerald-900/50"
              )}
            >
              {scene.icon}
              {scene.label}
            </button>
          ))}
       </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeScene === 'radar' && (
            <motion.div 
              key="radar"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Detailed Jungle Terrain Background */}
              <div className="absolute inset-0 bg-[#0d1f0d]">
                {/* Grass Texture Pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(#22c55e 0.5px, transparent 0.5px)`,
                    backgroundSize: `20px 20px`,
                  }}
                />
                
                {/* River Flowing through the center or offset */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                  <path 
                    d="M -100 200 Q 100 150 200 300 T 500 200 T 800 400" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="40" 
                    className="blur-xl"
                  />
                  <path 
                    d="M -100 200 Q 100 150 200 300 T 500 200 T 800 400" 
                    fill="none" 
                    stroke="#60a5fa" 
                    strokeWidth="20" 
                    strokeDasharray="10 20"
                  />
                </svg>

                {/* Scattered Trees using SVG Icons */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    {[...Array(12)].map((_, i) => (
                        <Trees 
                            key={i} 
                            className="absolute text-emerald-900" 
                            style={{ 
                                left: `${(i * 137) % 100}%`, 
                                top: `${(i * 243) % 100}%`, 
                                width: `${20 + (i % 3) * 10}px` 
                            }} 
                        />
                    ))}
                </div>
              </div>

              {/* Grid Overlay */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
                  backgroundSize: `${scale}px ${scale}px`,
                  backgroundPosition: `${centerX}px ${centerY}px`
                }}
              />
              
              {/* Axes */}
              <div className="absolute top-[50%] left-0 w-full h-px bg-emerald-500/40" />
              <div className="absolute left-[50%] top-0 h-full w-px bg-emerald-500/40" />

              {/* Origin Point Marker */}
              <div 
                className="absolute w-8 h-8 -ml-4 -mt-4 flex flex-col items-center justify-center z-10"
                style={{ left: toX(params.x1), top: toY(params.y1) }}
              >
                <div className="w-1 h-1 bg-white rounded-full" />
                <span className="text-[8px] text-white/50 mt-1 font-black underline decoration-orange-500 whitespace-nowrap">TITIK AWAL ({params.x1}, {params.y1})</span>
              </div>

              {/* HUD - Dynamic Info Panel */}
              <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-emerald-950/90 backdrop-blur-md border border-emerald-500/30 p-4 rounded-2xl shadow-2xl w-64"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <Navigation className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-emerald-100 uppercase tracking-tighter">Radar Navigasi GATRA</h4>
                      <p className="text-[8px] text-emerald-400 uppercase tracking-widest font-bold">Status: {(params.c === 0 && params.d === 0) ? 'Siap Berangkat' : 'Menuju Target'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-blue-400">Δx</span>
                      </div>
                      <span className="text-[8px] text-slate-400 block uppercase mb-1">Selisih X</span>
                      <span className="text-sm font-black text-white">{params.c > 0 ? `+${params.c}` : params.c} m</span>
                      <div className="text-[7px] text-blue-400/60 font-medium whitespace-nowrap mt-1">{params.x1 + params.c} - {params.x1} = {params.c}</div>
                    </div>
                    <div className="bg-black/40 p-2 rounded-xl border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-emerald-400">Δy</span>
                      </div>
                      <span className="text-[8px] text-slate-400 block uppercase mb-1">Selisih Y</span>
                      <span className="text-sm font-black text-white">{params.d > 0 ? `+${params.d}` : params.d} m</span>
                      <div className="text-[7px] text-emerald-400/60 font-medium whitespace-nowrap mt-1">{params.y1 + params.d} - {params.y1} = {params.d}</div>
                    </div>
                  </div>

                  {/* Initial Point Inputs */}
                  <div className="bg-black/20 p-2 rounded-xl border border-white/5 mb-3">
                    <span className="text-[8px] text-slate-400 block uppercase mb-1">Titik Awal (x₁, y₁)</span>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            value={inputX1}
                            onChange={(e) => handleInputChange('x1', e.target.value)}
                            className="w-full bg-emerald-900/30 border border-emerald-500/20 rounded text-xs font-bold text-white text-center focus:outline-none focus:border-emerald-500"
                        />
                        <input 
                            type="number" 
                            value={inputY1}
                            onChange={(e) => handleInputChange('y1', e.target.value)}
                            className="w-full bg-emerald-900/30 border border-emerald-500/20 rounded text-xs font-bold text-white text-center focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-emerald-500/20 pt-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[14px] font-black text-white">T</span>
                        <div className="flex flex-col items-center border-l-2 border-r-2 border-white px-2 gap-1">
                            <input 
                                type="number" 
                                value={inputC}
                                onChange={(e) => handleInputChange('c', e.target.value)}
                                className="w-12 bg-emerald-900/50 border border-orange-500/30 rounded text-xs font-black text-orange-400 text-center focus:outline-none focus:border-orange-500 transition-colors"
                                step="0.5"
                            />
                            <input 
                                type="number" 
                                value={inputD}
                                onChange={(e) => handleInputChange('d', e.target.value)}
                                className="w-12 bg-emerald-900/50 border border-emerald-500/30 rounded text-xs font-black text-emerald-400 text-center focus:outline-none focus:border-emerald-500 transition-colors"
                                step="0.5"
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={isSimulating ? resetSimulation : startSimulation}
                        className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 shadow-lg",
                            isSimulating 
                                ? "bg-slate-700 text-white hover:bg-slate-600" 
                                : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
                        )}
                    >
                        {isSimulating ? <RotateCcw className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {isSimulating ? 'Reset' : 'Simulasi'}
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Vector Path Visualization */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                    </marker>
                  </defs>
                  
                  {/* Component X */}
                  <motion.line
                    initial={{ x1: toX(params.x1), y1: toY(params.y1), x2: toX(params.x1), y2: toY(params.y1) }}
                    animate={{ x1: toX(params.x1), y1: toY(params.y1), x2: toX(params.x1 + params.c), y2: toY(params.y1) }}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    strokeOpacity="0.4"
                  />
                  
                  {/* Component Y */}
                  <motion.line
                    initial={{ x1: toX(params.x1 + params.c), y1: toY(params.y1), x2: toX(params.x1 + params.c), y2: toY(params.y1) }}
                    animate={{ x1: toX(params.x1 + params.c), y1: toY(params.y1), x2: toX(params.x1 + params.c), y2: toY(params.y1 + params.d) }}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    strokeOpacity="0.4"
                  />

                  {/* Resultant Translation Vector */}
                  <motion.line
                    initial={{ x1: toX(params.x1), y1: toY(params.y1), x2: toX(params.x1), y2: toY(params.y1) }}
                    animate={{ x1: toX(params.x1), y1: toY(params.y1), x2: toX(params.x1 + params.c), y2: toY(params.y1 + params.d) }}
                    stroke="#f97316"
                    strokeWidth="3"
                    markerEnd="url(#arrowhead)"
                    strokeOpacity={0.6}
                  />
                </svg>

                {/* Dynamic Labels for Delta X and Delta Y on components */}
                {params.c !== 0 && (
                  <motion.div 
                    animate={{ x: (toX(params.x1) + toX(params.x1 + params.c)) / 2, y: toY(params.y1) + 10 }}
                    className="absolute bg-blue-600/80 text-white text-[8px] px-1 rounded font-black -translate-x-1/2"
                  >
                    Δx: {params.c > 0 ? '+' : ''}{params.c}
                  </motion.div>
                )}
                {params.d !== 0 && (
                  <motion.div 
                    animate={{ x: toX(params.x1 + params.c) + 10, y: (toY(params.y1) + toY(params.y1 + params.d)) / 2 }}
                    className="absolute bg-emerald-600/80 text-white text-[8px] px-1 rounded font-black -translate-y-1/2"
                  >
                    Δy: {params.d > 0 ? '+' : ''}{params.d}
                  </motion.div>
                )}
              </div>

              {/* Simulated Explorer (The Person) */}
              <motion.div
                animate={{ 
                  x: isSimulating ? toX(params.x1 + params.c) : toX(params.x1), 
                  y: isSimulating ? toY(params.y1 + params.d) : toY(params.y1) 
                }}
                transition={{ 
                    type: 'spring', 
                    damping: 20, 
                    stiffness: 80,
                    delay: 0.1
                }}
                className="absolute w-12 h-12 -ml-6 -mt-6 flex flex-col items-center justify-center z-40"
              >
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse" />
                
                {/* The Explorer Visual */}
                <div className="relative group">
                    <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20 transform hover:scale-110 transition-transform">
                        <Navigation 
                            className="w-6 h-6 text-white" 
                            style={{ 
                                transform: `rotate(${Math.atan2(-params.d, params.c) * (180/Math.PI) - 45}deg)` 
                            }} 
                        />
                    </div>
                    
                    {/* Person Face/Icon Overlay */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg border border-orange-200 overflow-hidden">
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Explorer`} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    
                    {/* Walking Simulation Label */}
                    <AnimatePresence>
                        {isSimulating && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-lg border border-slate-200 whitespace-nowrap"
                            >
                                <span className="text-[8px] font-black text-orange-600 uppercase">Explorer Sedang Berjalan...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
              </motion.div>

              {/* Destination Flag */}
              <div 
                className="absolute w-8 h-8 -ml-4 -mt-4 flex flex-col items-center justify-center z-20 pointer-events-none"
                style={{ left: toX(params.x1 + params.c), top: toY(params.y1 + params.d) }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                    <Flag className="w-6 h-6 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                </motion.div>
                <div className="flex flex-col items-center bg-black/60 px-2 py-1 rounded border border-red-500/30 backdrop-blur-sm mt-1">
                  <span className="text-[8px] text-white font-black uppercase mb-0.5">Titik Baru (P')</span>
                  <span className="text-[10px] text-orange-400 font-black">({params.x1 + params.c}, {params.y1 + params.d})</span>
                </div>
              </div>

              {/* Original Ghost Marker (Fixed at Destination) */}
              {!isSimulating && (params.c !== 0 || params.d !== 0) && (
                <div 
                  className="absolute w-10 h-10 -ml-5 -mt-5 opacity-20 z-10"
                  style={{ left: toX(params.x1 + params.c), top: toY(params.y1 + params.d) }}
                >
                  <Navigation className="w-full h-full text-white" />
                </div>
              )}
            </motion.div>
          )}

          {activeScene === 'globe' && <SatelitScene key="globe" params={params} />}
        </AnimatePresence>

        {/* Global Bottom Info Bar */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-1 pointer-events-none">
          <div className="flex items-center gap-2 text-emerald-400">
              <Waves className="w-3 h-3 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">Sinyal GPS Optimal</span>
          </div>
          <p className="text-[8px] text-white/30 uppercase italic font-bold">GATRA - Simulasi Navigasi v1.2</p>
        </div>
      </div>
    </div>
  );
};

const UserMarker = ({ lat, lon }: { lat: number, lon: number }) => {
  const markerRef = React.useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (markerRef.current) {
      // Map params c/d to latitude/longitude representation
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      
      const x = -(2 * Math.sin(phi) * Math.cos(theta));
      const z = (2 * Math.sin(phi) * Math.sin(theta));
      const y = (2 * Math.cos(phi));
      
      markerRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.1);
    }
  });

  return (
    <group ref={markerRef}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
         <cylinderGeometry args={[0.005, 0.005, 0.4]} />
         <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
};

const Earth = () => {
  const earthRef = React.useRef<THREE.Mesh>(null);
  
  // Using standard Three.js assets which are usually reliable with CORS
  // Removing troublesome clouds map that was causing undefined errors
  const [colorMap, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  ]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = time * 0.05;
  });

  return (
    <group>
      {/* Earth Surface with Normal and Specular Maps */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap} 
          normalMap={normalMap} 
          specularMap={specularMap}
          shininess={5}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshPhongMaterial 
          color="#4299e1" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Radar Scanline Effect (3D) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.22, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const SatelitScene: React.FC<{ params: TransformationParams }> = ({ params }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Sun-like Illumination for Day/Night effect */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 5, 10]} intensity={3} color="#fffcf0" />
        <pointLight position={[-10, -5, -10]} intensity={0.2} color="#4299e1" />
        
        <React.Suspense fallback={
          <Float speed={2}>
            <mesh>
              <sphereGeometry args={[2, 32, 32]} />
              <meshStandardMaterial color="#1e293b" wireframe />
            </mesh>
          </Float>
        }>
          <Earth />
        </React.Suspense>

        <UserMarker lat={params.d * 10} lon={params.c * 10} />

        <OrbitControls enablePan={false} minDistance={4} maxDistance={15} />
      </Canvas>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-1">Global Positioning System</p>
         <h3 className="text-3xl font-black text-white italic tracking-tighter">
            Koordinat Bumi 3D
         </h3>
      </div>
      
      <div className="absolute top-1/2 left-10 flex flex-col gap-4">
         <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <p className="text-[8px] font-bold text-emerald-200 uppercase tracking-widest mb-2">Data Real-time</p>
            <div className="space-y-2 font-mono text-[10px]">
               <div className="flex justify-between gap-6 text-white/40">
                  <span>LATITUDE (DY):</span> <span className="text-white font-bold">{ (params.d * 10).toFixed(4) }°</span>
               </div>
               <div className="flex justify-between gap-6 text-white/40">
                  <span>LONGITUDE (DX):</span> <span className="text-white font-bold">{ (params.c * 10).toFixed(4) }°</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
