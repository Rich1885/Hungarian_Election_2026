import { useState, useEffect } from "react";
import { fetchEvent, fetchPolls, fetchNews, fetchYoutube } from "./api";
import Header from "./components/Header";
import OverviewTable from "./components/OverviewTable";
import PartyCard from "./components/PartyCard";
import PollChart from "./components/PollChart";
import PollTable from "./components/PollTable";
import PollSummary from "./components/PollSummary";
import NewsFeed from "./components/NewsFeed";
import Summary from "./components/Summary";
import ParliamentChart from "./components/ParliamentChart";
import MapPage from "./components/MapPage";
import YouTubeFeed from "./components/YouTubeFeed";
import WithdrawalTracker from "./components/WithdrawalTracker";
import { t, setLanguage, getLanguage } from "./utils/i18n";

export default function App() {
  const [tab, setTab] = useState("summary");
  const [lang, setLang] = useState(getLanguage());
  const [event, setEvent] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [polls, setPolls] = useState([]);
  const [news, setNews] = useState([]);
  const [youtube, setYoutube] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      const [eventData, pollData, newsData, ytData] = await Promise.all([
        fetchEvent(),
        fetchPolls(),
        fetchNews(),
        fetchYoutube().catch(() => ({ videos: [] })),
      ]);
      setMarkets(eventData.markets || []);
      setEvent(eventData);
      setPolls(pollData.polls || []);
      setNews(newsData.articles || []);
      setYoutube(ytData.videos || []);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Find top 2 parties
  const topParties = markets
    .filter((m) => {
      const name = (m.groupItemTitle + m.slug).toLowerCase();
      return name.includes("tisza") || name.includes("fidesz");
    })
    .sort((a, b) => {
      const pa = parseFloat(a.outcomePrices?.[0] || 0);
      const pb = parseFloat(b.outcomePrices?.[0] || 0);
      return pb - pa;
    });

  const livePollInput = (() => {
    if (!polls || polls.length === 0) return null;
    const recent = polls.slice(0, 5);
    const avg = (key) => recent.reduce((s, p) => s + (p[key] || 0), 0) / recent.length;
    const result = {
      Fidesz: Math.round(avg("fidesz") * 10) / 10,
      Tisza: Math.round(avg("tisza") * 10) / 10,
      "Mi Hazánk": Math.round(avg("miHazank") * 10) / 10,
      DK: Math.round(avg("dk") * 10) / 10,
      Momentum: 2,
      "MSZP-Párbeszéd": 2,
      LMP: 1,
    };
    return result.Fidesz > 0 && result.Tisza > 0 ? result : null;
  })();

  const handleLangToggle = () => {
    const next = lang === "hu" ? "en" : "hu";
    setLanguage(next);
    setLang(next);
  };

  const tabs = [
    { id: "summary", label: t("tab.summary") },
    { id: "polls", label: t("tab.polls") },
    { id: "parliament", label: t("tab.parliament") },
    { id: "map", label: t("tab.map") },
    { id: "withdrawals", label: t("tab.withdrawals") },
    { id: "news", label: t("tab.news") },
    { id: "youtube", label: t("tab.youtube") },
    { id: "markets", label: t("tab.markets") },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      {/* ── Sticky Navigation Bar ── */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Tab buttons */}
            <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                    tab === tabItem.id
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10"
                      : "text-slate-500 hover:text-white hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>

            {/* Right side: update info + lang toggle + refresh */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              {lastUpdate && (
                <span className="text-[10px] text-slate-600 hidden lg:inline">
                  {t("app.updated")} {lastUpdate.toLocaleTimeString()}
                </span>
              )}

              {/* Language toggle with flags */}
              <button
                onClick={handleLangToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition-all group"
              >
                <div className="flex flex-col items-center leading-none">
                  <span className="text-[10px]" title="Magyar">&#127469;&#127482;</span>
                  <span className={`text-[10px] font-bold ${lang === "hu" ? "text-white" : "text-slate-600"}`}>HU</span>
                </div>
                <div className="w-px h-5 bg-slate-600" />
                <div className="flex flex-col items-center leading-none">
                  <span className="text-[10px]" title="English">&#127468;&#127463;</span>
                  <span className={`text-[10px] font-bold ${lang === "en" ? "text-white" : "text-slate-600"}`}>EN</span>
                </div>
              </button>

              <button
                onClick={loadData}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-lg border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
              >
                {loading ? t("app.loading") : t("app.refresh")}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Summary tab */}
        {tab === "summary" && (
          <div className="mb-8">
            <Summary markets={markets} polls={polls} news={news} />
          </div>
        )}

        {/* Markets / Polymarket tab */}
        {tab === "markets" && (
          <>
            {topParties.length >= 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {topParties.map((m) => (
                  <PartyCard key={m.conditionId} market={m} />
                ))}
              </div>
            )}
            {markets.length > 0 && (
              <div className="mb-8">
                <OverviewTable markets={markets} />
              </div>
            )}
          </>
        )}

        {/* Polls tab */}
        {tab === "polls" && (
          <>
            <PollSummary polls={polls} />
            <div className="mb-8">
              <PollChart polls={polls} />
            </div>
            <div className="mb-8">
              <PollTable polls={polls} />
            </div>
          </>
        )}

        {/* Parliament tab */}
        {tab === "parliament" && (
          <div className="mb-8">
            <ParliamentChart polls={livePollInput} />
          </div>
        )}

        {/* Map tab */}
        {tab === "map" && (
          <div className="mb-8">
            <MapPage polls={livePollInput} />
          </div>
        )}

        {/* Withdrawals tab */}
        {tab === "withdrawals" && (
          <div className="mb-8">
            <WithdrawalTracker />
          </div>
        )}

        {/* YouTube tab */}
        {tab === "youtube" && (
          <div className="mb-8">
            <YouTubeFeed videos={youtube} />
          </div>
        )}

        {/* News tab */}
        {tab === "news" && (
          <div className="mb-8">
            <NewsFeed articles={news} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-800">
          <p className="text-xs text-slate-600">{t("footer.data")}</p>
          <p className="text-xs text-slate-700 mt-1">{t("footer.title")}</p>
        </footer>
      </main>
    </div>
  );
}
