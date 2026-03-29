import PartyLogo from "./PartyLogo";
import { t } from "../utils/i18n";

function fmtMoney(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtChange(v) {
  const pct = (v * 100).toFixed(1);
  if (v > 0) return <span className="text-emerald-400">+{pct}%</span>;
  if (v < 0) return <span className="text-red-400">{pct}%</span>;
  return <span className="text-slate-500">0.0%</span>;
}

export default function OverviewTable({ markets }) {
  const active = markets
    .filter((m) => m.volume > 0 || parseFloat(m.outcomePrices?.[0] || 0) > 0.01)
    .sort((a, b) => {
      const pa = parseFloat(a.outcomePrices?.[0] || 0);
      const pb = parseFloat(b.outcomePrices?.[0] || 0);
      return pb - pa;
    });

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">{t("overview.title")}</h2>
        <span className="text-xs text-slate-500">
          {active.length} {t("overview.active")}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="text-left py-3 px-2">{t("overview.rank")}</th>
              <th className="text-left py-3 px-2">{t("overview.party")}</th>
              <th className="text-right py-3 px-2">{t("overview.prob")}</th>
              <th className="py-3 px-2 w-40"></th>
              <th className="text-right py-3 px-2">{t("overview.24h")}</th>
              <th className="text-right py-3 px-2">{t("overview.vol24h")}</th>
              <th className="text-right py-3 px-2">{t("overview.totalVol")}</th>
            </tr>
          </thead>
          <tbody>
            {active.map((m, i) => {
              const prob = parseFloat(m.outcomePrices?.[0] || 0);
              const isTop = i < 2;

              return (
                <tr
                  key={m.conditionId}
                  className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/30 ${
                    isTop ? "bg-slate-800/10" : ""
                  }`}
                >
                  <td className="py-3 px-2 text-slate-500">{i + 1}</td>
                  <td className={`py-3 px-2 ${isTop ? "text-white font-semibold" : "text-slate-400"}`}>
                    <span className="inline-flex items-center gap-2">
                      <PartyLogo party={m.groupItemTitle} size={isTop ? 24 : 20} />
                      {m.groupItemTitle}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className={`font-mono font-bold ${isTop ? "text-white text-base" : "text-slate-400"}`}>
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          prob > 0.5 ? "bg-emerald-500" : prob > 0.1 ? "bg-cyan-500" : "bg-slate-600"
                        }`}
                        style={{ width: `${Math.max(1, prob * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right text-sm">
                    {fmtChange(m.oneDayPriceChange)}
                  </td>
                  <td className="py-3 px-2 text-right text-amber-400 font-mono text-xs">
                    {m.volume24hr > 0 ? fmtMoney(m.volume24hr) : "—"}
                  </td>
                  <td className="py-3 px-2 text-right text-amber-400/70 font-mono text-xs">
                    {fmtMoney(m.volume)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
