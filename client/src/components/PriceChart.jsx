import { useMemo, useState } from "react";

export default function PriceChart({ data }) {
  const [timeframe, setTimeframe] = useState("1W");
  // Állapot a hover/tooltip-hez
  const [hoveredCandle, setHoveredCandle] = useState(null);

  if (!data || data.length < 5) return null;

  const w = 400;
  const h = 160; // Kicsit magasabb, hogy elférjen a tooltip
  const padY = 20;

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
    const chunkCount = 30; 
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
  const range = max - min || 0.01;
  const getY = (val) => h - padY - ((val - min) / range) * (h - padY * 2);

  const BULL_COLOR = "#0ecb81"; 
  const BEAR_COLOR = "#f6465d"; 
  const LINE_COLOR = "#1e293b"; 

  const candleWidth = (w / candles.length) * 0.6;
  const spaceWidth = w / candles.length;

  // 3. Teljesítmény kiszámítása (Mennyit változott a periódus alatt?)
  const firstPrice = candles[0].open;
  const lastPrice = candles[candles.length - 1].close;
  const deltaPrice = lastPrice - firstPrice;
  const deltaPct = (deltaPrice * 100).toFixed(1);
  const isPositive = deltaPrice >= 0;

  return (
    <div 
      className="relative group bg-[#0b0e11] p-3 rounded-xl border border-slate-800"
      onMouseLeave={() => setHoveredCandle(null)} // Ha elvisszük az egeret, eltűnik a tooltip
    >
      
      {/* ── Fejléc: Ár, Változás és Időtáv ── */}
      <div className="flex items-start justify-between mb-3 px-1">
        <div>
          <div className="text-xl font-bold text-white leading-none">
            {(lastPrice * 100).toFixed(1)}%
          </div>
          <div className={`text-xs font-semibold mt-1 ${isPositive ? "text-[#0ecb81]" : "text-[#f6465d]"}`}>
            {isPositive ? "+" : ""}{deltaPct}% <span className="text-slate-500 font-normal">({timeframe})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
          {["1W", "1M"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-colors ${
                timeframe === tf
                  ? "bg-slate-700 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grafikon ── */}
      <div className="relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
          
          {/* Rácsvonalak */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={0} y1={h * f} x2={w} y2={h * f} stroke={LINE_COLOR} strokeWidth="0.5" />
          ))}

          {/* Gyertyák */}
          {candles.map((candle, i) => {
            const isBull = candle.close >= candle.open;
            const color = isBull ? BULL_COLOR : BEAR_COLOR;
            const xCenter = i * spaceWidth + spaceWidth / 2;
            const yOpen = getY(candle.open);
            const yClose = getY(candle.close);
            const boxTop = Math.min(yOpen, yClose);
            const boxHeight = Math.max(1, Math.max(yOpen, yClose) - boxTop);

            // Ha hoverolnak a gyertyán, picit halványítjuk a többit
            const isHovered = hoveredCandle?.index === i;
            const opacity = hoveredCandle && !isHovered ? "0.3" : "1";

            return (
              <g key={i} className="transition-opacity duration-200" style={{ opacity }}>
                <line x1={xCenter} y1={getY(candle.high)} x2={xCenter} y2={getY(candle.low)} stroke={color} strokeWidth="1.5" />
                <rect x={xCenter - candleWidth / 2} y={boxTop} width={candleWidth} height={boxHeight} fill={color} rx="1" />
              </g>
            );
          })}

          {/* Aktuális ár vonala (Csak ha nincs hover) */}
          {!hoveredCandle && (
            <line
              x1={0} y1={getY(lastPrice)} x2={w} y2={getY(lastPrice)}
              stroke={lastPrice >= firstPrice ? BULL_COLOR : BEAR_COLOR}
              strokeWidth="1" strokeDasharray="3 3" className="opacity-50"
            />
          )}

          {/* ── Hover Crosshair (Függőleges vonal) ── */}
          {hoveredCandle && (
            <line
              x1={hoveredCandle.x} y1={0} x2={hoveredCandle.x} y2={h}
              stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" className="opacity-50"
            />
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
            className="absolute top-0 transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-800 border border-slate-700 text-white text-[10px] py-1 px-2 rounded pointer-events-none shadow-lg whitespace-nowrap z-10"
            style={{ left: `${(hoveredCandle.x / w) * 100}%`, marginTop: '10px' }}
          >
            <div className="text-slate-400 mb-0.5">
              {new Date(hoveredCandle.candle.t * 1000).toLocaleString("hu", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="font-bold font-mono">
              <span className="text-slate-500">O:</span> {(hoveredCandle.candle.open * 100).toFixed(1)}%{" "}
              <span className="text-slate-500 ml-1">C:</span> {(hoveredCandle.candle.close * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {/* ── Aktuális Ár Címke a Jobb Szélen ── */}
        {!hoveredCandle && (
          <div 
            className="absolute right-0 text-[9px] font-bold text-white px-1 py-0.5 rounded shadow pointer-events-none"
            style={{ 
              top: `${(getY(lastPrice) / h) * 100}%`, 
              transform: 'translateY(-50%)',
              backgroundColor: lastPrice >= firstPrice ? BULL_COLOR : BEAR_COLOR 
            }}
          >
            {(lastPrice * 100).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2 px-1 font-mono">
        <span>{new Date(filteredData[0].t * 1000).toLocaleDateString("hu", { month: "short", day: "numeric" })}</span>
        <span>{new Date(filteredData[filteredData.length - 1].t * 1000).toLocaleTimeString("hu", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
}