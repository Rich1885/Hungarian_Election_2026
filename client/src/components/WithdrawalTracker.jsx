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
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
      {/* Header - clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-white">{t("withdraw.title")}</h3>
            <p className="text-[10px] text-slate-500">{t("withdraw.subtitle")}</p>
          </div>
          <span className="ml-2 px-2.5 py-1 text-xs font-bold bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/25">
            {totalWithdrawals} {t("withdraw.totalCount")}
          </span>
        </div>
        <span className={`text-slate-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-6">
          {/* NVI Stats Bar */}
          {data.nviStats && data.nviStats.total > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">{t("withdraw.nviTitle")}</span>
                <span className="text-[9px] text-slate-600">({data.nviSource})</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{data.nviStats.total}</div>
                  <div className="text-[10px] text-slate-500">{t("withdraw.nviTotal")}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-emerald-400">{data.nviStats.active}</div>
                  <div className="text-[10px] text-slate-500">{t("withdraw.nviActive")}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-400">{data.nviStats.withdrawn}</div>
                  <div className="text-[10px] text-slate-500">{t("withdraw.nviWithdrawn")}</div>
                </div>
              </div>
              {data.nviStats.withdrawn > 0 && (
                <div className="mt-3">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                      style={{ width: `${(data.nviStats.active / data.nviStats.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                    <span>{t("withdraw.nviActive")}: {((data.nviStats.active / data.nviStats.total) * 100).toFixed(1)}%</span>
                    <span>{t("withdraw.nviWithdrawn")}: {((data.nviStats.withdrawn / data.nviStats.total) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* National Withdrawals */}
          {data.nationalWithdrawals?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <path d="M3 21h18M3 7h18M5 21V7l7-4 7 4v14" />
                </svg>
                {t("withdraw.national")}
              </h4>
              <div className="space-y-3">
                {data.nationalWithdrawals.map((w, i) => (
                  <div key={i} className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PartyLogo party={w.party} size={22} />
                        <span className="text-sm font-bold text-white">{w.partyFull || w.party}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getBadgeColor(w.party)}`}>
                          {t("withdraw.noList")}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600">{w.date}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {lang === "en" ? w.description_en : w.description_hu}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <span>→</span>
                        <PartyLogo party={w.beneficiary} size={14} />
                        <span>{w.beneficiary} {t("withdraw.inFavourOf")}</span>
                      </div>
                      <a
                        href={w.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
                      >
                        {t("withdraw.source")}: {w.source_name} ↗
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
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t("withdraw.district")}
              </h4>

              {/* Timeline */}
              <div className="relative space-y-0">
                {/* Vertical line */}
                <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-700/80" />

                {data.districtWithdrawals
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((w, i) => (
                    <div key={i} className="relative pl-10 pb-4">
                      {/* Timeline dot */}
                      <div className="absolute left-[9px] top-3 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-900 z-10" />

                      <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600/50 transition-colors">
                        {/* Top row: district + date */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-white bg-slate-700/60 px-2 py-0.5 rounded">
                            {lang === "en" ? w.oevk_name_en : w.oevk_name_hu}
                          </span>
                          <span className="text-[10px] text-slate-600">{w.date}</span>
                        </div>

                        {/* Candidate info */}
                        <div className="flex items-center gap-2 mb-2">
                          <PartyLogo party={w.party} size={18} />
                          <span className="text-sm text-slate-200 font-medium">{w.candidate}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getBadgeColor(w.party)}`}>
                            {w.party}
                          </span>
                          <span className="text-[10px] text-slate-600">→</span>
                          <PartyLogo party={w.beneficiary} size={14} />
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {w.beneficiary}{w.beneficiary_candidate ? ` (${w.beneficiary_candidate})` : ""}
                          </span>
                        </div>

                        {/* Reason */}
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-2 italic">
                          &ldquo;{lang === "en" ? w.reason_en : w.reason_hu}&rdquo;
                        </p>

                        {/* Source */}
                        <a
                          href={w.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors"
                        >
                          {w.source_name} ↗
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {/* Party Strategies */}
          {data.partyStrategies?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <path d="M12 20V10M18 20V4M6 20v-4" />
                </svg>
                {t("withdraw.strategies")}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.partyStrategies.map((s, i) => {
                  const statusColors = {
                    full_withdrawal: "border-emerald-500/30 bg-emerald-500/5",
                    partial: "border-amber-500/30 bg-amber-500/5",
                    running_everywhere: "border-red-500/30 bg-red-500/5",
                    running: "border-slate-500/30 bg-slate-500/5",
                    marginal: "border-slate-600/30 bg-slate-600/5",
                  };
                  const statusLabels = {
                    full_withdrawal: t("withdraw.strategy.full"),
                    partial: t("withdraw.strategy.partial"),
                    running_everywhere: t("withdraw.strategy.everywhere"),
                    running: t("withdraw.strategy.running"),
                    marginal: t("withdraw.strategy.marginal"),
                  };
                  const statusDotColors = {
                    full_withdrawal: "bg-emerald-400",
                    partial: "bg-amber-400",
                    running_everywhere: "bg-red-400",
                    running: "bg-slate-400",
                    marginal: "bg-slate-500",
                  };
                  return (
                    <div key={i} className={`rounded-lg border p-4 ${statusColors[s.status] || "border-slate-700/50 bg-slate-800/30"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <PartyLogo party={s.party} size={22} />
                        <span className="text-sm font-bold text-white">{s.party}</span>
                        <span className={`ml-auto flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border border-current/20`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[s.status] || "bg-slate-500"}`} />
                          {statusLabels[s.status] || s.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                        {lang === "en" ? s.summary_en : s.summary_hu}
                      </p>
                      {s.source_url && (
                        <a href={s.source_url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors">
                          {s.source_name} ↗
                        </a>
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
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                {t("withdraw.oevkEstimate")}
              </h4>
              <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{data.oevkEstimate.tiszaLeaning}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{t("withdraw.oevkTisza")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{data.oevkEstimate.battleground}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{t("withdraw.oevkBattle")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{data.oevkEstimate.fideszLeaning}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{t("withdraw.oevkFidesz")}</div>
                  </div>
                </div>
                {/* Stacked bar */}
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full" style={{ width: "55%" }} />
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full" style={{ width: "21%" }} />
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-full" style={{ width: "24%" }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-3 leading-relaxed italic">
                  {lang === "en" ? data.oevkEstimate.note_en : data.oevkEstimate.note_hu}
                </p>
                {data.oevkEstimate.source_url && (
                  <a href={data.oevkEstimate.source_url} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors mt-2 inline-block">
                    {t("withdraw.source")}: {data.oevkEstimate.source_name} ↗
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notable Non-Withdrawals */}
          {data.notableNonWithdrawals?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
                {t("withdraw.nonWithdrawals")}
                <span className="text-[9px] text-slate-600 font-normal normal-case tracking-normal ml-1">— {t("withdraw.nonWithdrawals.desc")}</span>
              </h4>
              <div className="space-y-3">
                {data.notableNonWithdrawals.map((nw, i) => (
                  <div key={i} className="bg-red-500/5 rounded-lg border border-red-500/15 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white bg-slate-700/60 px-2 py-0.5 rounded">
                        {lang === "en" ? nw.oevk_name_en : nw.oevk_name_hu}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-red-500/25 bg-red-500/10 text-red-400 font-medium">
                        {t("withdraw.staysInRace")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <PartyLogo party={nw.party} size={18} />
                      <span className="text-sm text-slate-200 font-medium">{nw.candidate}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getBadgeColor(nw.party)}`}>
                        {nw.party}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-500 leading-relaxed italic flex-1">
                        &ldquo;{lang === "en" ? nw.reason_en : nw.reason_hu}&rdquo;
                      </p>
                      {nw.source_url && (
                        <a href={nw.source_url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors ml-3 flex-shrink-0">
                          {nw.source_name} ↗
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
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {t("withdraw.mszpIndep")}
                <span className="text-[9px] text-slate-600 font-normal normal-case tracking-normal ml-1">— {t("withdraw.mszpIndep.desc")}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.mszpIndependents.map((ind, i) => (
                  <div key={i} className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-red-400">{ind.candidate.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white">{ind.candidate}</div>
                        {ind.source_url && (
                          <a href={ind.source_url} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-cyan-400/60 hover:text-cyan-400 transition-colors flex-shrink-0">
                            {ind.source_name} ↗
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 bg-slate-700/60 px-1.5 py-0.5 rounded">
                          {lang === "en" ? ind.oevk_name_en : ind.oevk_name_hu}
                        </span>
                        <span className="text-[10px] text-slate-600">
                          {lang === "en" ? ind.note_en : ind.note_hu}
                        </span>
                      </div>
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
