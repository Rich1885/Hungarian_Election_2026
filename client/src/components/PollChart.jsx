import { t } from "../utils/i18n";

// Segédfüggvény a simított SVG görbe (Bézier) rajzolásához
function smoothPolyline(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cx = (p1.x + p2.x) / 2;
    path += ` C ${cx},${p1.y} ${cx},${p2.y} ${p2.x},${p2.y}`;
  }
  return path;
}

export default function PollChart({ polls }) {
  if (!polls || polls.length < 2) return null;

  // Reverse so oldest is first (polls come newest-first from API)
  const sorted = [...polls].reverse();

  const w = 700; // Szélesebb vászon, hogy szebben mutasson asztalin
  const h = 260; // Picit magasabb
  const padX = 50;
  const padY = 30;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  // Y axis: 0% to max party value + 5
  const allVals = sorted.flatMap((p) => [p.fidesz, p.tisza].filter(Boolean));
  const maxVal = Math.max(...allVals, 50) + 5;
  const minVal = Math.max(0, Math.min(...allVals) - 5);
  const rangeY = maxVal - minVal;

  const toX = (i) => padX + (i / (sorted.length - 1)) * chartW;
  const toY = (v) => padY + (1 - (v - minVal) / rangeY) * chartH;

  // Koordináták generálása a smooth görbékhez
  const fideszPoints = sorted.map((p, i) => ({ x: toX(i), y: toY(p.fidesz), val: p.fidesz, poll: p }));
  const tiszaPoints = sorted.map((p, i) => ({ x: toX(i), y: toY(p.tisza), val: p.tisza, poll: p }));

  const fideszPath = smoothPolyline(fideszPoints);
  const tiszaPath = smoothPolyline(tiszaPoints);

  // Closed paths for gradients (szépen lezárva a görbe alját)
  const fideszArea = `${fideszPath} L ${toX(sorted.length - 1)},${toY(minVal)} L ${toX(0)},${toY(minVal)} Z`;
  const tiszaArea = `${tiszaPath} L ${toX(sorted.length - 1)},${toY(minVal)} L ${toX(0)},${toY(minVal)} Z`;

  // Grid lines
  const gridLines = [];
  const step = rangeY > 30 ? 10 : 5;
  for (let v = Math.ceil(minVal / step) * step; v <= maxVal; v += step) {
    gridLines.push(v);
  }

  const govColor = "#f97316";

  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-700/50 shadow-xl overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Közvélemény Trendek</h2>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              <span className="w-2 h-2 bg-orange-500 inline-block rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="text-orange-400">Fidesz-KDNP</span>
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 bg-emerald-400 inline-block rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-emerald-400">TISZA</span>
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar pb-2">
          <div className="min-w-[500px]"> {/* Mobilon engedi scrollozni, de tartja a min. szélességet */}
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full drop-shadow-xl" style={{ height: "auto", maxHeight: 280 }}>
              
              {/* Gradients */}
              <defs>
                <linearGradient id="grad-fidesz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grad-tisza" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                
                {/* Glow filter for lines */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid & Y Axis */}
              {gridLines.map((v) => (
                <g key={v}>
                  <line
                    x1={padX} y1={toY(v)} x2={w - padX + 10} y2={toY(v)}
                    stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4"
                  />
                  <text x={padX - 10} y={toY(v) + 4} textAnchor="end" fill="#64748b" fontSize="10" fontWeight="600" className="font-mono">
                    {v}%
                  </text>
                </g>
              ))}

              {/* Fill Areas */}
              <path d={fideszArea} fill="url(#grad-fidesz)" />
              <path d={tiszaArea} fill="url(#grad-tisza)" />

              {/* Smooth Lines with Glow */}
              <path d={fideszPath} fill="none" stroke="#f97316" strokeWidth="3" filter="url(#glow)" />
              <path d={tiszaPath} fill="none" stroke="#10b981" strokeWidth="3" filter="url(#glow)" />

              {/* Interactive Hover Dots */}
              {sorted.map((p, i) => {
                const isGov = p.affiliation.toLowerCase().includes("government");
                
                return (
                  <g key={i} className="group cursor-crosshair">
                    {/* Fidesz Point */}
                    <circle cx={toX(i)} cy={toY(p.fidesz)} r="4" fill="#1e293b" stroke="#f97316" strokeWidth="2.5" className="transition-all duration-200 group-hover:r-5 group-hover:stroke-[3px]" />
                    {/* Tisza Point */}
                    <circle cx={toX(i)} cy={toY(p.tisza)} r="4" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" className="transition-all duration-200 group-hover:r-5 group-hover:stroke-[3px]" />
                    
                    {/* Hover Area (láthatatlan oszlop, hogy könnyebb legyen eltalálni egérrel) */}
                    <rect x={toX(i) - (chartW / sorted.length)/2} y={padY} width={chartW / sorted.length} height={chartH} fill="transparent">
                      <title>{`${p.date}\n${p.pollster} (${isGov ? 'Korm.' : 'Függ.'})\nTisza: ${p.tisza}%\nFidesz: ${p.fidesz}%`}</title>
                    </rect>
                  </g>
                );
              })}

              {/* Latest Value Labels at the end of the line */}
              {sorted.length > 0 && (() => {
                const last = sorted[sorted.length - 1];
                const lx = toX(sorted.length - 1);
                return (
                  <>
                    <text x={lx + 12} y={toY(last.fidesz) + 4} fill="#f97316" fontSize="12" fontWeight="800" className="font-mono shadow-sm">
                      {last.fidesz}%
                    </text>
                    <text x={lx + 12} y={toY(last.tisza) + 4} fill="#10b981" fontSize="12" fontWeight="800" className="font-mono shadow-sm">
                      {last.tisza}%
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Date Labels (X Axis) */}
        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-3 px-12 relative z-10">
          <span>{sorted[0]?.date}</span>
          <span>{sorted[Math.floor(sorted.length / 2)]?.date}</span>
          <span>{sorted[sorted.length - 1]?.date}</span>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-5 text-[10px] uppercase font-bold tracking-widest text-slate-500 relative z-10">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <span className="w-2.5 h-2.5 rounded-full border-[2.5px] border-orange-500 inline-block bg-slate-900" />
            <span className="text-slate-300">Kormánypárti kutatók köre (Hover)</span>
          </div>
        </div>
      </div>
    </div>
  );
}