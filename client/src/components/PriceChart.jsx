export default function PriceChart({ data, isLeading }) {
  if (!data || data.length < 2) return null;

  const prices = data.map((d) => d.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 0.01;

  const w = 400;
  const h = 120;
  const padY = 15; // Kicsit több padding, hogy a ragyogás elférjen

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - padY - ((d.p - min) / range) * (h - padY * 2);
    return { x, y };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Gradient fill area
  const areaPoints = `0,${h} ${polyline} ${w},${h}`;

  // Színek (Zöld ha vezet, Narancs/Sárga ha nem - passzol a Fidesz/Tisza színekhez)
  const color = isLeading ? "#10b981" : "#f97316";
  const gradId = isLeading ? "grad-green" : "grad-orange";

  // Time labels
  const first = data[0];
  const last = data[data.length - 1];
  const fmtTime = (t) => {
    const d = new Date(t * 1000);
    return d.toLocaleDateString("hu", { month: "short", day: "numeric" });
  };

  const lastPt = points[points.length - 1];

  return (
    <div className="relative group">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>

          {/* Glow / Ragyogás effektus */}
          <filter id={`glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Szaggatott, halvány rácsvonalak */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            y1={h * f}
            x2={w}
            y2={h * f}
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="4 4"
            className="opacity-50"
          />
        ))}

        {/* Kitöltés alatta */}
        <polygon points={areaPoints} fill={`url(#${gradId})`} />

        {/* Fő vonal (vastagabb, lekerekített végekkel, ragyogással) */}
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#glow-${gradId})`}
          className="opacity-90 transition-all duration-300"
        />

        {/* Végpont pulzáló effekttel */}
        {data.length > 0 && (
          <g transform={`translate(${lastPt.x}, ${lastPt.y})`}>
            {/* Animált külső kör (Pulzálás) */}
            <circle cx="0" cy="0" r="8" fill={color} className="opacity-20 animate-ping" />
            {/* Fix áttetsző középkör */}
            <circle cx="0" cy="0" r="4" fill={color} className="opacity-50" />
            {/* Fehér mag */}
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Szebb, formázott címkék alul */}
      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 px-1 font-medium">
        <span className="bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
          {fmtTime(first.t)}
        </span>
        <span className="text-slate-400">
          Min: <span className="text-white">{(min * 100).toFixed(0)}%</span> 
          <span className="mx-2 text-slate-700">|</span> 
          Max: <span className="text-white">{(max * 100).toFixed(0)}%</span>
        </span>
        <span className="bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
          {fmtTime(last.t)}
        </span>
      </div>
    </div>
  );
}