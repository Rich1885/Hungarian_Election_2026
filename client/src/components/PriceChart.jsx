import { useMemo } from "react";

export default function PriceChart({ data }) {
  if (!data || data.length < 5) return null;

  const w = 400;
  const h = 140;
  const padY = 20;

  // 1. Lépés: Adatok csoportosítása gyertyákba (pl. 24 órás vagy bizonyos számú adatpontonként)
  const candles = useMemo(() => {
    const chunkCount = 30; // Hány gyertyát akarunk látni összesen?
    const chunkSize = Math.max(1, Math.floor(data.length / chunkCount));
    
    const result = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      if (chunk.length === 0) continue;
      
      const prices = chunk.map(d => d.p);
      result.push({
        t: chunk[0].t, // Időpont
        open: prices[0], // Első ár a blokkban
        close: prices[prices.length - 1], // Utolsó ár a blokkban
        high: Math.max(...prices), // Legmagasabb a blokkban
        low: Math.min(...prices), // Legalacsonyabb a blokkban
      });
    }
    return result;
  }, [data]);

  // Globális min/max a skálázáshoz
  const allPrices = data.map(d => d.p);
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  const range = max - min || 0.01;

  // Y-koordináta számító függvény
  const getY = (val) => h - padY - ((val - min) / range) * (h - padY * 2);

  // Színek (Binance stílus)
  const BULL_COLOR = "#0ecb81"; // Zöld (emelkedik)
  const BEAR_COLOR = "#f6465d"; // Piros (esik)
  const LINE_COLOR = "#1e293b"; // Rácsvonalak

  const candleWidth = (w / candles.length) * 0.6; // Gyertyatest szélessége
  const spaceWidth = w / candles.length;

  return (
    <div className="relative group bg-[#0b0e11] p-2 rounded-xl border border-slate-800">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
        
        {/* Halvány rácsvonalak a háttérben */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0} y1={h * f} x2={w} y2={h * f}
            stroke={LINE_COLOR}
            strokeWidth="0.5"
          />
        ))}

        {/* Gyertyák rajzolása */}
        {candles.map((candle, i) => {
          const isBull = candle.close >= candle.open; // Zöld vagy piros?
          const color = isBull ? BULL_COLOR : BEAR_COLOR;
          
          const xCenter = i * spaceWidth + spaceWidth / 2;
          
          const yOpen = getY(candle.open);
          const yClose = getY(candle.close);
          const yHigh = getY(candle.high);
          const yLow = getY(candle.low);
          
          const boxTop = Math.min(yOpen, yClose);
          const boxBottom = Math.max(yOpen, yClose);
          const boxHeight = Math.max(1, boxBottom - boxTop); // Minimum 1px magas

          return (
            <g key={i}>
              {/* Vékony "kanóc" (Wick) a High és Low között */}
              <line
                x1={xCenter} y1={yHigh}
                x2={xCenter} y2={yLow}
                stroke={color}
                strokeWidth="1.5"
              />
              
              {/* Vastag "test" (Body) az Open és Close között */}
              <rect
                x={xCenter - candleWidth / 2}
                y={boxTop}
                width={candleWidth}
                height={boxHeight}
                fill={color}
                rx="1" /* Enyhe kerekítés */
              />
            </g>
          );
        })}

        {/* Élő, aktuális ár mutatója (Jobb oldalon) */}
        <line
          x1={0} y1={getY(candles[candles.length - 1].close)}
          x2={w} y2={getY(candles[candles.length - 1].close)}
          stroke={candles[candles.length - 1].close >= candles[candles.length - 1].open ? BULL_COLOR : BEAR_COLOR}
          strokeWidth="1"
          strokeDasharray="3 3"
          className="opacity-50"
        />
      </svg>

      {/* Címkék (Alul) */}
      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 px-1 font-mono">
        <span>{new Date(data[0].t * 1000).toLocaleDateString("hu", { month: "short", day: "numeric" })}</span>
        <span className="text-slate-400">
          <span className="text-red-400">L: {(min * 100).toFixed(0)}%</span> 
          <span className="mx-2">|</span> 
          <span className="text-emerald-400">H: {(max * 100).toFixed(0)}%</span>
        </span>
        <span className="text-white bg-slate-800 px-1.5 py-0.5 rounded">
          {new Date(data[data.length - 1].t * 1000).toLocaleTimeString("hu", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}