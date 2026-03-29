import PartyLogo from "./PartyLogo";
import { t } from "../utils/i18n";

export default function PollTable({ polls }) {
  if (!polls || polls.length === 0) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">{t("polltable.title")}</h2>
        <span className="text-xs text-slate-500">{polls.length} {t("polltable.surveys")}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="text-left py-3 px-2">{t("polltable.date")}</th>
              <th className="text-left py-3 px-2">{t("polltable.pollster")}</th>
              <th className="text-center py-3 px-2">{t("polltable.type")}</th>
              <th className="text-right py-3 px-2">
                <span className="inline-flex items-center gap-1 text-orange-400">
                  <PartyLogo party="Fidesz" size={16} /> Fidesz
                </span>
              </th>
              <th className="text-right py-3 px-2">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <PartyLogo party="Tisza" size={16} /> TISZA
                </span>
              </th>
              <th className="text-right py-3 px-2">
                <span className="inline-flex items-center gap-1">
                  <PartyLogo party="DK" size={16} /> DK
                </span>
              </th>
              <th className="text-right py-3 px-2">
                <span className="inline-flex items-center gap-1">
                  <PartyLogo party="Mi Hazánk" size={16} /> MH
                </span>
              </th>
              <th className="text-center py-3 px-2">{t("polltable.leads")}</th>
            </tr>
          </thead>
          <tbody>
            {polls.map((p, i) => {
              const isGov = p.affiliation.toLowerCase().includes("government");
              const lead = p.tisza > p.fidesz
                ? { party: "T", value: p.tisza - p.fidesz, color: "text-emerald-400" }
                : { party: "F", value: p.fidesz - p.tisza, color: "text-orange-400" };

              return (
                <tr
                  key={i}
                  className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                >
                  <td className="py-2.5 px-2 text-slate-500 text-xs whitespace-nowrap">
                    {p.date}
                  </td>
                  <td className="py-2.5 px-2 text-slate-300 font-medium text-xs">
                    {p.pollster}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isGov
                          ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          : "bg-slate-700/50 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {isGov ? t("polltable.gov") : t("polltable.ind")}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    <span className={`font-bold ${p.fidesz >= p.tisza ? "text-orange-400" : "text-orange-400/60"}`}>
                      {p.fidesz}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    <span className={`font-bold ${p.tisza >= p.fidesz ? "text-emerald-400" : "text-emerald-400/60"}`}>
                      {p.tisza}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500 text-xs">
                    {p.dk ?? "–"}%
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500 text-xs">
                    {p.miHazank ?? "–"}%
                  </td>
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <span className={`font-mono font-bold text-xs ${lead.color}`}>
                      {lead.party}+{lead.value.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-600 text-center">
        {t("polltable.source")}
      </div>
    </div>
  );
}
