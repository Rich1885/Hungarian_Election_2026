import { useState, useMemo, useCallback } from "react";
import DistrictMap from "./DistrictMap";
import {
  calculateMandates,
  DEFAULT_POLLS,
  PARTY_COLORS,
} from "../utils/mandateCalculator";
import PartyLogo from "./PartyLogo";
import { t } from "../utils/i18n";

/* ── Csúszka (ugyanaz mint a ParliamentChart-ban) ── */
function PartySlider({ party, value, color, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <PartyLogo party={party} size={20} />
      <span className="text-xs text-slate-400 w-28 truncate">{party}</span>
      <input
        type="range"
        min={0}
        max={60}
        step={0.5}
        value={value}
        onChange={(e) => onChange(party, parseFloat(e.target.value))}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${(value / 60) * 100}%, #1e293b ${(value / 60) * 100}%, #1e293b 100%)`,
        }}
      />
      <span className="text-sm font-mono font-bold w-12 text-right" style={{ color }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

const SCENARIOS = [
  { label: "Jelenlegi", polls: { Fidesz: 40, Tisza: 45, "Mi Hazánk": 6, DK: 4, Momentum: 2, "MSZP-Párbeszéd": 2, LMP: 1 } },
  { label: "Szoros", polls: { Fidesz: 44, Tisza: 44, "Mi Hazánk": 6, DK: 3, Momentum: 1, "MSZP-Párbeszéd": 1, LMP: 1 } },
  { label: "Fidesz 2/3", polls: { Fidesz: 55, Tisza: 30, "Mi Hazánk": 7, DK: 5, Momentum: 1, "MSZP-Párbeszéd": 1, LMP: 1 } },
  { label: "TISZA 2/3", polls: { Fidesz: 33, Tisza: 50, "Mi Hazánk": 8, DK: 5, Momentum: 2, "MSZP-Párbeszéd": 1, LMP: 1 } },
];

export default function MapPage({ polls: livePollData }) {
  const [customPolls, setCustomPolls] = useState(() => ({ ...DEFAULT_POLLS }));
  const [useCustom, setUseCustom] = useState(false);

  const activePolls = useCustom ? customPolls : (livePollData || customPolls);

  const { oevkDetails, results, summary } = useMemo(
    () => calculateMandates(activePolls),
    [activePolls]
  );

  const handleSliderChange = useCallback((party, value) => {
    setUseCustom(true);
    setCustomPolls((prev) => {
      const otherSum = Object.entries(prev)
        .filter(([p]) => p !== party)
        .reduce((s, [, v]) => s + v, 0);
      const capped = Math.min(value, Math.max(0, 100 - otherSum));
      return { ...prev, [party]: capped };
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setUseCustom(false);
    setCustomPolls({ ...DEFAULT_POLLS });
  }, []);

  const totalPct = Object.values(activePolls).reduce((s, v) => s + v, 0);

  // OEVK összesítés
  const oevkSummary = useMemo(() => {
    if (!oevkDetails) return { fidesz: 0, tisza: 0, other: 0 };
    let fidesz = 0, tisza = 0, other = 0;
    oevkDetails.forEach((d) => {
      if (d.winner === "Fidesz") fidesz++;
      else if (d.winner === "Tisza") tisza++;
      else other++;
    });
    return { fidesz, tisza, other };
  }, [oevkDetails]);

  return (
    <div className="space-y-6">
      {/* Módszertani magyarázat */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-amber-400 mb-2">⚠ Fontos: Ez egy becslés, nem jóslat!</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          A térkép a <span className="text-white font-medium">2022-es tényleges választási eredményeket</span> kombinálja
          az <span className="text-white font-medium">utolsó 5 közvélemény-kutatás átlagával</span>, és ebből becsüli meg,
          hogy az egyes körzetekben melyik párt nyerne (<span className="text-slate-300">Uniform National Swing modell</span>).
          Ez azt feltételezi, hogy minden körzetben azonos mértékben változik a támogatottság —
          a valóságban az egyéni jelöltek, helyi ügyek és kampány is számítanak.
          A csúszkákkal és a 4 gyors forgatókönyvvel kísérletezhetsz —
          <span className="text-amber-400/80 font-medium">de ezek mind feltételezések, egyik sem jóslat.
          A végső szót a szavazók mondják ki április 12-én.</span>
        </p>
      </div>

      {/* Csúszkák + összesítés */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Csúszka panel */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-white">Szavazati arányok</h3>
            {useCustom && (
              <button
                onClick={resetToDefault}
                className="px-2 py-1 text-[10px] text-cyan-400 bg-cyan-500/10 rounded border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                Élő adatok
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[10px] text-slate-500">
              Húzd a csúszkákat — a térkép valós időben frissül
            </p>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${useCustom ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
              {useCustom ? "Egyéni" : "Élő"}
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(activePolls)
              .sort(([, a], [, b]) => b - a)
              .map(([party, value]) => (
                <PartySlider
                  key={party}
                  party={party}
                  value={value}
                  color={PARTY_COLORS[party] || "#64748b"}
                  onChange={handleSliderChange}
                />
              ))}
          </div>

          <div className={`mt-4 pt-3 border-t border-slate-700 text-xs ${totalPct > 100 ? "text-red-400" : totalPct < 95 ? "text-amber-400" : "text-slate-500"}`}>
            Összesen: {totalPct.toFixed(1)}%
          </div>

          {/* Gyors forgatókönyvek */}
          <div className="mt-4 pt-3 border-t border-slate-700">
            <p className="text-[10px] text-slate-500 mb-2">Gyors forgatókönyvek:</p>
            <div className="grid grid-cols-2 gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setUseCustom(true);
                    setCustomPolls(s.polls);
                  }}
                  className="px-2 py-1.5 text-[10px] font-medium text-slate-400 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* OEVK összesítés */}
          <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Egyéni körzetek (106)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5">
                <PartyLogo party="Tisza" size={18} />
                <span className="text-slate-400">TISZA</span>
              </span>
              <span className="text-emerald-400 font-bold">{oevkSummary.tisza}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5">
                <PartyLogo party="Fidesz" size={18} />
                <span className="text-slate-400">Fidesz</span>
              </span>
              <span className="text-orange-400 font-bold">{oevkSummary.fidesz}</span>
            </div>
            <div className="flex rounded-full overflow-hidden h-2 mt-1">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${(oevkSummary.tisza / 106) * 100}%`, backgroundColor: PARTY_COLORS.Tisza }}
              />
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${(oevkSummary.fidesz / 106) * 100}%`, backgroundColor: PARTY_COLORS.Fidesz }}
              />
            </div>
          </div>
        </div>

        {/* Térkép */}
        <div className="lg:col-span-3">
          <DistrictMap oevkDetails={oevkDetails} />
        </div>
      </div>
    </div>
  );
}
