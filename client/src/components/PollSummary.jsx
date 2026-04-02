import PartyLogo from "./PartyLogo";
import { t } from "../utils/i18n";

export default function PollSummary({ polls }) {
  if (!polls || polls.length === 0) return null;

  const recent = polls.slice(0, 5);
  const avgFidesz = recent.reduce((s, p) => s + p.fidesz, 0) / recent.length;
  const avgTisza = recent.reduce((s, p) => s + p.tisza, 0) / recent.length;

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
  const isTiszaLeading = leader === "TISZA";

  const cardClass =
    "bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[340px]";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 items-stretch">
      {/* Overall average */}
      <div className={`${cardClass} bg-slate-900/80`}>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[80px] pointer-events-none opacity-20 rounded-full ${
            isTiszaLeading ? "bg-emerald-500" : "bg-orange-500"
          }`}
        />

        <div className="relative z-10 text-center mb-6">
          <h3 className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            {t("pollsummary.overall")}
          </h3>
          <p className="text-[10px] text-slate-500 font-mono">Legutóbbi 5 mérés átlaga</p>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-6 sm:gap-10 mb-6">
          <div className={`text-center transition-all duration-500 ${!isTiszaLeading ? "scale-110" : "opacity-70 scale-95"}`}>
            <PartyLogo party="Fidesz" size={48} className="mx-auto mb-3 drop-shadow-md" />
            <div className="text-4xl font-black text-orange-400 tabular-nums drop-shadow-sm">{avgFidesz.toFixed(1)}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-500/70 mt-2">Fidesz</div>
          </div>

          <div className="text-slate-700 text-lg font-black italic">VS</div>

          <div className={`text-center transition-all duration-500 ${isTiszaLeading ? "scale-110" : "opacity-70 scale-95"}`}>
            <PartyLogo party="Tisza" size={48} className="mx-auto mb-3 drop-shadow-md" />
            <div className="text-4xl font-black text-emerald-400 tabular-nums drop-shadow-sm">{avgTisza.toFixed(1)}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mt-2">TISZA</div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold shadow-lg ${
              isTiszaLeading
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isTiszaLeading ? "bg-emerald-400" : "bg-orange-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isTiszaLeading ? "bg-emerald-500" : "bg-orange-500"
                }`}
              />
            </span>
            {leader} {t("pollsummary.leads")} {leadAmt.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Independent */}
      {(() => {
        const indLeader = indAvgT > indAvgF ? "TISZA" : "Fidesz";
        const indLead = Math.abs(indAvgT - indAvgF);
        const indTiszaLeads = indAvgT > indAvgF;
        return (
          <div className={`${cardClass} bg-slate-900/80`}>
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[80px] pointer-events-none opacity-20 rounded-full ${
                indTiszaLeads ? "bg-emerald-500" : "bg-orange-500"
              }`}
            />

            <div className="relative z-10 text-center mb-6">
              <h3 className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1 flex items-center justify-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                {t("pollsummary.indep")}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">{t("pollsummary.last5")}</p>
            </div>

            <div className="relative z-10 flex items-center justify-center gap-6 sm:gap-10 mb-6">
              <div className={`text-center transition-all duration-500 ${!indTiszaLeads ? "scale-110" : "opacity-70 scale-95"}`}>
                <PartyLogo party="Fidesz" size={48} className="mx-auto mb-3 drop-shadow-md" />
                <div className="text-4xl font-black text-orange-400 tabular-nums drop-shadow-sm">{indAvgF.toFixed(1)}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-500/70 mt-2">Fidesz</div>
              </div>

              <div className="text-slate-700 text-lg font-black italic">VS</div>

              <div className={`text-center transition-all duration-500 ${indTiszaLeads ? "scale-110" : "opacity-70 scale-95"}`}>
                <PartyLogo party="Tisza" size={48} className="mx-auto mb-3 drop-shadow-md" />
                <div className="text-4xl font-black text-emerald-400 tabular-nums drop-shadow-sm">{indAvgT.toFixed(1)}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mt-2">TISZA</div>
              </div>
            </div>

            <div className="relative z-10 flex justify-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold shadow-lg ${
                  indTiszaLeads
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      indTiszaLeads ? "bg-emerald-400" : "bg-orange-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      indTiszaLeads ? "bg-emerald-500" : "bg-orange-500"
                    }`}
                  />
                </span>
                {indLeader} {t("pollsummary.leads")} {indLead.toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })()}

      {/* Government */}
      {(() => {
        const govLeader = govAvgF > govAvgT ? "Fidesz" : "TISZA";
        const govLead = Math.abs(govAvgF - govAvgT);
        const govTiszaLeads = govAvgT > govAvgF;
        return (
          <div className={`${cardClass} bg-slate-900/80`}>
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[80px] pointer-events-none opacity-20 rounded-full ${
                govTiszaLeads ? "bg-emerald-500" : "bg-orange-500"
              }`}
            />

            <div className="relative z-10 text-center mb-6">
              <h3 className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1 flex items-center justify-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                {t("pollsummary.gov")}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">{t("pollsummary.last5")}</p>
            </div>

            <div className="relative z-10 flex items-center justify-center gap-6 sm:gap-10 mb-6">
              <div className={`text-center transition-all duration-500 ${!govTiszaLeads ? "scale-110" : "opacity-70 scale-95"}`}>
                <PartyLogo party="Fidesz" size={48} className="mx-auto mb-3 drop-shadow-md" />
                <div className="text-4xl font-black text-orange-400 tabular-nums drop-shadow-sm">{govAvgF.toFixed(1)}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-500/70 mt-2">Fidesz</div>
              </div>

              <div className="text-slate-700 text-lg font-black italic">VS</div>

              <div className={`text-center transition-all duration-500 ${govTiszaLeads ? "scale-110" : "opacity-70 scale-95"}`}>
                <PartyLogo party="Tisza" size={48} className="mx-auto mb-3 drop-shadow-md" />
                <div className="text-4xl font-black text-emerald-400 tabular-nums drop-shadow-sm">{govAvgT.toFixed(1)}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70 mt-2">TISZA</div>
              </div>
            </div>

            <div className="relative z-10 flex justify-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold shadow-lg ${
                  govTiszaLeads
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      govTiszaLeads ? "bg-emerald-400" : "bg-orange-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      govTiszaLeads ? "bg-emerald-500" : "bg-orange-500"
                    }`}
                  />
                </span>
                {govLeader} {t("pollsummary.leads")} {govLead.toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}