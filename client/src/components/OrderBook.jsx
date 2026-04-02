export default function OrderBook({ data }) {
  if (!data) return null;

  // A Bids (vételi) csökkenő sorrendben a legjobb ártól lefelé
  let bids = (data.bids || [])
    .map((b) => ({ price: parseFloat(b.price || b.p || 0), size: parseFloat(b.size || b.s || 0) }))
    .sort((a, b) => b.price - a.price);

  // Az Asks (eladási) növekvő sorrendben a legjobb ártól felfelé
  let asks = (data.asks || [])
    .map((a) => ({ price: parseFloat(a.price || a.p || 0), size: parseFloat(a.size || a.s || 0) }))
    .sort((a, b) => a.price - b.price);

  bids = bids.slice(0, 5);
  asks = asks.slice(0, 5);

  const maxSize = Math.max(
    ...bids.map((b) => b.size),
    ...asks.map((a) => a.size),
    1
  );

  const spread = asks.length > 0 && bids.length > 0
    ? ((asks[0].price - bids[0].price) * 100).toFixed(1)
    : "-";

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-4 shadow-inner relative overflow-hidden">
      
      {/* Halvány glow effekt a háttérben */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500/5 blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-red-500/5 blur-2xl pointer-events-none" />

      {/* Spread */}
      <div className="relative z-10 flex justify-center mb-4">
        <div className="inline-flex flex-col items-center justify-center px-4 py-1.5 rounded-lg bg-slate-950 border border-slate-800 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          <span className="text-[8px] uppercase font-bold tracking-widest text-slate-500 mb-0.5">Spread</span>
          <span className="text-xs font-black text-slate-300 tabular-nums font-mono">{spread}¢</span>
        </div>
      </div>

      {/* Order Book Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6">
        
        {/* Bids (Vételi) */}
        <div>
          <div className="flex justify-between items-end border-b border-slate-800 pb-1.5 mb-2">
            <div className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
              Vétel <span className="text-emerald-500/50 hidden sm:inline">(Bid)</span>
            </div>
            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Méret</div>
          </div>
          <div className="space-y-[2px]">
            {bids.map((b, i) => (
              <div key={i} className="relative flex justify-between items-center py-1.5 px-2 rounded-md group hover:bg-slate-800/50 transition-colors cursor-default">
                {/* Volume Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-emerald-500/20 to-emerald-500/5 rounded-r-md transition-all duration-500 ease-out"
                  style={{ width: `${(b.size / maxSize) * 100}%` }}
                />
                <span className="relative z-10 text-emerald-400 font-mono text-xs font-bold drop-shadow-sm">
                  {(b.price * 100).toFixed(1)}¢
                </span>
                <span className="relative z-10 text-slate-300 font-mono text-[11px] group-hover:text-white transition-colors">
                  {b.size.toLocaleString('hu-HU', { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
            {bids.length === 0 && (
              <div className="py-4 text-center text-slate-600 text-xs italic">Nincs ajánlat</div>
            )}
          </div>
        </div>

        {/* Asks (Eladási) */}
        <div>
          <div className="flex justify-between items-end border-b border-slate-800 pb-1.5 mb-2">
            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Méret</div>
            <div className="text-red-500 font-bold text-[10px] uppercase tracking-widest text-right">
              <span className="text-red-500/50 hidden sm:inline">(Ask)</span> Eladás
            </div>
          </div>
          <div className="space-y-[2px]">
            {asks.map((a, i) => (
              <div key={i} className="relative flex justify-between items-center py-1.5 px-2 rounded-md group hover:bg-slate-800/50 transition-colors cursor-default">
                {/* Volume Bar */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500/20 to-red-500/5 rounded-l-md transition-all duration-500 ease-out"
                  style={{ width: `${(a.size / maxSize) * 100}%` }}
                />
                <span className="relative z-10 text-slate-300 font-mono text-[11px] group-hover:text-white transition-colors">
                  {a.size.toLocaleString('hu-HU', { maximumFractionDigits: 0 })}
                </span>
                <span className="relative z-10 text-red-400 font-mono text-xs font-bold drop-shadow-sm">
                  {(a.price * 100).toFixed(1)}¢
                </span>
              </div>
            ))}
            {asks.length === 0 && (
              <div className="py-4 text-center text-slate-600 text-xs italic">Nincs ajánlat</div>
            )}
          </div>
        </div>
      </div>

      {/* Depth summary */}
      {bids.length > 0 && asks.length > 0 && (() => {
        const bidVol = bids.reduce((s, b) => s + b.price * b.size, 0);
        const askVol = asks.reduce((s, a) => s + a.price * a.size, 0);
        const total = bidVol + askVol || 1;
        const bidPct = (bidVol / total) * 100;

        return (
          <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest text-slate-500 mb-2">
              <span className="text-emerald-500/70">Vételi mélység</span>
              <span className="text-red-500/70">Eladási mélység</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex ring-1 ring-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
                style={{ width: `${bidPct}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-out"
                style={{ width: `${100 - bidPct}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-bold font-mono mt-2">
              <span className="text-emerald-400">{bidPct.toFixed(1)}%</span>
              <span className="text-red-400">{(100 - bidPct).toFixed(1)}%</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}