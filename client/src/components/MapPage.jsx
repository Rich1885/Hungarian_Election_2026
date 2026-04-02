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
    <div className="flex items-center gap-3 group">
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
  { label: "Jelenlegi", icon: "📊", polls: { Fidesz: 39, Tisza: 44, "Mi Hazánk": 6, DK: 1, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
  { label: "Szoros", icon: "⚔️", polls: { Fidesz: 43, Tisza: 43, "Mi Hazánk": 6, DK: 1, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
  { label: "Fidesz 2/3", icon: "🟠", polls: { Fidesz: 55, Tisza: 30, "Mi Hazánk": 7, DK: 2, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
  { label: "TISZA 2/3", icon: "🟢", polls: { Fidesz: 33, Tisza: 50, "Mi Hazánk": 8, DK: 2, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
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
          A térkép a <span className="text-white font-medium">2022-es és 2024-es EP tényleges választási eredményeket</span> kombinálja
          az <span className="text-white font-medium">összes elérhető közvélemény-kutatás átlagával</span>, és ebből becsüli meg,
          hogy az egyes körzetekben melyik párt nyerne (<span className="text-slate-300">Uniform National Swing modell</span>).
          Ez azt feltételezi, hogy minden körzetben azonos mértékben változik a támogatottság -
          a valóságban az egyéni jelöltek, helyi ügyek és kampány is számítanak.
          A csúszkákkal és a 4 gyors forgatókönyvvel kísérletezhetsz -
          <span className="text-amber-400/80 font-medium"> de ezek mind feltételezések, egyik sem jóslat.
            A végső szót a szavazók mondják ki április 12-én.</span>
        </p>
      </div>

      {/* Csúszkák + összesítés */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Csúszka panel */}
        <div className={`rounded-2xl border p-5 transition-all duration-500 shadow-xl ${
          useCustom
            ? "bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-900/90 border-amber-500/30"
            : "bg-slate-900/80 border-slate-700/50"
        }`}>
          
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Szavazati arányok</h3>
            {useCustom && (
              <button
                onClick={resetToDefault}
                className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Vissza az élőre
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] text-slate-500 leading-tight w-2/3">
              Húzd a csúszkákat - a térkép és a mandátumok valós időben frissülnek!
            </p>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
              useCustom ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}>
              {useCustom ? "Egyéni mód" : "Élő mód"}
            </span>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
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

          <div className={`mt-4 pt-3 border-t border-slate-700/50 text-xs font-medium flex justify-between items-center ${
            totalPct > 100 ? "text-red-400" : totalPct < 95 ? "text-amber-400" : "text-slate-400"
          }`}>
            <span>Összesített arány:</span>
            <span className="font-mono font-bold text-sm">{totalPct.toFixed(1)}%</span>
          </div>

          {/* Gyors forgatókönyvek */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">Gyors forgatókönyvek</p>
            <div className="grid grid-cols-2 gap-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setUseCustom(true);
                    setCustomPolls(s.polls);
                  }}
                  className="flex items-center justify-center gap-1.5 px-2 py-2.5 text-[11px] font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/50 hover:border-slate-500/50 transition-all group"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* OEVK összesítés */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <div className="flex justify-between text-xs mb-4">
              <span className="text-slate-400 font-bold uppercase tracking-wide">Egyéni körzetek (106)</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <PartyLogo party="Tisza" size={20} />
                  <span className="text-slate-300 font-medium">TISZA</span>
                </span>
                <span className="text-emerald-400 font-black text-xl">{oevkSummary.tisza}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2">
                  <PartyLogo party="Fidesz" size={20} />
                  <span className="text-slate-300 font-medium">Fidesz</span>
                </span>
                <span className="text-orange-400 font-black text-xl">{oevkSummary.fidesz}</span>
              </div>
            </div>

            <div className="flex gap-1 h-3 mt-4 bg-slate-800 rounded-full overflow-hidden ring-1 ring-slate-900/50">
              <div
                className="h-full transition-all duration-700 rounded-l-full"
                style={{ width: `${(oevkSummary.tisza / 106) * 100}%`, backgroundColor: PARTY_COLORS.Tisza }}
              />
              <div
                className="h-full transition-all duration-700 rounded-r-full"
                style={{ width: `${(oevkSummary.fidesz / 106) * 100}%`, backgroundColor: PARTY_COLORS.Fidesz }}
              />
            </div>
          </div>
        </div>

        {/* Térkép */}
        <div className="lg:col-span-3 bg-slate-900/30 rounded-2xl border border-slate-800/50 p-2 shadow-inner">
          <DistrictMap oevkDetails={oevkDetails} />
        </div>
      </div>
    </div>
  );
}