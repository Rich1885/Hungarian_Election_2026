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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Új state a mobil menühöz
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
            
            {/* ── Hamburger Menu Button (Only visible on mobile) ── */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> // X icon
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon
                  )}
                </svg>
              </button>
              
              {/* Aktuális tab címe mobilon a hamburger mellett */}
              <span className="ml-2 font-medium text-cyan-400 text-sm">
                {tabs.find(t => t.id === tab)?.label}
              </span>
            </div>

            {/* ── Desktop Tab buttons (Hidden on mobile) ── */}
            <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
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
            <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
              {lastUpdate && (
                <span className="text-[10px] text-slate-600 hidden lg:inline">
                  {t("app.updated")} {lastUpdate.toLocaleTimeString()}
                </span>
              )}

              {/* Language toggle with simple flags (CDN based to fix Windows issue) */}
              <button
                onClick={handleLangToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition-all group"
              >
                <div className="flex flex-col items-center leading-none">
                  <img src="https://flagcdn.com/hu.svg" alt="HU" className="w-3.5 h-auto rounded-[1px] mb-0.5 opacity-80 group-hover:opacity-100" />
                  <span className={`text-[9px] font-bold ${lang === "hu" ? "text-white" : "text-slate-600"}`}>HU</span>
                </div>
                <div className="w-px h-5 bg-slate-600" />
                <div className="flex flex-col items-center leading-none">
                  <img src="https://flagcdn.com/gb.svg" alt="EN" className="w-3.5 h-auto rounded-[1px] mb-0.5 opacity-80 group-hover:opacity-100" />
                  <span className={`text-[9px] font-bold ${lang === "en" ? "text-white" : "text-slate-600"}`}>EN</span>
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

        {/* ── Mobile Dropdown Menu ── */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/80 bg-[#0a0a0f]/95 backdrop-blur-xl absolute w-full left-0 shadow-xl">
            <div className="flex flex-col p-2 max-h-[60vh] overflow-y-auto">
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.id}
                  onClick={() => {
                    setTab(tabItem.id);
                    setIsMobileMenuOpen(false); // Close menu on click
                  }}
                  className={`px-4 py-3 text-left text-sm font-medium rounded-lg transition-all ${
                    tab === tabItem.id
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {tab === "summary" && <div className="mb-8"><Summary markets={markets} polls={polls} news={news} /></div>}
        
        {tab === "markets" && (
          <>
            {topParties.length >= 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {topParties.map((m) => (
                  <PartyCard key={m.conditionId} market={m} />
                ))}
              </div>
            )}
            {markets.length > 0 && <div className="mb-8"><OverviewTable markets={markets} /></div>}
          </>
        )}

        {tab === "polls" && (
          <>
            <PollSummary polls={polls} />
            <div className="mb-8"><PollChart polls={polls} /></div>
            <div className="mb-8"><PollTable polls={polls} /></div>
          </>
        )}

        {tab === "parliament" && <div className="mb-8"><ParliamentChart polls={livePollInput} /></div>}
        {tab === "map" && <div className="mb-8"><MapPage polls={livePollInput} /></div>}
        {tab === "withdrawals" && <div className="mb-8"><WithdrawalTracker /></div>}
        {tab === "youtube" && <div className="mb-8"><YouTubeFeed videos={youtube} /></div>}
        {tab === "news" && <div className="mb-8"><NewsFeed articles={news} /></div>}

        <footer className="text-center py-8 border-t border-slate-800">
          <p className="text-xs text-slate-600">{t("footer.data")}</p>
          <p className="text-xs text-slate-700 mt-1">{t("footer.title")}</p>
        </footer>
      </main>
    </div>
  );
}