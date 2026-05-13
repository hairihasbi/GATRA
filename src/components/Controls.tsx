import React, { useState, useMemo } from 'react';
import * as math from 'mathjs';
import { TransformationParams } from '@/src/types';
import { 
  Move, 
  Maximize, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  SlidersHorizontal, 
  Zap, 
  FlaskConical,
  Table as TableIcon,
  History,
  Eye,
  EyeOff,
  Target,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ControlsProps {
  params: TransformationParams;
  setParams: React.Dispatch<React.SetStateAction<TransformationParams>>;
  disabledFields?: (keyof TransformationParams)[];
  baseFunction?: string;
  onBaseFuncChange?: (f: string) => void;
  showPoints?: boolean;
  setShowPoints?: (v: boolean) => void;
  showGhost?: boolean;
  setShowGhost?: (v: boolean) => void;
  labMode?: 'graph' | 'gps' | 'geometry' | 'simulasi';
  activeModule?: string;
  readOnly?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
  params, 
  setParams, 
  disabledFields = [],
  baseFunction = 'x^2',
  onBaseFuncChange,
  showPoints,
  setShowPoints,
  showGhost,
  setShowGhost,
  labMode = 'graph',
  activeModule = 'translasi',
  readOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'control' | 'data' | 'history'>('control');

  const update = (field: keyof TransformationParams, value: number | boolean) => {
    if (readOnly) return;
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const isVisible = (field: keyof TransformationParams) => !disabledFields.includes(field);

  const stepsHistory = useMemo(() => {
     const steps = [];
     if (params.c !== 0) steps.push(`Geser horizontal ${Math.abs(params.c).toFixed(1)} unit ke ${params.c > 0 ? 'kanan' : 'kiri'}`);
     if (params.d !== 0) steps.push(`Geser vertikal ${Math.abs(params.d).toFixed(1)} unit ke ${params.d > 0 ? 'atas' : 'bawah'}`);
     if (params.a !== 1) {
       if (activeModule === 'dilatasi') {
         steps.push(`Dilatasi dengan faktor skala ${params.a.toFixed(1)}`);
       } else {
         steps.push(`Regang/Susut vertikal dengan faktor ${params.a.toFixed(1)}`);
       }
     }
     if (params.b !== 1) steps.push(`Regang/Susut horizontal dengan faktor ${params.b.toFixed(1)}`);
     if (params.reflectX) steps.push(`Refleksi terhadap sumbu X`);
     if (params.reflectY) steps.push(`Refleksi terhadap sumbu Y`);
     return steps;
  }, [params, activeModule]);

  return (
    <div className="flex flex-col gap-0 bg-[#fdfaf3] border-l border-[#e8dfc4] h-full overflow-hidden w-full lg:w-72 shadow-xl">
      {/* Tab Header */}
      <div className="flex border-b border-[#e8dfc4] bg-emerald-950 p-1">
         <button 
           onClick={() => setActiveTab('control')}
           className={cn("flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all", activeTab === 'control' ? "bg-white/20 text-orange-400" : "text-emerald-100/60 hover:text-emerald-100")}
         >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-wider">Kontrol</span>
         </button>
         <button 
           onClick={() => setActiveTab('data')}
           className={cn("flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all", activeTab === 'data' ? "bg-white/20 text-orange-400" : "text-emerald-100/60 hover:text-emerald-100")}
         >
            <TableIcon className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-wider">Data</span>
         </button>
         <button 
           onClick={() => setActiveTab('history')}
           className={cn("flex-1 py-2.5 flex flex-col items-center gap-1 rounded-xl transition-all", activeTab === 'history' ? "bg-white/20 text-orange-400" : "text-emerald-100/60 hover:text-emerald-100")}
         >
            <History className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-wider">Riwayat</span>
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'control' && (
          <>
            {(labMode === 'gps' || labMode === 'geometry' || labMode === 'simulasi') && (
              <div className={cn(
                "p-4 rounded-2xl mb-4 flex items-center gap-3 border shadow-md",
                labMode === 'gps' ? "bg-emerald-50 border-emerald-200" : 
                labMode === 'geometry' ? "bg-indigo-50 border-indigo-200" :
                "bg-orange-50 border-orange-200"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg border border-white/30",
                  labMode === 'gps' ? "bg-emerald-600" : 
                  labMode === 'geometry' ? "bg-indigo-600" :
                  "bg-orange-600"
                )}>
                  {labMode === 'gps' ? <Compass className="w-6 h-6 animate-spin-slow" /> : 
                   labMode === 'geometry' ? <Layers className="w-6 h-6" /> :
                   <Sparkles className="w-6 h-6" />}
                </div>
                <div>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] mb-0.5",
                    labMode === 'gps' ? "text-emerald-700" : 
                    labMode === 'geometry' ? "text-indigo-700" :
                    "text-orange-700"
                  )}>Mode {labMode === 'gps' ? 'Navigasi' : labMode === 'geometry' ? 'Bangun Datar' : 'Simulasi Nyata'}</p>
                  <p className={cn(
                    "text-[11px] font-bold leading-tight",
                    labMode === 'gps' ? "text-emerald-950" : 
                    labMode === 'geometry' ? "text-indigo-950" :
                    "text-orange-950"
                  )}>
                    {labMode === 'simulasi' 
                      ? (activeModule === 'refleksi' ? 'Aktifkan refleksi untuk melihat bayangan!' : 'Pilih skenario dan geser slider untuk mengubah ukuran objek!')
                      : `Geser slider untuk melihat pergeseran ${labMode === 'gps' ? 'objek' : 'bangun datar'}!`}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6 bg-white p-6 rounded-[24px] border border-emerald-100 shadow-md">
              {isVisible('x1') && (labMode === 'gps' || labMode === 'geometry' || activeModule === 'dilatasi') && (
                <ControlGroup 
                  label={activeModule === 'dilatasi' ? "Pusat Dilatasi X (a)" : "Titik Awal X (x₁)"} 
                  icon={<Target className="w-4 h-4" />} 
                  value={params.x1} 
                  min={-10} 
                  max={10} 
                  step={0.1} 
                  onChange={(v) => update('x1', v)} 
                  readOnly={readOnly}
                />
              )}
              {isVisible('y1') && (labMode === 'gps' || labMode === 'geometry' || activeModule === 'dilatasi') && (
                <ControlGroup 
                  label={activeModule === 'dilatasi' ? "Pusat Dilatasi Y (b)" : "Titik Awal Y (y₁)"} 
                  icon={<Target className="w-4 h-4 rotate-90" />} 
                  value={params.y1} 
                  min={-10} 
                  max={10} 
                  step={0.1} 
                  onChange={(v) => update('y1', v)} 
                  readOnly={readOnly}
                />
              )}
              {isVisible('d') && (
                <ControlGroup label="Mendaki Vertikal (d)" icon={<Move className="w-4 h-4" />} value={params.d} min={-10} max={10} step={0.1} onChange={(v) => update('d', v)} readOnly={readOnly} />
              )}
              {isVisible('c') && (
                <ControlGroup label="Geser Horizontal (c)" icon={<Move className="w-4 h-4 rotate-90" />} value={params.c} min={-10} max={10} step={0.1} onChange={(v) => update('c', v)} readOnly={readOnly} />
              )}
              {isVisible('a') && (
                <ControlGroup label="Peregangan Tinggi (a)" icon={<Maximize className="w-4 h-4" />} value={params.a} min={0.1} max={5} step={0.1} onChange={(v) => update('a', v)} readOnly={readOnly} />
              )}
              {isVisible('b') && (
                <ControlGroup label="Kerapatan Lebar (b)" icon={<Maximize className="w-4 h-4 rotate-90" />} value={params.b} min={0.1} max={5} step={0.1} onChange={(v) => update('b', v)} readOnly={readOnly} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={readOnly}
                onClick={() => update('reflectX', !params.reflectX)}
                className={cn("flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all active:scale-95 shadow-md", params.reflectX ? "bg-orange-600 border-orange-700 text-white shadow-orange-900/20" : "bg-white border-emerald-100 text-emerald-950 hover:border-emerald-400", readOnly && "opacity-50 cursor-not-allowed")}
              >
                <FlipHorizontal className="w-6 h-6" />
                <span className="text-[10px] uppercase font-black tracking-widest">Cermin X</span>
              </button>
              <button
                disabled={readOnly}
                onClick={() => update('reflectY', !params.reflectY)}
                className={cn("flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all active:scale-95 shadow-md", params.reflectY ? "bg-orange-600 border-orange-700 text-white shadow-orange-900/20" : "bg-white border-emerald-100 text-emerald-950 hover:border-emerald-400", readOnly && "opacity-50 cursor-not-allowed")}
              >
                <FlipVertical className="w-6 h-6" />
                <span className="text-[10px] uppercase font-black tracking-widest">Cermin Y</span>
              </button>
            </div>

            <div className="bg-emerald-950 p-4 rounded-3xl shadow-xl border-2 border-emerald-800">
               <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] text-emerald-500 uppercase font-black tracking-[0.2em]">Persamaan Terkini</p>
                  <Zap className="w-4 h-4 text-orange-400" />
               </div>
               <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <code className="text-[12px] font-mono text-orange-200 block text-center leading-sm">
                    g(x) = {params.reflectX ? '-' : ''}{params.a !== 1 ? params.a.toFixed(1) : ''}f({params.reflectY ? '-' : ''}{params.b !== 1 ? params.b.toFixed(1) : ''}(x {params.c >= 0 ? '-' : '+'} {Math.abs(params.c).toFixed(1)})) {params.d >= 0 ? '+' : '-'} {Math.abs(params.d).toFixed(1)}
                  </code>
               </div>
            </div>

            {labMode === 'graph' && (
              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                  <FlaskConical className="w-3 h-3" /> Fungsi Induk
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'x^2', label: 'Parabola' },
                    { id: 'x^3', label: 'Kubik' },
                    { id: 'abs(x)', label: 'Mutlak' },
                    { id: 'sin(x)', label: 'Sinus' },
                    { id: '2^x', label: 'Eksponen' },
                    { id: '1/x', label: 'Rasional' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onBaseFuncChange?.(f.id)}
                      className={cn("py-2 px-1 text-[9px] font-black rounded-xl border-2 transition-all", baseFunction === f.id ? "bg-orange-500 border-orange-600 text-white" : "bg-white border-slate-200 text-slate-400 hover:border-emerald-300")}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {labMode === 'graph' && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                <Eye className="w-3 h-3" /> Visibilitas
              </p>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setShowGhost?.(!showGhost)}
                   className={cn("flex-1 py-3 px-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all", showGhost ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-100 text-slate-300")}
                 >
                    {showGhost ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="text-[8px] font-black uppercase">Fungsi Asal</span>
                 </button>
                 <button 
                   onClick={() => setShowPoints?.(!showPoints)}
                   className={cn("flex-1 py-3 px-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all", showPoints ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-100 text-slate-300")}
                 >
                    <Target className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase">Titik Kritis</span>
                 </button>
              </div>
            </div>
          )}
        </>
      )}

        {activeTab === 'data' && (
          <div className="space-y-4">
             <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Tabel Nilai (x, g(x))</h4>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                   <table className="w-full text-[11px] font-mono">
                      <thead className="bg-slate-50">
                         <tr>
                            <th className="p-2 border-b border-slate-100 text-left">x</th>
                            <th className="p-2 border-b border-slate-100 text-left">g(x)</th>
                         </tr>
                      </thead>
                      <tbody>
                         {[-2, -1, 0, 1, 2, 3].map(x => (
                           <tr key={x}>
                              <td className="p-2 border-b border-slate-50">{x}</td>
                              <td className="p-2 border-b border-slate-50 font-bold text-orange-600">
                                 {(() => {
                                     try {
                                        const f = math.parse(baseFunction).compile();
                                        let transformedX = params.b * (x - params.c);
                                        if (params.reflectY) transformedX = -transformedX;
                                        let yValue = f.evaluate({ x: transformedX });
                                        if (params.reflectX) yValue = -yValue;
                                        let finalY = params.a * yValue + params.d;
                                        return finalY.toFixed(2);
                                     } catch { return "Err"; }
                                 })()}
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                   <p className="p-2 text-[8px] text-slate-400 italic text-center">Tabel dinamis membantu pemahaman titik.</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'history' && (
           <div className="space-y-4">
              <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm">
                 <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Langkah Transformasi</h4>
                 {stepsHistory.length > 0 ? (
                    <div className="space-y-3">
                       {stepsHistory.map((step, idx) => (
                         <div key={idx} className="flex gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">{idx+1}</div>
                            <p className="text-[11px] text-slate-600 font-medium leading-tight">{step}</p>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <p className="text-[11px] text-slate-400 italic text-center py-8">Belum ada transformasi yang diterapkan.</p>
                 )}
              </div>
           </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
         <button
          onClick={() => setParams({ a: 1, b: 1, c: 0, d: 0, x1: 0, y1: 0, reflectX: false, reflectY: false, rotation: 0 })}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950 text-emerald-100 hover:bg-black transition-all border-b-2 border-emerald-900 active:border-b-0 active:translate-y-1 shadow-md group"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[9px] font-black uppercase tracking-widest">Reset Eksperimen</span>
        </button>
      </div>
    </div>
  );
};

interface ControlGroupProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  readOnly?: boolean;
}

const ControlGroup: React.FC<ControlGroupProps> = ({ label, icon, value, min, max, step, onChange, readOnly = false }) => (
  <div className="flex flex-col gap-2 py-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-700">
        <div className="p-1.5 bg-slate-100 rounded-lg border border-slate-200 shadow-sm">
           {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
        </div>
        <span className="text-[11px] uppercase font-black tracking-widest text-slate-900">{label}</span>
      </div>
      <span className="text-sm font-mono font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 shadow-inner">{value.toFixed(1)}</span>
    </div>
    <div className="relative group px-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={readOnly}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn("w-full h-6 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600 border border-slate-200/50 hover:border-orange-200 transition-all shadow-inner", readOnly && "opacity-50 cursor-not-allowed")}
      />
    </div>
  </div>
);
