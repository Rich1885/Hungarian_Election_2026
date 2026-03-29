export default function PriceChart({ data, isLeading }) {
  if (!data || data.length < 2) return null;

  const prices = data.map((d) => d.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 0.01;

  const w = 400;
  const h = 120;
  const padY = 10;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - padY - ((d.p - min) / range) * (h - padY * 2);
    return `${x},${y}`;
  });

  const polyline = points.join(" ");

  // Gradient fill area
  const areaPoints = `0,${h} ${polyline} ${w},${h}`;

  const color = isLeading ? "#10b981" : "#ef4444";
  const gradId = isLeading ? "grad-green" : "grad-red";

  // Time labels
  const first = data[0];
  const last = data[data.length - 1];
  const fmtTime = (t) => {
    const d = new Date(t * 1000);
    return d.toLocaleDateString("hu", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-28" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0} y1={h * f} x2={w} y2={h * f}
            stroke="#1e293b" strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        <polygon points={areaPoints} fill={`url(#${gradId})`} />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* End dot */}
        {data.length > 0 && (() => {
          const lastPt = points[points.length - 1].split(",");
          return (
            <circle cx={lastPt[0]} cy={lastPt[1]} r="3" fill={color} />
          );
        })()}
      </svg>

      {/* Labels */}
      <div className="flex justify-between text-[10px] text-slate-600 mt-1 px-1">
        <span>{fmtTime(first.t)}</span>
        <span>{(min * 100).toFixed(0)}% — {(max * 100).toFixed(0)}%</span>
        <span>{fmtTime(last.t)}</span>
      </div>
    </div>
  );
}
