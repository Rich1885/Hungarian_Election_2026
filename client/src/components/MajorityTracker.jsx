import { useEffect, useState, useMemo } from "react";
import { fetchHistory, fetchMajority } from "../api";

const BLUE = "#3b82f6";
const W = 800;
const H = 140;
const PAD_X = 4;
const PAD_Y = 16;

function PolyLine({ data }) {
  const path = useMemo(() => {
    if (!data || data.length < 2) return null;
    const prices = data.map((d) => d.p);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = (max - min) || 0.01;
    const pad = range * 0.15;
    const lo = min - pad;
    const hi = max + pad + pad;
    const gx = (i) => PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2);
    const gy = (p) => H - PAD_Y - ((p - lo) / (hi - lo)) * (H - PAD_Y * 2);

    const pts = data.map((d, i) => [gx(i), gy(d.p)]);
    const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
    const last = pts[pts.length - 1];

    return { line, area, last };
  }, [data]);

  if (!path) return null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="polyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.3" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0.2, 0.5, 0.8].map((f) => (
        <line key={f} x1={0} y1={H * f} x2={W} y2={H * f}
          stroke="rgba(51,65,85,0.35)" strokeWidth="1" strokeDasharray="3 6" />
      ))}
      <path d={path.area} fill="url(#polyGrad)" />
      <path d={path.line} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={path.last[0]} cy={path.last[1]} r="5" fill={BLUE} />
      <circle cx={path.last[0]} cy={path.last[1]} r="10" fill={BLUE} fillOpacity="0.2" />
    </svg>
  );
}

export default function MajorityTracker() {
  const [market, setMarket] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchMajority()
      .then((m) => {
        setMarket(m);
        const tokenId = m?.clobTokenIds?.[0];
        if (tokenId) {
          fetchHistory(tokenId, 200)
            .then((d) => setHistory(d.history || d || []))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  if (!market) return null;

  const prob = parseFloat(market.outcomePrices?.[0] || 0);
  const probPct = (prob * 100).toFixed(1);
  const dayChg = market.oneDayPriceChange * 100;
  const weekChg = market.oneWeekPriceChange * 100;
  const isUp = dayChg >= 0;

  const firstDate = history[0]
    ? new Date(history[0].t * 1000).toLocaleDateString("hu", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden mb-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 pt-5 pb-3">
        {/* Left: badge + title */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 flex-shrink-0">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="text-violet-400">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">2/3 Figyelő</span>
          </div>
          <span className="text-sm font-semibold text-slate-300">TISZA nyer alkotmányos többséget?</span>
        </div>

        {/* Right: prob + changes */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <div className={`text-3xl font-black tabular-nums ${prob >= 0.5 ? "text-emerald-400" : "text-red-400"}`}>
              {probPct}%
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">esély</div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(dayChg).toFixed(1)}% <span className="font-normal opacity-70">24ó</span>
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${weekChg >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
              {weekChg >= 0 ? "▲" : "▼"} {Math.abs(weekChg).toFixed(1)}% <span className="font-normal opacity-70">7n</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-2 h-36">
        {history.length > 1
          ? <PolyLine data={history} />
          : <div className="h-full flex items-center justify-center">
              <span className="text-xs text-slate-600 uppercase tracking-widest animate-pulse">Betöltés...</span>
            </div>
        }
      </div>

      {/* Date range */}
      {firstDate && (
        <div className="flex justify-between px-5 pb-3 text-[9px] font-mono text-slate-600 uppercase tracking-wider">
          <span>{firstDate}</span>
          <span>Összes idő</span>
          <span>Ma</span>
        </div>
      )}
    </div>
  );
}
