import { t, timeAgoI18n } from "../utils/i18n";

const SOURCE_COLORS = {
  Telex: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "444.hu": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  HVG: "bg-red-500/10 text-red-400 border-red-500/20",
  Index: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const SOURCE_HEADER_COLORS = {
  Telex: "text-emerald-400",
  "444.hu": "text-amber-400",
  HVG: "text-red-400",
  Index: "text-amber-400",
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
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">{t("news.electionNews")}</h2>
        <span className="text-xs text-slate-500">{articles.length} {t("news.count")}</span>
      </div>

      {/* Source filter legend */}
      <div className="flex items-center gap-3 mb-5">
        {Object.entries(SOURCE_COLORS).map(([source, cls]) => (
          <span
            key={source}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${cls}`}
          >
            {source}
          </span>
        ))}
      </div>

      <div className="space-y-6">
        {sourceOrder.map((source) => {
          const sourceArticles = grouped[source];
          if (!sourceArticles || sourceArticles.length === 0) return null;
          const colorClass = SOURCE_COLORS[source] || "bg-slate-700/50 text-slate-400 border-slate-700";
          const headerColor = SOURCE_HEADER_COLORS[source] || "text-slate-400";

          return (
            <div key={source}>
              <h3 className={`text-sm font-semibold mb-3 ${headerColor}`}>{source}</h3>
              <div className="space-y-1">
                {sourceArticles.map((article, i) => (
                  <a
                    key={i}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="flex items-start gap-3 py-3 px-3 -mx-3 rounded-lg transition-colors hover:bg-slate-800/30 border-b border-slate-800/50 last:border-0">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap mt-0.5 ${colorClass}`}
                      >
                        {article.source}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm text-slate-300 group-hover:text-white transition-colors leading-snug">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {article.description}
                          </p>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-600 whitespace-nowrap mt-0.5">
                        {timeAgoI18n(article.pubDate)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-600 text-center">
        {t("news.source")}
      </div>
    </div>
  );
}
