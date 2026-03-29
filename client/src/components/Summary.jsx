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
  // Market data for top 2
  const findMarket = (keyword) =>
    markets.find((m) => (m.groupItemTitle + m.slug).toLowerCase().includes(keyword));

  const tiszaMarket = findMarket("tisza");
  const fideszMarket = findMarket("fidesz");

  const tiszaProb = parseFloat(tiszaMarket?.outcomePrices?.[0] || 0) * 100;
  const fideszProb = parseFloat(fideszMarket?.outcomePrices?.[0] || 0) * 100;

  // Poll averages (last 5)
  const recentPolls = (polls || []).slice(0, 5);
  const avgFidesz = recentPolls.length
    ? recentPolls.reduce((s, p) => s + p.fidesz, 0) / recentPolls.length
    : 0;
  const avgTisza = recentPolls.length
    ? recentPolls.reduce((s, p) => s + p.tisza, 0) / recentPolls.length
    : 0;

  // Independent vs gov
  const indPolls = (polls || []).filter((p) => !p.affiliation.toLowerCase().includes("government")).slice(0, 5);
  const govPolls = (polls || []).filter((p) => p.affiliation.toLowerCase().includes("government")).slice(0, 5);
  const indAvgT = indPolls.length ? indPolls.reduce((s, p) => s + p.tisza, 0) / indPolls.length : 0;
  const indAvgF = indPolls.length ? indPolls.reduce((s, p) => s + p.fidesz, 0) / indPolls.length : 0;
  const govAvgT = govPolls.length ? govPolls.reduce((s, p) => s + p.tisza, 0) / govPolls.length : 0;
  const govAvgF = govPolls.length ? govPolls.reduce((s, p) => s + p.fidesz, 0) / govPolls.length : 0;

  // Market volume
  const totalVol = markets.reduce((s, m) => s + (m.volume || 0), 0);
  const vol24h = markets.reduce((s, m) => s + (m.volume24hr || 0), 0);

  // Latest news (top 5)
  const latestNews = (news || []).slice(0, 6);

  // Signals
  const marketLeader = tiszaProb > fideszProb ? "TISZA" : "Fidesz";
  const pollLeader = avgTisza > avgFidesz ? "TISZA" : "Fidesz";
  const signalsAlign = marketLeader === pollLeader;

  return (
    <div className="space-y-6">
      {/* Race overview */}
      <div className="card p-6">
        <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-5 text-center">{t("summary.raceOverview")}</h2>

        <div className="grid grid-cols-3 gap-4 items-center mb-6">
          {/* Fidesz side */}
          <div className="text-center">
            <PartyLogo party="Fidesz" size={48} className="mx-auto mb-2" />
            <div className="text-sm font-semibold text-orange-400 mb-2">Fidesz-KDNP</div>
            {/* Közvélemény lett a NAGY */}
            <div className="text-4xl font-black text-orange-400 tabular-nums">{avgFidesz.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-500 mt-1">{t("summary.pollAvg")}</div>
            {/* Piac lett a kicsi */}
            <div className="text-xl font-bold text-orange-400/70 mt-2 tabular-nums">{fideszProb.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-500">{t("summary.marketProb")}</div>
          </div>

          {/* Center — VS + indicator */}
          <div className="text-center">
            <div className="text-slate-600 text-2xl font-light mb-2">vs</div>
            <div className={`text-sm font-bold px-3 py-1.5 rounded-full inline-block ${
              signalsAlign
                ? marketLeader === "TISZA"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            }`}>
              {signalsAlign
                ? `${marketLeader} ${t("summary.signalsAlign")}`
                : t("summary.signalsMixed")}
            </div>
          </div>

          {/* Tisza side */}
          <div className="text-center">
            <PartyLogo party="Tisza" size={48} className="mx-auto mb-2" />
            <div className="text-sm font-semibold text-emerald-400 mb-2">TISZA</div>
            {/* Közvélemény lett a NAGY */}
            <div className="text-4xl font-black text-emerald-400 tabular-nums">{avgTisza.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-500 mt-1">{t("summary.pollAvg")}</div>
            {/* Piac lett a kicsi */}
            <div className="text-xl font-bold text-emerald-400/70 mt-2 tabular-nums">{tiszaProb.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-500">{t("summary.marketProb")}</div>
          </div>
        </div>

        {/* Comparison bar */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-slate-500 w-16">{t("summary.polls")}</span>
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-orange-500/60 rounded-l-full" style={{ width: `${avgFidesz}%` }} />
              <div className="h-full bg-emerald-500/60 rounded-r-full" style={{ width: `${avgTisza}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 w-16">{t("summary.markets")}</span>
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-orange-500/60 rounded-l-full" style={{ width: `${fideszProb}%` }} />
              <div className="h-full bg-emerald-500/60 rounded-r-full" style={{ width: `${tiszaProb}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{t("summary.pollDiff")}</div>
          <div className={`text-2xl font-black tabular-nums ${avgTisza > avgFidesz ? "text-emerald-400" : "text-orange-400"}`}>
            {Math.abs(avgTisza - avgFidesz).toFixed(1)}pp
          </div>
          <div className="text-[10px] text-slate-600 mt-1">{pollLeader} {t("summary.leads")}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{t("summary.marketDiff")}</div>
          <div className={`text-2xl font-black tabular-nums ${tiszaProb > fideszProb ? "text-emerald-400" : "text-orange-400"}`}>
            {Math.abs(tiszaProb - fideszProb).toFixed(1)}pp
          </div>
          <div className="text-[10px] text-slate-600 mt-1">{marketLeader} {t("summary.leads")}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{t("summary.vol24h")}</div>
          <div className="text-2xl font-black text-amber-400 tabular-nums">{fmtMoney(vol24h)}</div>
          <div className="text-[10px] text-slate-600 mt-1">{t("summary.polymarket")}</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{t("summary.totalVol")}</div>
          <div className="text-2xl font-black text-amber-400/70 tabular-nums">{fmtMoney(totalVol)}</div>
          <div className="text-[10px] text-slate-600 mt-1">{t("summary.total")}</div>
        </div>
      </div>

      {/* Pollster split + latest news side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pollster bias comparison */}
        <div className="card p-5">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">{t("summary.biasTitle")}</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{t("summary.biasIndep")}</span>
                <span className="text-emerald-400 font-mono">T+{(indAvgT - indAvgF).toFixed(1)}</span>
              </div>
              <div className="flex gap-1 h-6 bg-slate-800 rounded overflow-hidden">
                <div className="bg-orange-500/50 flex items-center justify-center text-[10px] text-white font-mono rounded-l"
                  style={{ width: `${indAvgF}%` }}>
                  {indAvgF.toFixed(0)}%
                </div>
                <div className="bg-emerald-500/50 flex items-center justify-center text-[10px] text-white font-mono rounded-r"
                  style={{ width: `${indAvgT}%` }}>
                  {indAvgT.toFixed(0)}%
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">{t("summary.biasGov")}</span>
                <span className="text-orange-400 font-mono">F+{(govAvgF - govAvgT).toFixed(1)}</span>
              </div>
              <div className="flex gap-1 h-6 bg-slate-800 rounded overflow-hidden">
                <div className="bg-orange-500/50 flex items-center justify-center text-[10px] text-white font-mono rounded-l"
                  style={{ width: `${govAvgF}%` }}>
                  {govAvgF.toFixed(0)}%
                </div>
                <div className="bg-emerald-500/50 flex items-center justify-center text-[10px] text-white font-mono rounded-r"
                  style={{ width: `${govAvgT}%` }}>
                  {govAvgT.toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">{t("summary.biasGap")}</span>
                <span className="text-yellow-400 font-mono font-bold">
                  {((indAvgT - indAvgF) - (govAvgT - govAvgF)).toFixed(1)}pp
                </span>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">{t("summary.biasGapDesc")}</p>
            </div>
          </div>
        </div>

        {/* Latest headlines */}
        <div className="card p-5">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">{t("summary.newsTitle")}</h3>
          <div className="space-y-0.5">
            {latestNews.map((article, i) => (
              <a
                key={i}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 group"
              >
                <div className="flex items-start gap-2">
                  <span className={`text-[10px] font-medium mt-0.5 ${SOURCE_COLORS[article.source] || "text-slate-500"}`}>
                    {article.icon || article.source.charAt(0)}
                  </span>
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors leading-snug flex-1">
                    {article.title}
                  </span>
                  <span className="text-[10px] text-slate-600 whitespace-nowrap">{timeAgoI18n(article.pubDate)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Latest poll */}
      {polls.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-widest text-slate-500">{t("summary.latestPoll")}</h3>
            <span className="text-[10px] text-slate-600">{polls[0].date} — {polls[0].pollster}</span>
          </div>
          <div className="flex items-center gap-6 justify-center">
            <div className="text-center">
              <PartyLogo party="Fidesz" size={28} className="mx-auto mb-1" />
              <div className="text-2xl font-bold text-orange-400 tabular-nums">{polls[0].fidesz}%</div>
              <div className="text-[10px] text-slate-500">Fidesz</div>
            </div>
            <div className="text-slate-600">vs</div>
            <div className="text-center">
              <PartyLogo party="Tisza" size={28} className="mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">{polls[0].tisza}%</div>
              <div className="text-[10px] text-slate-500">TISZA</div>
            </div>
            {polls[0].dk && (
              <>
                <div className="text-slate-800">|</div>
                <div className="text-center">
                  <PartyLogo party="DK" size={22} className="mx-auto mb-1" />
                  <div className="text-sm font-bold text-slate-500 tabular-nums">{polls[0].dk}%</div>
                  <div className="text-[10px] text-slate-600">DK</div>
                </div>
              </>
            )}
            {polls[0].miHazank && (
              <div className="text-center">
                <PartyLogo party="Mi Hazánk" size={22} className="mx-auto mb-1" />
                <div className="text-sm font-bold text-slate-500 tabular-nums">{polls[0].miHazank}%</div>
                <div className="text-[10px] text-slate-600">MH</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}