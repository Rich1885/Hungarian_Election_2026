import PartyLogo from "./PartyLogo";
import { t } from "../utils/i18n";

function fmtMoney(v) {
  if (!v) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtChange(v) {
  if (!v && v !== 0) return <span className="text-slate-600">—</span>;
  const pct = (v * 100).toFixed(1);
  if (v > 0) return <span className="text-emerald-400 font-medium">+{pct}%</span>;
  if (v < 0) return <span className="text-red-400 font-medium">{pct}%</span>;
  return <span className="text-slate-500 font-medium">0.0%</span>;
}

// ── Pártokhoz kötött stílusok ──
const PARTY_STYLES = {
  Tisza: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/10",
    bar: "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]",
  },
  Fidesz: {
    text: "text-orange-400",
    bg: "bg-orange-500/5",
    border: "border-orange-500/30",
    badgeBg: "bg-orange-500/10",
    bar: "bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.3)]",
  },
  DK: {
    text: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/30",
    badgeBg: "bg-blue-500/10",
    bar: "bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]",
  },
  "Mi Hazánk": {
    text: "text-green-500",
    bg: "bg-green-500/5",
    border: "border-green-500/30",
    badgeBg: "bg-green-500/10",
    bar: "bg-gradient-to-r from-green-600 to-green-500",
  }
};

function getPartyStyle(partyName) {
  const key = Object.keys(PARTY_STYLES).find(k => 
    partyName.toLowerCase().includes(k.toLowerCase())
  );
  return PARTY_STYLES[key] || {
    text: "text-slate-300",
    bg: "hover:bg-slate-800/40",
    border: "border-slate-600",
    badgeBg: "bg-slate-800",
    bar: "bg-slate-600",
  };
}

export default function OverviewTable({ markets }) {
  if (!markets || markets.length === 0) return null;

  const active = markets
    .filter((m) => m.volume > 0 || parseFloat(m.outcomePrices?.[0] || 0) > 0.01)
    .sort((a, b) => {
      const pa = parseFloat(a.outcomePrices?.[0] || 0);
      const pb = parseFloat(b.outcomePrices?.[0] || 0);
      return pb - pa;
    });

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center shadow-[inset_0_0_15px_rgba(99,102,241,0.15)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 drop-shadow-md">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">{t("overview.title")}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-medium">Polymarket Esélyek</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-300">
              {active.length} {t("overview.active")}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
              <th className="text-center py-4 px-4 w-12">{t("overview.rank")}</th>
              <th className="text-left py-4 px-4">{t("overview.party")}</th>
              <th className="text-right py-4 px-4">{t("overview.prob")}</th>
              <th className="py-4 px-4 w-32 sm:w-48 hidden sm:table-cell">Esély</th>
              <th className="text-right py-4 px-4">{t("overview.24h")}</th>
              <th className="text-right py-4 px-4">{t("overview.vol24h")}</th>
              <th className="text-right py-4 px-4">{t("overview.totalVol")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {active.map((m, i) => {
              const prob = parseFloat(m.outcomePrices?.[0] || 0);
              const isTop = i === 0;
              const isSecond = i === 1;
              const style = getPartyStyle(m.groupItemTitle);

              return (
                <tr
                  key={m.conditionId}
                  className={`transition-colors group ${
                    isTop || isSecond ? style.bg : "hover:bg-slate-800/40"
                  }`}
                >
                  {/* Helyezés */}
                  <td className="py-4 px-4 text-center">
                    {isTop || isSecond ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs border ${style.badgeBg} ${style.text} ${style.border}`}>
                        {i + 1}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium text-xs">{i + 1}</span>
                    )}
                  </td>

                  {/* Párt név + Logó */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={isTop ? "scale-110 drop-shadow-md transition-transform" : ""}>
                        <PartyLogo party={m.groupItemTitle} size={isTop ? 28 : 22} />
                      </div>
                      <span className={`font-medium ${isTop ? `text-base font-bold ${style.text}` : isSecond ? `font-bold ${style.text}` : "text-slate-300"}`}>
                        {m.groupItemTitle}
                      </span>
                    </div>
                  </td>

                  {/* Valószínűség (%) */}
                  <td className="py-4 px-4 text-right">
                    <span className={`font-mono font-black tracking-tight ${isTop ? "text-white text-lg drop-shadow-sm" : isSecond ? "text-slate-100 text-base" : "text-slate-400"}`}>
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </td>

                  {/* Esély Sáv (Visual bar) - Csak nem-mobilon */}
                  <td className="py-4 px-4 hidden sm:table-cell align-middle">
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar}`}
                        style={{ width: `${Math.max(2, prob * 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* 24h Változás */}
                  <td className="py-4 px-4 text-right font-mono text-[13px] tracking-tight">
                    {fmtChange(m.oneDayPriceChange)}
                  </td>

                  {/* 24h Volumen */}
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors">
                      {m.volume24hr > 0 ? fmtMoney(m.volume24hr) : <span className="text-slate-600">—</span>}
                    </span>
                  </td>

                  {/* Összes Volumen */}
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex px-2 py-1 rounded bg-slate-950 border border-slate-800 font-mono text-[13px] font-bold text-indigo-400">
                      {fmtMoney(m.volume)}
                    </span>
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer Info */}
      <div className="bg-slate-950/50 py-3 px-5 border-t border-slate-800 text-center sm:text-right">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Adatok forrása: Polymarket Blockchain</p>
      </div>
    </div>
  );
}