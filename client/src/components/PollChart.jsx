export default function PollChart({ polls }) {
  if (!polls || polls.length < 2) return null;

  // Reverse so oldest is first (polls come newest-first from API)
  const sorted = [...polls].reverse();

  const w = 600;
  const h = 200;
  const padX = 40;
  const padY = 20;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  // Y axis: 0% to max party value + 5
  const allVals = sorted.flatMap((p) => [p.fidesz, p.tisza].filter(Boolean));
  const maxVal = Math.max(...allVals, 50) + 5;
  const minVal = Math.max(0, Math.min(...allVals) - 5);
  const rangeY = maxVal - minVal;

  const toX = (i) => padX + (i / (sorted.length - 1)) * chartW;
  const toY = (v) => padY + (1 - (v - minVal) / rangeY) * chartH;

  // Build polylines
  const fideszPts = sorted.map((p, i) => `${toX(i)},${toY(p.fidesz)}`).join(" ");
  const tiszaPts = sorted.map((p, i) => `${toX(i)},${toY(p.tisza)}`).join(" ");

  // Grid lines
  const gridLines = [];
  const step = rangeY > 30 ? 10 : 5;
  for (let v = Math.ceil(minVal / step) * step; v <= maxVal; v += step) {
    gridLines.push(v);
  }

  // Affiliation markers (government vs independent)
  const govColor = "#f97316"; // orange

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Közvélemény Trendek</h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-orange-500 inline-block rounded" />
            <span className="text-slate-400">Fidesz-KDNP</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" />
            <span className="text-slate-400">TISZA</span>
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 220 }}>
        {/* Grid */}
        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={padX} y1={toY(v)} x2={w - padX} y2={toY(v)}
              stroke="#1e293b" strokeWidth="0.5"
            />
            <text x={padX - 6} y={toY(v) + 3} textAnchor="end" fill="#475569" fontSize="9">
              {v}%
            </text>
          </g>
        ))}

        {/* Fidesz area */}
        <polygon
          points={`${toX(0)},${toY(minVal)} ${fideszPts} ${toX(sorted.length - 1)},${toY(minVal)}`}
          fill="url(#grad-fidesz)"
        />
        {/* Tisza area */}
        <polygon
          points={`${toX(0)},${toY(minVal)} ${tiszaPts} ${toX(sorted.length - 1)},${toY(minVal)}`}
          fill="url(#grad-tisza)"
        />

        {/* Fidesz line */}
        <polyline points={fideszPts} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Tisza line */}
        <polyline points={tiszaPts} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Dots for affiliation */}
        {sorted.map((p, i) => {
          const isGov = p.affiliation.toLowerCase().includes("government");
          return (
            <g key={i}>
              <circle cx={toX(i)} cy={toY(p.fidesz)} r="3" fill="#f97316" stroke={isGov ? govColor : "#0a0a0f"} strokeWidth="1.5" />
              <circle cx={toX(i)} cy={toY(p.tisza)} r="3" fill="#10b981" stroke={isGov ? govColor : "#0a0a0f"} strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Latest values */}
        {sorted.length > 0 && (() => {
          const last = sorted[sorted.length - 1];
          const lx = toX(sorted.length - 1);
          return (
            <>
              <text x={lx + 6} y={toY(last.fidesz) + 3} fill="#f97316" fontSize="11" fontWeight="bold">
                {last.fidesz}%
              </text>
              <text x={lx + 6} y={toY(last.tisza) + 3} fill="#10b981" fontSize="11" fontWeight="bold">
                {last.tisza}%
              </text>
            </>
          );
        })()}

        {/* Gradients */}
        <defs>
          <linearGradient id="grad-fidesz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grad-tisza" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Date labels */}
      <div className="flex justify-between text-[10px] text-slate-600 mt-1 px-10">
        <span>{sorted[0]?.date}</span>
        <span>{sorted[Math.floor(sorted.length / 2)]?.date}</span>
        <span>{sorted[sorted.length - 1]?.date}</span>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border-2 border-orange-500 inline-block" />
          Kormánypárti kutatók
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border-2 border-slate-700 inline-block" />
          Független kutatók
        </span>
      </div>
    </div>
  );
}
