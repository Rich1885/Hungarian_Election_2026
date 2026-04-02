import { useEffect, useState } from "react";
import { fetchBook, fetchHistory } from "../api";
import OrderBook from "./OrderBook";
import PriceChart from "./PriceChart";
import { t } from "../utils/i18n";
import PartyLogo from "./PartyLogo";

function fmtMoney(v) {
  if (!v) return "-";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function StatBox({ label, value }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
      <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mb-1">{label}</div>
      <div className="text-sm font-black font-mono tracking-tight drop-shadow-sm">{value}</div>
    </div>
  );
}

// ── Pártokhoz kötött stílusok ──
const PARTY_STYLES = {
  Tisza: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    line: "bg-gradient-to-r from-emerald-600 via-emerald-400 to-transparent",
    ring: "ring-emerald-500/50",
  },
  Fidesz: {
    text: "text-orange-400",
    bg: "bg-orange-500/5",
    border: "border-orange-500/30",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]",
    line: "bg-gradient-to-r from-orange-600 via-orange-400 to-transparent",
    ring: "ring-orange-500/50",
  },
  DK: {
    text: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/30",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    line: "bg-gradient-to-r from-blue-600 via-blue-400 to-transparent",
    ring: "ring-blue-500/50",
  },
  "Mi Hazánk": {
    text: "text-green-500",
    bg: "bg-green-500/5",
    border: "border-green-500/30",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    line: "bg-gradient-to-r from-green-600 via-green-400 to-transparent",
    ring: "ring-green-500/50",
  }
};

function getPartyStyle(partyName) {
  const key = Object.keys(PARTY_STYLES).find(k => 
    partyName.toLowerCase().includes(k.toLowerCase())
  );
  return PARTY_STYLES[key] || {
    text: "text-slate-300",
    bg: "bg-slate-800/10",
    border: "border-slate-700/50",
    glow: "shadow-xl",
    line: "bg-slate-700",
    ring: "ring-slate-500/50",
  };
}

export default function PartyCard({ market, isLeader = false }) {
  const [book, setBook] = useState(null);
  const [history, setHistory] = useState([]);

  const prob = parseFloat(market.outcomePrices?.[0] || 0);
  const tokenId = market.clobTokenIds?.[0];
  
  const partyName = market.groupItemTitle;
  const style = getPartyStyle(partyName);

  useEffect(() => {
    if (!tokenId) return;
    fetchBook(tokenId).then(setBook).catch(() => {});
    fetchHistory(tokenId, 80).then((d) => setHistory(d.history || d || [])).catch(() => {});
  }, [tokenId]);

  const dayChg = market.oneDayPriceChange * 100;
  const weekChg = market.oneWeekPriceChange * 100;

  return (
    <div className={`group relative bg-slate-900/60 rounded-2xl border ${style.border} ${style.glow} backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-slate-900/80`}>

      {/* Kiemelt "Leader" Badge ha ez a kártya vezet */}
      {isLeader && (
        <div className="absolute top-4 right-4 z-10">
          <span className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Favorit
          </span>
        </div>
      )}

      {/* Top Header Gradient Line */}
      <div className={`absolute top-0 left-0 w-full h-1 ${style.line}`} />

      {/* Ambient background glow */}
      <div className={`absolute -top-20 -left-20 w-64 h-64 blur-[100px] pointer-events-none opacity-40 ${style.bg}`} />

      {/* Hover glow effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[80px] pointer-events-none rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
        partyName.toLowerCase().includes('tisza') ? 'bg-emerald-500' :
        partyName.toLowerCase().includes('fidesz') ? 'bg-orange-500' :
        partyName.toLowerCase().includes('dk') ? 'bg-blue-500' :
        'bg-green-500'
      }`} />

      <div className="p-5 sm:p-7 relative z-10">
        
        {/* ── Party name & Probability ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-1 rounded-full bg-slate-950 border ${style.border} shadow-inner`}>
              <PartyLogo party={partyName} size={48} className="drop-shadow-md" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">{partyName}</h3>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium mt-1">Polymarket Esély</p>
            </div>
          </div>
          
          <div className="text-left sm:text-right">
            <div className={`text-5xl sm:text-6xl font-black tabular-nums tracking-tighter drop-shadow-md ${style.text}`}>
              {(prob * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatBox
            label={t("card.24h")}
            value={
              <span className={dayChg > 0 ? "text-emerald-400" : dayChg < 0 ? "text-red-400" : "text-slate-400"}>
                {dayChg > 0 ? "▲ " : dayChg < 0 ? "▼ " : ""}{Math.abs(dayChg).toFixed(1)}%
              </span>
            }
          />
          <StatBox
            label={t("card.7d")}
            value={
              <span className={weekChg > 0 ? "text-emerald-400" : weekChg < 0 ? "text-red-400" : "text-slate-400"}>
                {weekChg > 0 ? "▲ " : weekChg < 0 ? "▼ " : ""}{Math.abs(weekChg).toFixed(1)}%
              </span>
            }
          />
          <StatBox 
            label={t("card.vol24h")} 
            value={<span className="text-indigo-400">{fmtMoney(market.volume24hr)}</span>} 
          />
          <StatBox 
            label={t("card.liquidity")} 
            value={<span className="text-cyan-400">{fmtMoney(market.liquidity)}</span>} 
          />
        </div>

        <div className="space-y-8">
          {/* ── Price Chart ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={style.text}>
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <h4 className="text-[11px] uppercase font-bold tracking-widest text-slate-300">{t("card.priceHistory")}</h4>
            </div>
            
            <div className="w-full">
              {history.length > 0 ? (
                <PriceChart data={history} />
              ) : (
                <div className="h-[200px] w-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-600 animate-pulse">Betöltés...</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Order Book ── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={style.text}>
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <h4 className="text-[11px] uppercase font-bold tracking-widest text-slate-300">{t("card.orderBook")}</h4>
            </div>
            
            <div className="w-full">
              {book ? (
                <OrderBook data={book} />
              ) : (
                <div className="h-[200px] w-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/50">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-600 animate-pulse">Betöltés...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Market Quality ── */}
        {market.competitive > 0 && (
          <div className="mt-8 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                {t("card.marketQuality")}
              </span>
              <span className="text-xs font-black text-emerald-400 font-mono">{(market.competitive * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden ring-1 ring-slate-800 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${market.competitive * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}