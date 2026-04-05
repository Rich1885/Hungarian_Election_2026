import { useState, useEffect } from "react";
import { fetchWithdrawals } from "../api";
import { t, getLanguage } from "../utils/i18n";
import PartyLogo from "./PartyLogo";

const PARTY_BADGE_COLORS = {
  DK: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Parbeszed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Momentum: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  MMN: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  Fuggetlen: "bg-slate-500/15 text-slate-400 border-slate-500/25",
  Tisza: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

function getBadgeColor(party) {
  return PARTY_BADGE_COLORS[party] || "bg-slate-500/15 text-slate-400 border-slate-500/25";
}

export default function WithdrawalTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetchWithdrawals()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const lang = getLanguage();

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 animate-pulse">
        <div className="h-5 bg-slate-800 rounded w-48 mb-3" />
        <div className="h-3 bg-slate-800 rounded w-72" />
      </div>
    );
  }

  if (!data) return null;

  const totalWithdrawals =
    (data.nationalWithdrawals?.length || 0) + (data.districtWithdrawals?.length || 0);

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
      {/* Header - clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-800/50 active:bg-slate-800/80 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400 drop-shadow-md">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-white tracking-wide">{t("withdraw.title")}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{t("withdraw.subtitle")}</p>
          </div>
          <span className="hidden sm:inline-block ml-4 px-3 py-1 text-xs font-bold bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/25">
            {totalWithdrawals} {t("withdraw.totalCount")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="sm:hidden px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/25">
            {totalWithdrawals}
          </span>
          <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 transition-transform duration-300 ${expanded ? "rotate-180 bg-amber-500/10 border-amber-500/20 text-amber-400" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </span>
        </div>
      </button>

      {expanded && (
        <div className="p-5 sm:p-6 border-t border-slate-800 space-y-8 bg-slate-900/30">
          
          {/* NVI Stats Bar */}
          {data.nviStats && data.nviStats.total > 0 && (
            <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">{t("withdraw.nviTitle")}</span>
                <span className="text-[9px] text-slate-500 font-mono">({data.nviSource})</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div className="text-2xl font-black text-white tabular-nums">{data.nviStats.total}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{t("withdraw.nviTotal")}</div>
                </div>
                <div className="text-center p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <div className="text-2xl font-black text-emerald-400 tabular-nums">{data.nviStats.active}</div>
                  <div className="text-[10px] text-emerald-500/70 uppercase tracking-wider mt-1">{t("withdraw.nviActive")}</div>
                </div>
                <div className="text-center p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                  <div className="text-2xl font-black text-red-400 tabular-nums">{data.nviStats.withdrawn}</div>
                  <div className="text-[10px] text-red-500/70 uppercase tracking-wider mt-1">{t("withdraw.nviWithdrawn")}</div>
                </div>
              </div>
              {data.nviStats.withdrawn > 0 && (
                <div className="mt-4">
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden ring-1 ring-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      style={{ width: `${(data.nviStats.active / data.nviStats.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2 font-mono">
                    <span className="text-emerald-500/80">{((data.nviStats.active / data.nviStats.total) * 100).toFixed(1)}% {t("withdraw.nviActive")}</span>
                    <span className="text-red-500/80">{((data.nviStats.withdrawn / data.nviStats.total) * 100).toFixed(1)}% {t("withdraw.nviWithdrawn")}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* National Withdrawals */}
          {data.nationalWithdrawals?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 21h18M3 7h18M5 21V7l7-4 7 4v14" />
                </svg>
                {t("withdraw.national")}
              </h4>
              <div className="space-y-3">
                {data.nationalWithdrawals.map((w, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 sm:p-5 hover:border-amber-500/20 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <PartyLogo party={w.party} size={28} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{w.partyFull || w.party}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadgeColor(w.party)} uppercase tracking-wider font-bold`}>
                              {t("withdraw.noList")}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">{w.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 pl-0 sm:pl-10">
                      {lang === "en" ? w.description_en : w.description_hu}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3 pl-0 sm:pl-10 pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <span className="text-emerald-500 text-[10px] uppercase font-bold tracking-wider mr-1">Támogatott:</span>
                        <PartyLogo party={w.beneficiary} size={16} />
                        <span className="text-xs font-bold text-emerald-400">{w.beneficiary}</span>
                      </div>
                      <a
                        href={w.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] font-medium text-cyan-500/80 hover:text-cyan-400 transition-colors bg-slate-900/50 px-2 py-1 rounded"
                      >
                        {w.source_name}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* District Withdrawals */}
          {data.districtWithdrawals?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t("withdraw.district")}
              </h4>

              {/* Timeline */}
              <div className="relative pl-3 sm:pl-4">
                {/* Vertical line */}
                <div className="absolute left-[15px] sm:left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-amber-500/50 via-slate-700 to-transparent" />

                {data.districtWithdrawals
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((w, i) => (
                    <div key={i} className="relative pl-8 sm:pl-10 pb-6 group">
                      {/* Timeline dot */}
                      <div className="absolute left-[-5px] sm:left-[-1px] top-5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-slate-900 z-10 group-hover:bg-amber-300 group-hover:scale-125 transition-all" />

                      <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 sm:p-5 group-hover:bg-slate-800/60 group-hover:border-slate-600/50 transition-all shadow-sm">
                        {/* Top row: district + date */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                            {lang === "en" ? w.oevk_name_en : w.oevk_name_hu}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-900/50 px-2 py-0.5 rounded">{w.date}</span>
                        </div>

                        {/* Candidate info */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <PartyLogo party={w.party} size={20} />
                            <span className="text-sm text-slate-200 font-bold">{w.candidate}</span>
                          </div>
                          <div className="hidden sm:block text-slate-600 font-light">→</div>
                          <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            <PartyLogo party={w.beneficiary} size={16} />
                            <span className="text-xs text-emerald-400 font-bold">
                              {w.beneficiary}{w.beneficiary_candidate ? ` (${w.beneficiary_candidate})` : ""}
                            </span>
                          </div>
                        </div>

                        {/* Reason */}
                        <p className="text-xs text-slate-400 leading-relaxed mb-3 border-l-2 border-slate-700 pl-3">
                          <span className="text-slate-500 text-lg leading-none mr-1">"</span>
                          {lang === "en" ? w.reason_en : w.reason_hu}
                          <span className="text-slate-500 text-lg leading-none ml-1">"</span>
                        </p>

                        {/* Source */}
                        <div className="flex justify-end">
                          <a
                            href={w.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-cyan-500/60 hover:text-cyan-400 transition-colors"
                          >
                            {w.source_name} 
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Party Strategies */}
          {data.partyStrategies?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 20V10M18 20V4M6 20v-4" />
                </svg>
                {t("withdraw.strategies")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.partyStrategies.map((s, i) => {
                  const statusStyles = {
                    full_withdrawal: { border: "border-emerald-500/30", bg: "bg-emerald-500/10", dot: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]", text: "text-emerald-400" },
                    partial: { border: "border-amber-500/30", bg: "bg-amber-500/10", dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]", text: "text-amber-400" },
                    running_everywhere: { border: "border-red-500/30", bg: "bg-red-500/10", dot: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]", text: "text-red-400" },
                    running: { border: "border-slate-500/50", bg: "bg-slate-500/10", dot: "bg-slate-400", text: "text-slate-300" },
                    marginal: { border: "border-slate-700", bg: "bg-slate-800/50", dot: "bg-slate-600", text: "text-slate-500" },
                  };
                  const labels = {
                    full_withdrawal: t("withdraw.strategy.full"),
                    partial: t("withdraw.strategy.partial"),
                    running_everywhere: t("withdraw.strategy.everywhere"),
                    running: t("withdraw.strategy.running"),
                    marginal: t("withdraw.strategy.marginal"),
                  };
                  
                  const style = statusStyles[s.status] || statusStyles.running;

                  return (
                    <div key={i} className={`rounded-xl border p-5 transition-all hover:scale-[1.02] ${style.bg} ${style.border}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <PartyLogo party={s.party} size={24} />
                          <span className="text-sm font-bold text-white">{s.party}</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-900/50 border border-slate-700/50 ${style.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {labels[s.status] || s.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed mb-4 h-16 overflow-y-auto no-scrollbar">
                        {lang === "en" ? s.summary_en : s.summary_hu}
                      </p>
                      {s.source_url && (
                        <div className="pt-3 border-t border-slate-700/50">
                          <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-cyan-500/60 hover:text-cyan-400 transition-colors">
                            {s.source_name} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OEVK Estimate */}
          {data.oevkEstimate && (
            <div>
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                {t("withdraw.oevkEstimate")}
              </h4>
              <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-5 sm:p-6 shadow-inner relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-orange-500/5 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                  <div className="text-center bg-slate-900/50 rounded-lg p-3 border border-emerald-500/20">
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 tabular-nums drop-shadow-md">{data.oevkEstimate.tiszaLeaning}</div>
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 mt-2">{t("withdraw.oevkTisza")}</div>
                  </div>
                  <div className="text-center bg-slate-900/50 rounded-lg p-3 border border-amber-500/20">
                    <div className="text-3xl sm:text-4xl font-black text-amber-400 tabular-nums drop-shadow-md">{data.oevkEstimate.battleground}</div>
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-500/80 mt-2">{t("withdraw.oevkBattle")}</div>
                  </div>
                  <div className="text-center bg-slate-900/50 rounded-lg p-3 border border-orange-500/20">
                    <div className="text-3xl sm:text-4xl font-black text-orange-400 tabular-nums drop-shadow-md">{data.oevkEstimate.fideszLeaning}</div>
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-orange-500/80 mt-2">{t("withdraw.oevkFidesz")}</div>
                  </div>
                </div>

                {/* Stacked bar */}
                <div className="relative z-10">
                  {(() => {
                    const getAverage = (val) => {
                      if (typeof val === "number") return val;
                      if (typeof val === "string" && val.includes("-")) {
                        const parts = val.split("-").map(Number);
                        return (parts[0] + parts[1]) / 2;
                      }
                      return Number(val) || 0;
                    };

                    const tVal = getAverage(data.oevkEstimate.tiszaLeaning);
                    const bVal = getAverage(data.oevkEstimate.battleground);
                    const fVal = getAverage(data.oevkEstimate.fideszLeaning);
                    const total = tVal + bVal + fVal || 106;

                    const tPct = Math.round((tVal / total) * 100);
                    const bPct = Math.round((bVal / total) * 100);
                    const fPct = 100 - tPct - bPct;

                    return (
                      <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex w-full shadow-inner ring-1 ring-slate-800">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000" style={{ width: `${tPct}%` }} />
                        <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-1000" style={{ width: `${bPct}%` }} />
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-1000" style={{ width: `${fPct}%` }} />
                      </div>
                    );
                  })()}
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between mt-4 gap-3 pt-4 border-t border-slate-700/50">
                  <p className="text-[10px] text-slate-400 leading-relaxed italic max-w-2xl">
                    {lang === "en" ? data.oevkEstimate.note_en : data.oevkEstimate.note_hu}
                  </p>
                  {data.oevkEstimate.source_url && (
                    <a href={data.oevkEstimate.source_url} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-cyan-500/60 hover:text-cyan-400 transition-colors">
                      {t("withdraw.source")}: {data.oevkEstimate.source_name} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notable Non-Withdrawals */}
          {data.notableNonWithdrawals?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
                {t("withdraw.nonWithdrawals")}
                <span className="text-[9px] text-slate-500 font-normal normal-case tracking-normal ml-1 hidden sm:inline-block">- {t("withdraw.nonWithdrawals.desc")}</span>
              </h4>
              <div className="space-y-3">
                {data.notableNonWithdrawals.map((nw, i) => (
                  <div key={i} className="bg-red-500/5 rounded-xl border border-red-500/20 p-4 sm:p-5 hover:bg-red-500/10 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-red-500/10 pb-3">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                        {lang === "en" ? nw.oevk_name_en : nw.oevk_name_hu}
                      </span>
                      <span className="text-[9px] px-2.5 py-1 rounded border border-red-500/30 bg-red-500/10 text-red-400 font-bold uppercase tracking-wider">
                        {t("withdraw.staysInRace")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <PartyLogo party={nw.party} size={24} />
                      <div>
                        <div className="text-sm text-slate-200 font-bold">{nw.candidate}</div>
                        <div className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded border ${getBadgeColor(nw.party)} uppercase tracking-wider font-bold`}>
                          {nw.party}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <p className="text-[11px] text-slate-400 leading-relaxed italic flex-1">
                        &ldquo;{lang === "en" ? nw.reason_en : nw.reason_hu}&rdquo;
                      </p>
                      {nw.source_url && (
                        <a href={nw.source_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-cyan-500/60 hover:text-cyan-400 transition-colors sm:ml-3 flex-shrink-0">
                          {nw.source_name} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MSZP Independents */}
          {data.mszpIndependents?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {t("withdraw.mszpIndep")}
                <span className="text-[9px] text-slate-500 font-normal normal-case tracking-normal ml-1 hidden sm:inline-block">- {t("withdraw.mszpIndep.desc")}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.mszpIndependents.map((ind, i) => (
                  <div key={i} className={`rounded-xl border p-4 flex items-start gap-4 transition-colors shadow-sm ${ind.updated ? "bg-amber-500/5 border-amber-500/30 hover:border-amber-500/40" : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50"}`}>
                    <div className={`w-10 h-10 mt-1 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner ${ind.updated ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30" : "bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30"}`}>
                      <span className={`text-xs font-black ${ind.updated ? "text-amber-400" : "text-red-400"}`}>{ind.candidate.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{ind.candidate}</span>
                          {ind.updated && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                              {lang === "en" ? "Updated" : "Módosult"}
                            </span>
                          )}
                        </div>
                        {ind.source_url && (
                          <a href={ind.source_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-500/60 hover:text-cyan-400 transition-colors flex-shrink-0">
                            {ind.source_name} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                          </a>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-wider bg-slate-900 inline-block px-2 py-0.5 rounded border border-slate-700 mb-2">
                        {lang === "en" ? ind.oevk_name_en : ind.oevk_name_hu}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2 rounded border border-slate-800">
                        {lang === "en" ? ind.note_en : ind.note_hu}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}