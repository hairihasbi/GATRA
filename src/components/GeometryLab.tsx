import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Square, Triangle, Circle, Pentagon, Move, Layers, Gamepad2, Music, Ship, Layout } from 'lucide-react';
import { TransformationParams } from '../types';
import { cn } from '../lib/utils';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface GeometryLabProps {
  params: TransformationParams;
  scale?: number;
  onUpdateParams?: (updates: Partial<TransformationParams>) => void;
}

type ShapeType = 'square' | 'triangle' | 'circle' | 'pentagon';
type GeoScene = 'grid' | 'game' | 'piano' | 'ship';

export const GeometryLab: React.FC<GeometryLabProps> = ({ params, scale = 40, onUpdateParams }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<GeoScene>('grid');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeShape, setActiveShape] = useState<ShapeType>('square');

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

  const scenes: { id: GeoScene; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'grid', label: 'Matematika', icon: <Layout className="w-4 h-4" />, desc: 'Mempelajari pergeseran titik pada koordinat Kartesius' },
    { id: 'game', label: 'Gaming', icon: <Gamepad2 className="w-4 h-4" />, desc: 'Simulasi gerakan karakter menggunakan (dx, dy)' },
    { id: 'piano', label: 'Musik', icon: <Music className="w-4 h-4" />, desc: 'Transposisi nada dalam skala musik' },
    { id: 'ship', label: '3D Kargo', icon: <Ship className="w-4 h-4" />, desc: 'Logistik kontainer dalam ruang 3D menggunakan XYZ' },
  ];

  const toX = (x: number) => centerX + x * scale;
  const toY = (y: number) => centerY - y * scale;

  const renderShape = (type: ShapeType, x: number, y: number, isGhost: boolean = false) => {
    const size = scale * 2;
    const commonProps = {
      initial: false,
      animate: { x: toX(x), y: toY(y) },
      className: cn(
        "absolute flex items-center justify-center",
        isGhost ? "opacity-20 stroke-slate-400 fill-slate-200" : "opacity-90 transition-shadow duration-300"
      ),
      style: { 
        width: size, 
        height: size, 
        left: 0, 
        top: 0,
        marginLeft: -size/2,
        marginTop: -size/2
      }
    };

    const colorClass = "fill-orange-400 stroke-orange-600 stroke-[3px]";

    switch (type) {
      case 'square':
        return (
          <motion.svg {...commonProps} viewBox="0 0 100 100">
            <rect x="10" y="10" width="80" height="80" className={isGhost ? "" : colorClass} rx="8" />
          </motion.svg>
        );
      case 'triangle':
        return (
          <motion.svg {...commonProps} viewBox="0 0 100 100">
            <path d="M 50 10 L 90 90 L 10 90 Z" className={isGhost ? "" : colorClass} />
          </motion.svg>
        );
      case 'circle':
        return (
          <motion.svg {...commonProps} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className={isGhost ? "" : colorClass} />
          </motion.svg>
        );
      case 'pentagon':
        return (
          <motion.svg {...commonProps} viewBox="0 0 100 100">
            <path d="M 50 10 L 90 40 L 75 90 L 25 90 L 10 40 Z" className={isGhost ? "" : colorClass} />
          </motion.svg>
        );
    }
  };

  const shapes: { id: ShapeType; icon: React.ReactNode; label: string }[] = [
    { id: 'square', icon: <Square className="w-4 h-4" />, label: 'Persegi' },
    { id: 'triangle', icon: <Triangle className="w-4 h-4" />, label: 'Segitiga' },
    { id: 'circle', icon: <Circle className="w-4 h-4" />, label: 'Lingkaran' },
    { id: 'pentagon', icon: <Pentagon className="w-4 h-4" />, label: 'Segilima' },
  ];

  return (
    <div ref={containerRef} className="relative w-full h-full bg-white overflow-hidden font-mono flex flex-col">
       {/* Scene Selection Header */}
       <div className="flex bg-slate-50 border-b border-slate-200 p-2 gap-2 z-30 shrink-0 overflow-x-auto no-scrollbar">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveScene(scene.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeScene === scene.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-200"
              )}
            >
              {scene.icon}
              {scene.label}
            </button>
          ))}
       </div>

       <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeScene === 'grid' && (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Grid Canvas */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)`,
                  backgroundSize: `${scale}px ${scale}px`,
                  backgroundPosition: `${centerX}px ${centerY}px`
                }}
              />

              {/* Axes */}
              <div className="absolute top-[50%] left-0 w-full h-[2px] bg-slate-300" />
              <div className="absolute left-[50%] top-0 h-full w-[2px] bg-slate-300" />
              
              {/* Numbers on Axes */}
              {dimensions.width > 0 && Array.from({ length: 21 }).map((_, i) => {
                const val = i - 10;
                if (val === 0) return null;
                return (
                  <React.Fragment key={i}>
                    <span className="absolute text-[8px] text-slate-400 font-bold" style={{ left: toX(val) - 4, top: centerY + 4 }}>{val}</span>
                    <span className="absolute text-[8px] text-slate-400 font-bold" style={{ left: centerX + 4, top: toY(val) - 4 }}>{val}</span>
                  </React.Fragment>
                );
              })}

              {/* Title & Shape Selector */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
                <div className="bg-white/90 backdrop-blur border border-slate-200 p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Lab Bangun Datar</span>
                  </div>
                  <div className="flex gap-2">
                    {shapes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveShape(s.id)}
                        className={cn(
                          "p-2 rounded-lg transition-all border-2",
                          activeShape === s.id ? "bg-orange-500 border-orange-600 text-white shadow-md" : "bg-slate-50 border-slate-200 text-slate-400 hover:border-orange-300"
                        )}
                        title={s.label}
                      >
                        {s.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-xl shadow-lg">
                  <p className="text-[8px] font-bold text-slate-500 uppercase mb-2">Titik Awal (x₁, y₁)</p>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={inputX1}
                      onChange={(e) => handleInputChange('x1', e.target.value)}
                      className="w-12 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-600 text-center focus:outline-none focus:border-orange-500"
                    />
                    <input 
                      type="number" 
                      value={inputY1}
                      onChange={(e) => handleInputChange('y1', e.target.value)}
                      className="w-12 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-600 text-center focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="bg-orange-500/10 backdrop-blur border border-orange-500/20 p-3 rounded-xl">
                  <p className="text-[8px] font-bold text-orange-600 uppercase mb-2">Notasi Translasi</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-slate-700">P'</span>
                    <span className="text-sm font-bold text-slate-500">=</span>
                    <div className="flex flex-col items-center border-l-2 border-r-2 border-slate-800 px-2 gap-1">
                      <input 
                        type="number" 
                        value={inputC}
                        onChange={(e) => handleInputChange('c', e.target.value)}
                        className="w-14 bg-white/50 border border-blue-500/30 rounded text-xs font-black text-blue-600 text-center focus:outline-none focus:border-blue-500 transition-colors"
                        step="0.5"
                      />
                      <input 
                        type="number" 
                        value={inputD}
                        onChange={(e) => handleInputChange('d', e.target.value)}
                        className="w-14 bg-white/50 border border-emerald-500/30 rounded text-xs font-black text-emerald-600 text-center focus:outline-none focus:border-emerald-500 transition-colors"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vector Path Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <defs>
                  <marker id="arrowhead-geom" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>
                <motion.line
                  animate={{ 
                    x1: toX(params.x1), 
                    y1: toY(params.y1), 
                    x2: toX(params.x1 + params.c), 
                    y2: toY(params.y1 + params.d) 
                  }}
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  markerEnd="url(#arrowhead-geom)"
                />
              </svg>

              {/* Render Shapes */}
              {renderShape(activeShape, params.x1, params.y1, true)} {/* Ghost (Origin) */}
              {renderShape(activeShape, params.x1 + params.c, params.y1 + params.d)} {/* Resultant */}

              {/* Labels for points (simplified to center) */}
              <motion.div animate={{ x: toX(params.x1) + 15, y: toY(params.y1) - 15 }} className="absolute text-[9px] font-bold bg-slate-100 px-1 rounded border border-slate-300 text-slate-400">Titik Awal P({params.x1},{params.y1})</motion.div>
              <motion.div animate={{ x: toX(params.x1 + params.c) + 15, y: toY(params.y1 + params.d) - 15 }} className="absolute flex flex-col items-start bg-orange-100 px-2 py-1 rounded border-2 border-orange-400 shadow-lg z-30">
                <span className="text-[7px] font-black text-orange-600 uppercase leading-tight">Titik Baru</span>
                <span className="text-[10px] font-black text-slate-800">P'({params.x1 + params.c}, {params.y1 + params.d})</span>
              </motion.div>
            </motion.div>
          )}

          {activeScene === 'game' && <GameScene key="game" dx={params.c} dy={params.d} />}
          {activeScene === 'piano' && <PianoScene key="piano" dx={params.c} />}
          {activeScene === 'ship' && <ShipScene key="ship" dx={params.c} dy={params.d} />}
        </AnimatePresence>

        {/* Global Feedback Panel */}
        <div className="absolute bottom-4 right-4 bg-slate-900/10 backdrop-blur rounded-lg p-2 border border-slate-200 pointer-events-none z-30">
          <p className="text-[9px] font-black text-slate-500 flex items-center gap-2">
            <Move className="w-3 h-3" /> GESER SLIDER UNTUK TRANSLASI
          </p>
        </div>
       </div>
    </div>
  );
};

const GameScene: React.FC<{ dx: number, dy: number }> = ({ dx, dy }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 bg-slate-100 flex items-center justify-center"
  >
    <div className="relative w-64 h-64 bg-slate-200 rounded-3xl border-4 border-slate-300 shadow-inner overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#64748b 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
       
       {/* Character */}
       <motion.div 
         animate={{ x: dx * 10, y: -dy * 10 }}
         className="absolute top-1/2 left-1/2 -ml-6 -mt-6 w-12 h-12 bg-orange-500 rounded-xl shadow-lg border-2 border-orange-600 flex items-center justify-center"
       >
          <Gamepad2 className="w-6 h-6 text-white" />
       </motion.div>
    </div>
    <div className="absolute top-10 text-center">
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Simulasi Game</p>
       <h3 className="text-xl font-black text-slate-800 italic">Movement System</h3>
    </div>
  </motion.div>
);

const PianoScene: React.FC<{ dx: number }> = ({ dx }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="absolute inset-0 bg-slate-50 flex items-center justify-center"
  >
    <div className="flex gap-1 p-8 bg-white border-4 border-slate-200 rounded-3xl shadow-xl overflow-hidden">
       {Array.from({ length: 12 }).map((_, i) => (
         <motion.div 
           key={i}
           animate={{ 
             backgroundColor: Math.round(dx) === (i - 6) ? '#f97316' : '#ffffff',
             transform: Math.round(dx) === (i - 6) ? 'translateY(10px)' : 'translateY(0px)'
           }}
           className="w-10 h-40 border-2 border-slate-200 rounded-b-xl"
         />
       ))}
    </div>
    <div className="absolute top-10 text-center">
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Simulasi Musik</p>
       <h3 className="text-xl font-black text-slate-800 italic">Transposisi Nada</h3>
    </div>
  </motion.div>
);

const Cargo = ({ dx, dy }: { dx: number, dy: number }) => {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Scale dx/dy to match 3D space better
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, dx / 4, 0.1);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, dy / 4, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox args={[1.5, 0.8, 0.8]} radius={0.05} smoothness={4} position={[0, 0.4, 0]}>
         <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
      </RoundedBox>
      {/* Decorative stripes */}
      <mesh position={[0, 0.4, 0.41]}>
        <planeGeometry args={[1.4, 0.6]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
    </group>
  );
};

export const ShipScene: React.FC<{ dx: number, dy: number }> = ({ dx, dy }) => {
  return (
    <div className="w-full h-full relative group">
      <Canvas>
        <PerspectiveCamera makeDefault position={[8, 5, 8]} fov={45} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        {/* Ocean Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#0c4a6e" transparent opacity={0.8} />
        </mesh>

        {/* Deck area */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
           <planeGeometry args={[10, 10]} />
           <gridHelper args={[10, 20, "#1e293b", "#334155"]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        
        <Cargo dx={dx} dy={dy} />

        <OrbitControls enablePan={false} maxDistance={20} minDistance={5} />
      </Canvas>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1">Logistik & Distribusi</p>
         <h3 className="text-3xl font-black text-white italic tracking-tighter">
            Translasi Deck 3D
         </h3>
      </div>

      <div className="absolute bottom-24 right-10 flex flex-col items-end gap-2">
         <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right">
            <p className="text-[8px] font-bold text-blue-300 uppercase tracking-widest mb-1">Vektor Pergeseran (dx, dy)</p>
            <p className="text-2xl font-mono font-black text-white italic">[{dx.toFixed(0)}i + {dy.toFixed(0)}j]</p>
         </div>
      </div>
    </div>
  );
};
