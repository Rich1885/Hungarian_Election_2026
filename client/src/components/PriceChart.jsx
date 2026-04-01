import { useMemo, useState } from "react";

export default function PriceChart({ data }) {
  const [timeframe, setTimeframe] = useState("1W");
  // Állapot a hover/tooltip-hez
  const [hoveredCandle, setHoveredCandle] = useState(null);

  if (!data || data.length < 5) return null;

  const w = 400;
  const h = 180; // Picit magasabb a jobb olvashatóságért
  const padY = 24;

  // 1. Adatok szűrése a kiválasztott időtáv alapján
  const filteredData = useMemo(() => {
    if (data.length === 0) return data;
    const latestTime = data[data.length - 1].t;
    let timeLimit = timeframe === "1W" 
      ? latestTime - 7 * 24 * 60 * 60 
      : latestTime - 30 * 24 * 60 * 60;

    const filtered = data.filter((d) => d.t >= timeLimit);
    return filtered.length > 5 ? filtered : data;
  }, [data, timeframe]);

  // 2. Gyertyák generálása
  const candles = useMemo(() => {
    const chunkCount = 36; // Picit több gyertya a szebb felbontásért
    const chunkSize = Math.max(1, Math.floor(filteredData.length / chunkCount));
    
    const result = [];
    for (let i = 0; i < filteredData.length; i += chunkSize) {
      const chunk = filteredData.slice(i, i + chunkSize);
      if (chunk.length === 0) continue;
      
      const prices = chunk.map(d => d.p);
      result.push({
        t: chunk[0].t,
        open: prices[0],
        close: prices[prices.length - 1],
        high: Math.max(...prices),
        low: Math.min(...prices),
      });
    }
    return result;
  }, [filteredData]);

  if (candles.length === 0) return null;

  // Globális értékek skálázáshoz
  const allPrices = filteredData.map(d => d.p);
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  // Paddingoljuk a tartományt, hogy a gyertyák ne lógjanak ki a képből
  const rangePadding = (max - min) * 0.1;
  const range = (max - min) + (rangePadding * 2) || 0.01;
  const getY = (val) => h - padY - ((val - (min - rangePadding)) / range) * (h - padY * 2);

  // Modern kripto/tőzsde színek
  const BULL_COLOR = "#10b981"; // Emerald-500
  const BEAR_COLOR = "#ef4444"; // Red-500
  const LINE_COLOR = "rgba(51, 65, 85, 0.4)"; // Slate-700/40

  const spaceWidth = w / candles.length;
  const candleWidth = spaceWidth * 0.65; // Picit vastagabb gyertyák

  // 3. Teljesítmény kiszámítása
  const firstPrice = candles[0].open;
  const lastPrice = candles[candles.length - 1].close;
  const deltaPrice = lastPrice - firstPrice;
  const deltaPct = (deltaPrice * 100).toFixed(1);
  const isPositive = deltaPrice >= 0;

  return (
    <div 
      className="relative group bg-slate-900/60 rounded-2xl border border-slate-700/50 p-4 shadow-xl overflow-hidden"
      onMouseLeave={() => setHoveredCandle(null)} 
    >
      {/* Background Glow */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none rounded-full"
        style={{ backgroundColor: isPositive ? BULL_COLOR : BEAR_COLOR }}
      />

      {/* ── Fejléc: Ár, Változás és Időtáv ── */}
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tight tabular-nums drop-shadow-sm">
              {(lastPrice * 100).toFixed(1)}%
            </span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-bold mt-1 tracking-wide ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            <span className={`flex items-center justify-center w-4 h-4 rounded-full ${isPositive ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
              {isPositive ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"></polyline></svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
              )}
            </span>
            {isPositive ? "+" : ""}{deltaPct}% 
            <span className="text-slate-500 font-medium ml-1">az elmúlt {timeframe === "1W" ? "7 napban" : "30 napban"}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950/80 rounded-full p-1 border border-slate-800 shadow-inner">
          {["1W", "1M"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
                timeframe === tf
                  ? "bg-slate-700 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grafikon ── */}
      <div className="relative z-10">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto drop-shadow-sm" preserveAspectRatio="none">
          
          {/* Rácsvonalak */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={0} y1={h * f} x2={w} y2={h * f} stroke={LINE_COLOR} strokeWidth="1" strokeDasharray="2 4" />
          ))}

          {/* Aktuális ár vonala (Csak ha nincs hover) */}
          {!hoveredCandle && (
            <line
              x1={0} y1={getY(lastPrice)} x2={w} y2={getY(lastPrice)}
              stroke={isPositive ? BULL_COLOR : BEAR_COLOR}
              strokeWidth="1.5" strokeDasharray="4 4" className="opacity-50"
            />
          )}

          {/* Gyertyák */}
          {candles.map((candle, i) => {
            const isBull = candle.close >= candle.open;
            const color = isBull ? BULL_COLOR : BEAR_COLOR;
            const xCenter = i * spaceWidth + spaceWidth / 2;
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const boxTop = Math.min(yOpen, yClose);
            const boxHeight = Math.max(1, Math.max(yOpen, yClose) - boxTop);

            // Hover effektus
            const isHovered = hoveredCandle?.index === i;
            const opacity = hoveredCandle && !isHovered ? "0.2" : "1";
            
            return (
              <g key={i} className="transition-opacity duration-300" style={{ opacity }}>
                {/* Kanóc */}
                <line x1={xCenter} y1={getY(candle.high)} x2={xCenter} y2={getY(candle.low)} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                {/* Test */}
                <rect x={xCenter - candleWidth / 2} y={boxTop} width={candleWidth} height={boxHeight} fill={color} rx="1.5" />
              </g>
            );
          })}

          {/* ── Hover Crosshair (Függőleges vonal) ── */}
          {hoveredCandle && (
            <>
              <line
                x1={hoveredCandle.x} y1={0} x2={hoveredCandle.x} y2={h}
                stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" className="opacity-40 pointer-events-none"
              />
              <circle cx={hoveredCandle.x} cy={getY(hoveredCandle.candle.close)} r="3" fill="#fff" className="pointer-events-none drop-shadow-md" />
            </>
          )}

          {/* Láthatatlan réteg a Hover érzékeléséhez */}
          {candles.map((candle, i) => {
            const xCenter = i * spaceWidth + spaceWidth / 2;
            return (
              <rect
                key={`hover-${i}`}
                x={i * spaceWidth} y={0} width={spaceWidth} height={h} fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoveredCandle({ index: i, x: xCenter, candle })}
              />
            );
          })}
        </svg>

        {/* ── Lebegő Tooltip (Pontos adatok) ── */}
        {hoveredCandle && (
          <div 
            className="absolute top-0 transform -translate-x-1/2 -translate-y-full mb-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 w-32"
            style={{ 
              left: `${Math.max(15, Math.min(85, (hoveredCandle.x / w) * 100))}%`, // Ne lógjon ki a szélén
              marginTop: '15px' 
            }}
          >
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-700/50 pb-1.5 text-center">
              {new Date(hoveredCandle.candle.t * 1000).toLocaleString("hu", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="flex flex-col items-center">
                <span className="text-slate-500 uppercase text-[8px] mb-0.5">Nyitó</span>
                <span className="text-white font-bold">{(hoveredCandle.candle.open * 100).toFixed(1)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-500 uppercase text-[8px] mb-0.5">Záró</span>
                <span className={`font-bold ${hoveredCandle.candle.close >= hoveredCandle.candle.open ? 'text-emerald-400' : 'text-red-400'}`}>
                  {(hoveredCandle.candle.close * 100).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Aktuális Ár Címke a Jobb Szélen ── */}
        {!hoveredCandle && (
          <div 
            className="absolute right-0 text-[10px] font-black text-white px-2 py-1 rounded-l-md shadow-md pointer-events-none"
            style={{ 
              top: `${(getY(lastPrice) / h) * 100}%`, 
              transform: 'translateY(-50%)',
              backgroundColor: isPositive ? BULL_COLOR : BEAR_COLOR 
            }}
          >
            {(lastPrice * 100).toFixed(1)}%
          </div>
        )}
      </div>

      {/* ── Alsó Tengely (Dátumok) ── */}
      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-4 px-1 font-bold uppercase tracking-wider">
        <span>{new Date(filteredData[0].t * 1000).toLocaleDateString("hu", { month: "short", day: "numeric" })}</span>
        <span>Ma, {new Date(filteredData[filteredData.length - 1].t * 1000).toLocaleTimeString("hu", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}