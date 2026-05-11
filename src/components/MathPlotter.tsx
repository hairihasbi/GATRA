import React, { useEffect, useRef, useState } from 'react';
import * as math from 'mathjs';
import { cn } from '@/src/lib/utils';
import { TransformationParams } from '@/src/types';

interface MathPlotterProps {
  baseFunction: string;
  params: TransformationParams;
  className?: string;
  showGrid?: boolean;
  scale?: number;
  hideLegend?: boolean;
  showPoints?: boolean;
  showGhost?: boolean;
}

export const MathPlotter: React.FC<MathPlotterProps> = ({
  baseFunction = 'x^2',
  params,
  className,
  showGrid = true,
  scale: propScale = 40,
  hideLegend = false,
  showPoints = true,
  showGhost = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        setDimensions({
          width: canvasRef.current.parentElement.clientWidth,
          height: canvasRef.current.parentElement.clientHeight,
        });
      }
    };

    const observer = new ResizeObserver(updateDimensions);
    if (canvasRef.current?.parentElement) {
      observer.observe(canvasRef.current.parentElement);
    }
    updateDimensions();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    const scale = propScale; // Pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    const toCanvasX = (x: number) => centerX + x * scale;
    const toCanvasY = (y: number) => centerY - y * scale;
    const fromCanvasX = (x: number) => (x - centerX) / scale;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Grid
    if (showGrid) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = Math.floor(-centerX / scale); x <= Math.ceil(centerX / scale); x++) {
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x), 0);
        ctx.lineTo(toCanvasX(x), height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = Math.floor(-centerY / scale); y <= Math.ceil(centerY / scale); y++) {
        ctx.beginPath();
        ctx.moveTo(0, toCanvasY(y));
        ctx.lineTo(width, toCanvasY(y));
        ctx.stroke();
      }
    }

    // 2. Draw Axes
    ctx.strokeStyle = '#064e3b'; // Dark emerald for axes
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // 3. Draw Base Function f(x) (Ghost)
    try {
      const f = math.parse(baseFunction).compile();
      
      if (showGhost) {
        ctx.strokeStyle = '#94a3b8'; // Visible slate gray
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.globalAlpha = 0.5;
        ctx.beginPath();

        let first = true;
        for (let px = 0; px <= width; px += 4) {
          const x = fromCanvasX(px);
          try {
            const y = f.evaluate({ x });
            if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
              const py = toCanvasY(y);
              if (first) {
                ctx.moveTo(px, py);
                first = false;
              } else {
                ctx.lineTo(px, py);
              }
            } else {
              first = true;
            }
          } catch (e) {
            first = true;
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;
      }

      // 4. Draw Transformed Function g(x)
      ctx.strokeStyle = '#f97316'; // Orange for transformed
      ctx.lineWidth = 4;
      ctx.beginPath();

      const points: {px: number, py: number, x: number, y: number}[] = [];

      let first = true;
      for (let px = 0; px <= width; px += 1) {
        let xValue = fromCanvasX(px);
        
        try {
          // Geometric Dilation from center (x1, y1) with horizontal factor b and vertical factor a
          // Formula: x_transformed = x1 + (x - x1)/b
          // y_final = y1 + a * (f(x_transformed) - y1)
          
          let transformedX = params.x1 + (xValue - params.x1) / (params.b || 1);
          if (params.reflectY) transformedX = -transformedX;

          let yValue = f.evaluate({ x: transformedX - params.c }); // c is extra translation

          if (params.reflectX) yValue = -yValue;
          let finalY = params.y1 + params.a * (yValue - params.y1) + params.d;

          const py = toCanvasY(finalY);
          
          if (typeof finalY === 'number' && !isNaN(finalY) && isFinite(finalY)) {
             points.push({px, py, x: xValue, y: finalY});
             if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true;
          }
        } catch (e) {
          first = true;
        }
      }
      ctx.stroke();

      // 5. Draw Key Points
      if (showPoints) {
          // Y-intercept
          const yInt = points.find(p => Math.abs(p.x) < 0.01);
          if (yInt) drawKeyPoint(ctx, yInt.px, yInt.py, `(0, ${yInt.y.toFixed(1)})`);

          // X-intercepts (Roots)
          for(let i=1; i<points.length; i++) {
              if ((points[i-1].y > 0 && points[i].y <= 0) || (points[i-1].y < 0 && points[i].y >= 0)) {
                  drawKeyPoint(ctx, points[i].px, points[i].py, `${points[i].x.toFixed(1)}, 0`);
              }
          }

          // Local Extrema (Vertex-like points)
          for(let i=5; i<points.length-5; i+=5) {
              const prev = points[i-5].y;
              const curr = points[i].y;
              const next = points[i+5].y;
              if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
                  drawKeyPoint(ctx, points[i].px, points[i].py, `Puncak`);
              }
          }
      }

    } catch (err) {
      console.warn("Invalid function");
    }

  }, [dimensions, baseFunction, params, showGrid, showGhost, showPoints, propScale]);

  const drawKeyPoint = (ctx: CanvasRenderingContext2D, px: number, py: number, label: string) => {
    if (py < 0 || py > dimensions.height) return;
    ctx.fillStyle = '#064e3b';
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = 'black 9px sans-serif'; ctx.fillText(label, px + 8, py - 8);
  };

  return (
    <div className={cn("relative w-full h-full bg-slate-50 overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="block"
      />
      {!hideLegend && (
        <div className="absolute top-20 left-4 flex flex-col gap-2 pointer-events-none z-10">
          <div className="flex items-center gap-2 bg-white/90 p-1.5 pr-4 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
            <div className="w-3 h-3 bg-slate-400 border border-slate-500 rounded-full ml-1" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">Fungsi Asal: {baseFunction}</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/90 p-1.5 pr-4 rounded-2xl border border-emerald-800 shadow-xl backdrop-blur-md">
            <div className="w-3 h-3 bg-orange-500 rounded-full ml-1 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest leading-none">Hasil Petualangan</span>
          </div>
        </div>
      )}
    </div>
  );
};
