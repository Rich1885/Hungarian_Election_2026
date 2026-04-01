import { t, timeAgoI18n } from "../utils/i18n";

const SOURCE_COLORS = {
  Telex: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "444.hu": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  HVG: "bg-red-500/10 text-red-400 border-red-500/30",
  Index: "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

const SOURCE_HEADER_COLORS = {
  Telex: "text-emerald-400",
  "444.hu": "text-amber-400",
  HVG: "text-red-400",
  Index: "text-orange-400",
};

const SOURCE_HOVER_GLOW = {
  Telex: "hover:shadow-[inset_4px_0_0_rgba(16,185,129,0.4)] hover:border-emerald-500/20",
  "444.hu": "hover:shadow-[inset_4px_0_0_rgba(251,191,36,0.4)] hover:border-amber-500/20",
  HVG: "hover:shadow-[inset_4px_0_0_rgba(239,68,68,0.4)] hover:border-red-500/20",
  Index: "hover:shadow-[inset_4px_0_0_rgba(249,115,22,0.4)] hover:border-orange-500/20",
};

export default function NewsFeed({ articles }) {
  if (!articles || articles.length === 0) return null;

  const limitedArticles = articles.slice(0, 10);

  const sourceOrder = ["Telex", "444.hu", "HVG", "Index"];
  const grouped = {};
  for (const source of sourceOrder) {
    grouped[source] = [];
  }

  for (const article of limitedArticles) {
    const src = article.source;
    if (grouped[src]) {
      grouped[src].push(article);
    } else {
      grouped[src] = [article];
    }
  }

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
      
      {/* Header Area */}
      <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border border-indigo-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(99,102,241,0.15)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 drop-shadow-md">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
                <path d="M10 6h8v4h-8V6Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">{t("news.electionNews")}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Folyamatosan frissülő hírfolyam</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {articles.length} {t("news.count")}
          </span>
        </div>

        {/* Source filter legend */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(SOURCE_COLORS).map(([source, cls]) => (
            <div
              key={source}
              className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${cls}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {source}
            </div>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="p-5 sm:p-6 space-y-8 bg-slate-900/30">
        {sourceOrder.map((source) => {
          const sourceArticles = grouped[source];
          if (!sourceArticles || sourceArticles.length === 0) return null;
          
          const colorClass = SOURCE_COLORS[source] || "bg-slate-700/50 text-slate-400 border-slate-700/50";
          const headerColor = SOURCE_HEADER_COLORS[source] || "text-slate-400";
          const hoverGlow = SOURCE_HOVER_GLOW[source] || "hover:shadow-[inset_4px_0_0_rgba(148,163,184,0.4)]";

          return (
            <div key={source} className="relative">
              
              {/* Vékony vonal a szekciók között bal oldalt */}
              <div className="absolute left-[13px] top-8 bottom-[-24px] w-px bg-slate-800/80 hidden sm:block" />

              <h3 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 ${headerColor}`}>
                <span className={`hidden sm:flex w-7 h-7 rounded-full items-center justify-center bg-slate-900 border ${colorClass} z-10`}>
                  <span className="text-[10px]">{source.charAt(0)}</span>
                </span>
                {source}
              </h3>
              
              <div className="space-y-3 sm:pl-10">
                {sourceArticles.map((article, i) => (
                  <a
                    key={i}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block group bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 sm:p-5 transition-all duration-300 hover:bg-slate-800/60 ${hoverGlow}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>
                            {article.source}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {timeAgoI18n(article.pubDate)}
                          </span>
                        </div>
                        
                        <h3 className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-white transition-colors leading-snug">
                          {article.title}
                        </h3>
                        
                        {article.description && (
                          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {article.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Külső link ikon a sarokban */}
                      <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300 transition-colors flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 border-t border-slate-800 py-3 text-[10px] text-slate-600 text-center font-medium uppercase tracking-widest">
        {t("news.source")}
      </div>
    </div>
  );
}