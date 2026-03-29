import PartyLogo from "./PartyLogo";
import { t } from "../utils/i18n";

export default function PollSummary({ polls }) {
  if (!polls || polls.length === 0) return null;

  // Calculate averages from last 5 polls
  const recent = polls.slice(0, 5);
  const avgFidesz = recent.reduce((s, p) => s + p.fidesz, 0) / recent.length;
  const avgTisza = recent.reduce((s, p) => s + p.tisza, 0) / recent.length;

  // Independent vs government averages (last 5 each)
  const indPolls = polls.filter((p) => !p.affiliation.toLowerCase().includes("government"));
  const govPolls = polls.filter((p) => p.affiliation.toLowerCase().includes("government"));

  const indRecent = indPolls.slice(0, 5);
  const govRecent = govPolls.slice(0, 5);

  const indAvgF = indRecent.length ? indRecent.reduce((s, p) => s + p.fidesz, 0) / indRecent.length : 0;
  const indAvgT = indRecent.length ? indRecent.reduce((s, p) => s + p.tisza, 0) / indRecent.length : 0;
  const govAvgF = govRecent.length ? govRecent.reduce((s, p) => s + p.fidesz, 0) / govRecent.length : 0;
  const govAvgT = govRecent.length ? govRecent.reduce((s, p) => s + p.tisza, 0) / govRecent.length : 0;

  const leader = avgTisza > avgFidesz ? "TISZA" : "Fidesz";
  const leadAmt = Math.abs(avgTisza - avgFidesz);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Overall average */}
      <div className="card p-6 text-center">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t("pollsummary.overall")}</h3>
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="text-center">
            <PartyLogo party="Fidesz" size={36} className="mx-auto mb-1" />
            <div className="text-3xl font-black text-orange-400 tabular-nums">{avgFidesz.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Fidesz-KDNP</div>
          </div>
          <div className="text-slate-600 text-lg">vs</div>
          <div className="text-center">
            <PartyLogo party="Tisza" size={36} className="mx-auto mb-1" />
            <div className="text-3xl font-black text-emerald-400 tabular-nums">{avgTisza.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">TISZA</div>
          </div>
        </div>
        <div className={`text-sm font-bold ${leader === "TISZA" ? "text-emerald-400" : "text-orange-400"}`}>
          {leader} {t("pollsummary.leads")} {leadAmt.toFixed(1)}pp
        </div>
      </div>

      {/* Independent pollster average */}
      <div className="card p-6 text-center">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-1">{t("pollsummary.indep")}</h3>
        <p className="text-[10px] text-slate-600 mb-3">{t("pollsummary.last5")}</p>
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="text-center">
            <PartyLogo party="Fidesz" size={24} className="mx-auto mb-1" />
            <div className="text-2xl font-bold text-orange-400 tabular-nums">{indAvgF.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-600">Fidesz</div>
          </div>
          <div className="text-center">
            <PartyLogo party="Tisza" size={24} className="mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{indAvgT.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-600">TISZA</div>
          </div>
        </div>
        {indAvgT > indAvgF && (
          <div className="text-xs text-emerald-400">T+{(indAvgT - indAvgF).toFixed(1)}</div>
        )}
        {indAvgF > indAvgT && (
          <div className="text-xs text-orange-400">F+{(indAvgF - indAvgT).toFixed(1)}</div>
        )}
      </div>

      {/* Government pollster average */}
      <div className="card p-6 text-center">
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-1">{t("pollsummary.gov")}</h3>
        <p className="text-[10px] text-slate-600 mb-3">{t("pollsummary.last5")}</p>
        <div className="flex items-center justify-center gap-6 mb-3">
          <div className="text-center">
            <PartyLogo party="Fidesz" size={24} className="mx-auto mb-1" />
            <div className="text-2xl font-bold text-orange-400 tabular-nums">{govAvgF.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-600">Fidesz</div>
          </div>
          <div className="text-center">
            <PartyLogo party="Tisza" size={24} className="mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{govAvgT.toFixed(1)}%</div>
            <div className="text-[10px] text-slate-600">TISZA</div>
          </div>
        </div>
        {govAvgF > govAvgT && (
          <div className="text-xs text-orange-400">F+{(govAvgF - govAvgT).toFixed(1)}</div>
        )}
        {govAvgT > govAvgF && (
          <div className="text-xs text-emerald-400">T+{(govAvgT - govAvgF).toFixed(1)}</div>
        )}
      </div>
    </div>
  );
}
