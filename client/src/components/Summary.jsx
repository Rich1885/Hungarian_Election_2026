import PartyLogo from "./PartyLogo";
import { t, timeAgoI18n } from "../utils/i18n";

function fmtMoney(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

const SOURCE_COLORS = {
  Telex: "text-emerald-400",
  "444.hu": "text-amber-400",
  HVG: "text-red-400",
  Index: "text-amber-400",
};

export default function Summary({ markets, polls, news }) {
  const findMarket = (keyword) =>
    markets?.find((m) => (m.groupItemTitle + m.slug).toLowerCase().includes(keyword));

  const tiszaMarket = findMarket("tisza");
  const fideszMarket = findMarket("fidesz");

  const tiszaProb = parseFloat(tiszaMarket?.outcomePrices?.[0] || 0) * 100;
  const fideszProb = parseFloat(fideszMarket?.outcomePrices?.[0] || 0) * 100;

  const recentPolls = (polls || []).slice(0, 5);
  const avgFidesz = recentPolls.length
    ? recentPolls.reduce((s, p) => s + p.fidesz, 0) / recentPolls.length
    : 0;
  const avgTisza = recentPolls.length
    ? recentPolls.reduce((s, p) => s + p.tisza, 0) / recentPolls.length
    : 0;

  const indPolls = (polls || []).filter((p) => !p.affiliation.toLowerCase().includes("government")).slice(0, 5);
  const govPolls = (polls || []).filter((p) => p.affiliation.toLowerCase().includes("government")).slice(0, 5);
  const indAvgT = indPolls.length ? indPolls.reduce((s, p) => s + p.tisza, 0) / indPolls.length : 0;
  const indAvgF = indPolls.length ? indPolls.reduce((s, p) => s + p.fidesz, 0) / indPolls.length : 0;
  const govAvgT = govPolls.length ? govPolls.reduce((s, p) => s + p.tisza, 0) / govPolls.length : 0;
  const govAvgF = govPolls.length ? govPolls.reduce((s, p) => s + p.fidesz, 0) / govPolls.length : 0;

  const totalVol = markets?.reduce((s, m) => s + (m.volume || 0), 0) || 0;
  const vol24h = markets?.reduce((s, m) => s + (m.volume24hr || 0), 0) || 0;

  const latestNews = (news || []).slice(0, 6);

  const marketLeader = tiszaProb > fideszProb ? "TISZA" : "Fidesz";
  const pollLeader = avgTisza > avgFidesz ? "TISZA" : "Fidesz";
  const signalsAlign = marketLeader === pollLeader;
  
  // Normalized widths for the Hero progress bar
  const totalAvg = avgTisza + avgFidesz || 100;
  const fideszWidth = (avgFidesz / totalAvg) * 100;
  const tiszaWidth = (avgTisza / totalAvg) * 100;

  return (
    <div className="space-y-6">
      
      {/* 1. HERO RACE OVERVIEW */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6 relative overflow-hidden shadow-2xl">
        {/* Decorative background glow */}
        <div className={`absolute top-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none -translate-y-1/2 ${avgTisza > avgFidesz ? 'bg-emerald-500 -right-1/4' : 'bg-orange-500 -left-1/4'}`} />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Fidesz Team */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3">
            <div className="flex items-center gap-3 mb-2">
              <PartyLogo party="Fidesz" size={40} className="drop-shadow-lg" />
              <div className="text-xl font-bold text-slate-100 tracking-tight">FIDESZ</div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-orange-400 tabular-nums tracking-tighter">{avgFidesz.toFixed(1)}<span className="text-2xl text-orange-500/50">%</span></span>
            </div>
            <span className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">{t("summary.pollAvg")}</span>
          </div>

          {/* VS & Bar */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3">
            <div className="flex items-center gap-4 mb-4 w-full">
              <div className="h-4 flex-1 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000" style={{ width: `${fideszWidth}%` }} />
                <div className="h-full bg-gradient-to-l from-emerald-600 to-emerald-400 transition-all duration-1000" style={{ width: `${tiszaWidth}%` }} />
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${
              signalsAlign
                ? marketLeader === "TISZA"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-orange-500/10 text-orange-400 border-orange-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}>
              {signalsAlign ? `Jelenlegi befutó: ${marketLeader}` : "Megosztott előrejelzés"}
            </div>
          </div>

          {/* Tisza Team */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right w-full md:w-1/3">
            <div className="flex items-center justify-end gap-3 mb-2">
              <div className="text-xl font-bold text-slate-100 tracking-tight">TISZA</div>
              <PartyLogo party="Tisza" size={40} className="drop-shadow-lg" />
            </div>
            <div className="flex items-baseline gap-2 flex-row-reverse md:flex-row">
              <span className="text-5xl font-black text-emerald-400 tabular-nums tracking-tighter">{avgTisza.toFixed(1)}<span className="text-2xl text-emerald-500/50">%</span></span>
            </div>
            <span className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">{t("summary.pollAvg")}</span>
          </div>
        </div>
      </div>

      {/* 2. METRICS & POLYMARKET GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">Kutatók szerint</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${avgTisza > avgFidesz ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>ÉLEN: {pollLeader}</span>
          </div>
          <div className={`text-2xl font-black tabular-nums ${avgTisza > avgFidesz ? "text-emerald-400" : "text-orange-400"}`}>
            +{Math.abs(avgTisza - avgFidesz).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">Piac szerint</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${tiszaProb > fideszProb ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>ÉLEN: {marketLeader}</span>
          </div>
          <div className={`text-2xl font-black tabular-nums ${tiszaProb > fideszProb ? "text-emerald-400" : "text-orange-400"}`}>
            +{Math.abs(tiszaProb - fideszProb).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 flex flex-col justify-between">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">24h Forgalom</div>
          <div className="text-2xl font-black text-amber-400 tabular-nums">{fmtMoney(vol24h)}</div>
        </div>
        
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 flex flex-col justify-between">
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Összes Fogadás</div>
          <div className="text-2xl font-black text-amber-400/70 tabular-nums">{fmtMoney(totalVol)}</div>
        </div>
      </div>

      {/* 3. BIAS ANALYSIS & LATEST NEWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bias Card */}
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Kutatói Torzítás (Bias)</h3>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Független intézetek (átlag)</span>
                <span className="text-emerald-400 font-mono font-bold">TISZA +{(indAvgT - indAvgF).toFixed(1)}</span>
              </div>
              <div className="flex h-5 bg-slate-800 rounded-md overflow-hidden ring-1 ring-slate-900/50">
                <div className="bg-orange-500/70 flex items-center justify-center text-[10px] text-white font-mono" style={{ width: `${(indAvgF/(indAvgF+indAvgT))*100}%` }}>{indAvgF.toFixed(0)}%</div>
                <div className="bg-emerald-500/70 flex items-center justify-center text-[10px] text-white font-mono" style={{ width: `${(indAvgT/(indAvgF+indAvgT))*100}%` }}>{indAvgT.toFixed(0)}%</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Kormánypárti intézetek (átlag)</span>
                <span className="text-orange-400 font-mono font-bold">FIDESZ +{(govAvgF - govAvgT).toFixed(1)}</span>
              </div>
              <div className="flex h-5 bg-slate-800 rounded-md overflow-hidden ring-1 ring-slate-900/50">
                <div className="bg-orange-500/70 flex items-center justify-center text-[10px] text-white font-mono" style={{ width: `${(govAvgF/(govAvgF+govAvgT))*100}%` }}>{govAvgF.toFixed(0)}%</div>
                <div className="bg-emerald-500/70 flex items-center justify-center text-[10px] text-white font-mono" style={{ width: `${(govAvgT/(govAvgF+govAvgT))*100}%` }}>{govAvgT.toFixed(0)}%</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex items-start gap-3">
              <div className="mt-1 shrink-0 bg-yellow-500/10 p-1.5 rounded text-yellow-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <div className="flex gap-2 items-baseline">
                  <span className="text-yellow-400 font-mono font-bold text-lg">{((indAvgT - indAvgF) - (govAvgT - govAvgF)).toFixed(1)}%</span>
                  <span className="text-xs text-slate-300 font-medium">differencia a két oldal között</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Ekkora a szakadék a kormányközeli és a független kutatók TISZA/Fidesz előrejelzései között.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest News Feed */}
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wide">Legfrissebb Hírek</h3>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
          </div>
          
          <div className="flex-1 space-y-2">
            {latestNews.map((article, i) => (
              <a
                key={i}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors border border-transparent hover:border-slate-600/50"
              >
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`font-bold uppercase tracking-wider ${SOURCE_COLORS[article.source] || "text-slate-400"}`}>
                    {article.source}
                  </span>
                  <span className="text-slate-600 font-medium">•</span>
                  <span className="text-slate-500">{timeAgoI18n(article.pubDate)}</span>
                </div>
                <h4 className="text-xs sm:text-sm text-slate-300 group-hover:text-indigo-300 transition-colors font-medium leading-snug line-clamp-2">
                  {article.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}