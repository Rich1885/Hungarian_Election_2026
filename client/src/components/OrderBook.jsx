export default function OrderBook({ data }) {
  if (!data) return null;

  let bids = (data.bids || [])
    .map((b) => ({ price: parseFloat(b.price || b.p || 0), size: parseFloat(b.size || b.s || 0) }))
    .sort((a, b) => b.price - a.price);

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
    : "—";

  return (
    <div className="text-xs">
      {/* Spread */}
      <div className="text-center mb-3">
        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px]">
          Spread: {spread}¢
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Bids */}
        <div>
          <div className="text-emerald-500 font-semibold mb-2 text-[10px] uppercase tracking-widest">
            Vételi
          </div>
          {bids.map((b, i) => (
            <div key={i} className="relative flex justify-between py-1 px-2 rounded mb-0.5">
              <div
                className="absolute inset-0 bg-emerald-500/10 rounded"
                style={{ width: `${(b.size / maxSize) * 100}%` }}
              />
              <span className="relative text-emerald-400 font-mono">{(b.price * 100).toFixed(1)}¢</span>
              <span className="relative text-slate-400 font-mono">{b.size.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          ))}
        </div>

        {/* Asks */}
        <div>
          <div className="text-red-500 font-semibold mb-2 text-[10px] uppercase tracking-widest">
            Eladási
          </div>
          {asks.map((a, i) => (
            <div key={i} className="relative flex justify-between py-1 px-2 rounded mb-0.5">
              <div
                className="absolute inset-0 bg-red-500/10 rounded right-0 left-auto"
                style={{ width: `${(a.size / maxSize) * 100}%`, marginLeft: "auto" }}
              />
              <span className="relative text-red-400 font-mono">{(a.price * 100).toFixed(1)}¢</span>
              <span className="relative text-slate-400 font-mono">{a.size.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Depth summary */}
      {bids.length > 0 && asks.length > 0 && (() => {
        const bidVol = bids.reduce((s, b) => s + b.price * b.size, 0);
        const askVol = asks.reduce((s, a) => s + a.price * a.size, 0);
        const total = bidVol + askVol || 1;
        const bidPct = (bidVol / total) * 100;

        return (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Vételi mélység</span>
              <span>Eladási mélység</span>
            </div>
            <div className="w-full h-2 bg-red-500/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500/40 rounded-l-full"
                style={{ width: `${bidPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-emerald-400">{bidPct.toFixed(0)}%</span>
              <span className="text-red-400">{(100 - bidPct).toFixed(0)}%</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
