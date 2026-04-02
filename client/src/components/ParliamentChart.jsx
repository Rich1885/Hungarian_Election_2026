import { useState, useMemo, useCallback } from "react";
import {
  calculateMandates,
  DEFAULT_POLLS,
  PARTY_COLORS,
} from "../utils/mandateCalculator";
import PartyLogo from "./PartyLogo";
import { t } from "../utils/i18n";

/* ── Parlamenti patkó SVG generálás ── */
function generateHemicycleSeats(totalSeats = 199) {
  const seats = [];
  const rows = 8;
  const centerX = 250;
  const centerY = 230;
  const minRadius = 80;
  const maxRadius = 210;
  const seatRadius = 6.5;

  // Soronként elosztjuk a mandátumokat (belső sor kevesebb, külső több)
  const rowSeats = [];
  let remaining = totalSeats;
  for (let r = 0; r < rows; r++) {
    const radius = minRadius + (r / (rows - 1)) * (maxRadius - minRadius);
    const circumference = Math.PI * radius;
    const maxInRow = Math.floor(circumference / (seatRadius * 2.6));
    const count = r < rows - 1
      ? Math.min(maxInRow, Math.round(totalSeats / rows) + (r > rows / 2 ? 2 : -1))
      : remaining;
    rowSeats.push(Math.min(count, remaining));
    remaining -= rowSeats[r];
  }

  let seatIndex = 0;
  for (let r = 0; r < rows; r++) {
    const radius = minRadius + (r / (rows - 1)) * (maxRadius - minRadius);
    const n = rowSeats[r];
    for (let i = 0; i < n; i++) {
      const angle = Math.PI - (i / (n - 1 || 1)) * Math.PI;
      seats.push({
        index: seatIndex++,
        cx: centerX + radius * Math.cos(angle),
        cy: centerY - radius * Math.sin(angle),
        r: seatRadius,
      });
    }
  }

  return seats;
}

const HEMICYCLE_SEATS = generateHemicycleSeats(199);

/* ── Csúszka komponens ── */
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

/* ── Eredmény sáv ── */
function ResultBar({ results }) {
  const total = 199;
  return (
    <div className="space-y-2">
      <div className="flex rounded-full overflow-hidden h-6 bg-slate-800">
        {results
          .filter((r) => r.total > 0)
          .map((r) => (
            <div
              key={r.party}
              className="h-full flex items-center justify-center text-[10px] font-bold text-white/90 transition-all duration-500"
              style={{
                width: `${(r.total / total) * 100}%`,
                backgroundColor: PARTY_COLORS[r.party] || "#64748b",
              }}
            >
              {r.total >= 8 ? r.total : ""}
            </div>
          ))}
      </div>
      {/* Vonalak: többség (100) és 2/3 (133) */}
      <div className="relative h-4">
        <div
          className="absolute top-0 h-4 border-l-2 border-dashed border-yellow-500/60"
          style={{ left: `${(100 / total) * 100}%` }}
        >
          <span className="absolute -top-0.5 left-1 text-[9px] text-yellow-500/60 whitespace-nowrap">
            100 - {t("parliament.majority.badge")}
          </span>
        </div>
        <div
          className="absolute top-0 h-4 border-l-2 border-dashed border-red-500/60"
          style={{ left: `${(133 / total) * 100}%` }}
        >
          <span className="absolute -top-0.5 left-1 text-[9px] text-red-500/60 whitespace-nowrap">
            133 - {t("parliament.2thirds.badge")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Fő komponens ── */
export default function ParliamentChart({ polls: livePollData }) {
  const [customPolls, setCustomPolls] = useState(() => ({ ...DEFAULT_POLLS }));
  const [useCustom, setUseCustom] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  const activePolls = useCustom ? customPolls : (livePollData || customPolls);

  const { results, summary, oevkDetails } = useMemo(
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

  const resetToLive = useCallback(() => {
    setUseCustom(false);
    setCustomPolls({ ...DEFAULT_POLLS });
  }, []);

  // Mandátumok hozzárendelése a székekhez (bal→jobb, mint a valódi parlamentben)
  const seatColors = useMemo(() => {
    const colors = [];
    // Balról jobbra: ellenzék → kormány sorrend
    const sortedResults = [...results]
      .filter((r) => r.total > 0)
      .sort((a, b) => {
        // Fidesz jobbra, TISZA balra, kispártok közép
        const order = { Tisza: 0, DK: 1, Momentum: 2, "MSZP-Párbeszéd": 3, LMP: 4, "Mi Hazánk": 5, Fidesz: 6 };
        return (order[a.party] ?? 3) - (order[b.party] ?? 3);
      });

    sortedResults.forEach((r) => {
      for (let i = 0; i < r.total; i++) {
        colors.push(PARTY_COLORS[r.party] || "#64748b");
      }
    });

    return colors;
  }, [results]);

  const totalPct = Object.values(activePolls).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6" data-export="parliament">
      {/* Módszertani magyarázat */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-amber-400 mb-2">⚠ Fontos: Ez egy becslés, nem jóslat!</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          A modell a <span className="text-white font-medium">2022-es és 2024-es EP tényleges választási eredményeket</span> kombinálja
          az <span className="text-white font-medium">összes elérhető közvélemény-kutatás átlagával</span>, és ebből becsüli meg,
          hogy az egyes körzetekben melyik párt nyerne (<span className="text-slate-300">Uniform National Swing modell</span>).
          Ez azt feltételezi, hogy minden körzetben azonos mértékben változik a támogatottság -
          a valóságban az egyéni jelöltek, helyi ügyek és kampány is számítanak.
          A csúszkákkal és a 4 gyors forgatókönyvvel kísérletezhetsz -
          <span className="text-amber-400/80 font-medium"> de ezek mind feltételezések, egyik sem jóslat.
          A végső szót a szavazók mondják ki április 12-én.</span>
        </p>
      </div>

      {/* ── Edukációs Szekció ── */}
      <div className="bg-slate-800/80 rounded-xl border-b-2 border-r border-slate-700 shadow-sm shadow-black/40 overflow-hidden transition-all duration-300">
        <button
          onClick={() => setShowEducation(!showEducation)}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-slate-800 hover:bg-slate-700 active:bg-slate-700/80 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">{t("edu.title")}</h3>
              <p className="text-[10px] sm:text-xs text-cyan-400/80 font-medium mt-0.5">{t("edu.subtitle")}</p>
            </div>
          </div>
          
          <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-300 transition-all duration-300 ${showEducation ? "rotate-180 bg-cyan-900 border-cyan-700 text-cyan-400" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </button>

        {showEducation && (
          <div className="px-5 pb-5 space-y-5">
            <div className="bg-orange-500/5 border border-orange-500/15 rounded-lg p-4">
              <h4 className="text-xs font-bold text-orange-400 mb-2 uppercase tracking-wider">{t("edu.1.title")}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Ha egy jelölt megnyeri a körzetét, a <span className="text-white font-medium">felesleges szavazatait</span> (azaz amennyivel
                többet kapott, mint a második helyezett + 1) a pártja listájára írják jóvá. Ez <span className="text-orange-400 font-medium">
                a legerősebb pártot segíti</span>, mert minél nagyobb arányban nyeri a körzeteket, annál több kompenzációs szavazatot kap a listán is.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-[10px] text-slate-500 mb-2">Példa / Example:</div>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-emerald-400 font-mono">Győztes: 25,000</span>
                  <span className="text-slate-600">−</span>
                  <span className="text-red-400 font-mono">2. hely: 18,000</span>
                  <span className="text-slate-600">−</span>
                  <span className="text-slate-400 font-mono">1</span>
                  <span className="text-slate-600">=</span>
                  <span className="text-amber-400 font-bold font-mono">6,999 → listára / to list</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4">
              <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">{t("edu.2.title")}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                A vesztes jelöltek <span className="text-white font-medium">összes szavazata</span> automatikusan a pártjuk országos listájához
                adódik. Ez a kisebb pártoknak kedvez - a szavazataik nem vesznek el, hanem
                <span className="text-emerald-400 font-medium"> listás mandátumokat kapnak belőle</span>.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
                Ha a DK jelöltje 106 körzetben összesen 200 000 szavazatot kap (de egyet sem nyer meg),
                mind a 200 000 szavazat a DK listájához kerül → <span className="text-blue-400 font-bold">listás mandátumokat kapnak</span>.
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/15 rounded-lg p-4">
              <h4 className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">{t("edu.3.title")}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                A 93 listás mandátumot a <span className="text-white font-medium">D'Hondt módszerrel</span> osztják el:
                a pártok szavazatait elosztják 1-gyel, 2-vel, 3-mal stb., és a <span className="text-blue-400 font-medium">
                93 legnagyobb hányadost kapó párt kap egy-egy helyet</span>. Ez enyhén a nagyobb pártoknak kedvez.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-3 overflow-x-auto">
                <table className="text-[10px] w-full">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left pr-3 pb-1">÷</th>
                      <th className="text-right pr-3 pb-1 text-orange-400">Fidesz (2M)</th>
                      <th className="text-right pr-3 pb-1 text-emerald-400">TISZA (2.2M)</th>
                      <th className="text-right pb-1 text-blue-400">DK (250K)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400 font-mono">
                    <tr><td className="pr-3">1</td><td className="text-right pr-3 text-orange-300">2,000,000</td><td className="text-right pr-3 text-emerald-300">2,200,000</td><td className="text-right text-blue-300">250,000</td></tr>
                    <tr><td className="pr-3">2</td><td className="text-right pr-3 text-orange-300">1,000,000</td><td className="text-right pr-3 text-emerald-300">1,100,000</td><td className="text-right text-blue-300">125,000</td></tr>
                    <tr><td className="pr-3">3</td><td className="text-right pr-3 text-orange-300">666,667</td><td className="text-right pr-3 text-emerald-300">733,333</td><td className="text-right text-blue-300">83,333</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-4">
              <h4 className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider">{t("edu.4.title")}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Csak az <span className="text-white font-medium">5% feletti pártok</span> jutnak be a parlamentbe listáról.
                Az ez alatti pártok szavazatai <span className="text-red-400 font-medium">teljesen elvesznek</span> - nem kerülnek
                át más pártokhoz. Ez erősen ösztönzi a stratégiai szavazást: egy 3%-os pártra adott szavazat effektíve „elveszett szavazat".
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Header + Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{t("parliament.title")}</h2>
          <p className="text-xs text-slate-500">{t("parliament.subtitle")}</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700">
          <button
            onClick={resetToLive}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              !useCustom
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${!useCustom ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
              {t("parliament.liveBtn")}
            </span>
          </button>
          <button
            onClick={() => setUseCustom(true)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              useCustom
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}
          >
            {t("parliament.custom")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patkó diagram */}
        <div className="lg:col-span-2 bg-slate-900/50 rounded-xl border border-slate-800 p-4">
          <svg viewBox="0 0 500 260" className="w-full">
            {HEMICYCLE_SEATS.map((seat, i) => (
              <circle
                key={i}
                cx={seat.cx}
                cy={seat.cy}
                r={seat.r}
                fill={seatColors[i] || "#1e293b"}
                className="transition-colors duration-500"
                stroke="#0f172a"
                strokeWidth={1}
              />
            ))}
            {/* Középső szöveg */}
            <text x="250" y="215" textAnchor="middle" className="fill-white text-2xl font-bold">
              199
            </text>
            <text x="250" y="235" textAnchor="middle" className="fill-slate-500 text-xs">
              mandátum
            </text>
          </svg>

          {/* Eredmény sáv */}
          <div className="mt-2 px-2">
            <ResultBar results={results} />
          </div>

          {/* Eredmény táblázat */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 px-2">
            {results
              .filter((r) => r.total > 0)
              .map((r) => (
                <div
                  key={r.party}
                  className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <PartyLogo party={r.party} size={18} />
                    <span className="text-xs text-slate-400 truncate">{r.party}</span>
                  </div>
                  <div className="text-xl font-bold text-white">{r.total}</div>
                  <div className="text-[10px] text-slate-500">
                    {r.oevk} {t("parliament.oevk")} + {r.list} {t("parliament.list")}
                  </div>
                  {r.is2Thirds && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-red-500/20 text-red-400 rounded">
                      {t("parliament.2thirds.badge")}
                    </span>
                  )}
                  {r.isMajority && !r.is2Thirds && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 rounded">
                      {t("parliament.majority.badge")}
                    </span>
                  )}
                  {r.belowThreshold && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold bg-slate-500/20 text-slate-500 rounded">
                      {t("parliament.threshold")}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Csúszkák panel */}
        <div className={`rounded-xl border p-4 transition-all duration-500 ${
          useCustom
            ? "bg-gradient-to-b from-amber-950/20 via-slate-900/80 to-slate-900/80 border-amber-500/20"
            : "bg-slate-900/50 border-slate-800"
        }`}>
          <h3 className="text-sm font-semibold text-white mb-1">{t("parliament.sliders.title")}</h3>
          <p className="text-[10px] text-slate-500 mb-4">{t("parliament.sliders.hint")}</p>

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

          {/* Total percentage - prominent display */}
          <div className={`mt-4 pt-3 border-t border-slate-700 flex items-center justify-between rounded-lg px-3 py-2 transition-all ${
            totalPct > 100
              ? "bg-red-500/10 border-red-500/30"
              : totalPct > 95
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-slate-800/50"
          }`}>
            <span className="text-xs font-medium text-slate-400">{t("parliament.total")}:</span>
            <span className={`text-lg font-black tabular-nums ${
              totalPct > 100 ? "text-red-400" : totalPct > 95 ? "text-emerald-400" : "text-white"
            }`}>
              {totalPct.toFixed(1)}%
              {totalPct > 100 && <span className="text-xs ml-1 font-medium">{t("parliament.tooHigh")}</span>}
            </span>
          </div>

          {/* Összegzés */}
          <div className="mt-4 pt-3 border-t border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t("parliament.largestParty")}</span>
              <span className="font-bold" style={{ color: PARTY_COLORS[summary.largestParty] }}>
                {summary.largestParty}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t("parliament.govSide")}</span>
              <span className="text-orange-400 font-bold">{summary.governmentSeats}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t("parliament.opposition")}</span>
              <span className="text-emerald-400 font-bold">{summary.oppositionSeats}</span>
            </div>
            {summary.has2Thirds && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
                <span className="text-red-400 text-xs font-bold">{t("parliament.supermajority")}</span>
              </div>
            )}
            {summary.hasMajority && !summary.has2Thirds && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
                <span className="text-emerald-400 text-xs font-bold">{t("parliament.majority")}</span>
              </div>
            )}
          </div>

          {/* Gyors szcenáriók */}
          <div className="mt-4 pt-3 border-t border-slate-700">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-3">{t("parliament.scenarios")}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t("parliament.sc.current"), icon: "📊", polls: { Fidesz: 39, Tisza: 44, "Mi Hazánk": 6, DK: 1, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
                { label: t("parliament.sc.close"), icon: "⚔️", polls: { Fidesz: 43, Tisza: 43, "Mi Hazánk": 6, DK: 1, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
                { label: t("parliament.sc.fidesz23"), icon: "🟠", polls: { Fidesz: 55, Tisza: 30, "Mi Hazánk": 7, DK: 2, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
                { label: t("parliament.sc.tisza23"), icon: "🟢", polls: { Fidesz: 33, Tisza: 50, "Mi Hazánk": 8, DK: 2, Momentum: 0, "MSZP-Párbeszéd": 0, LMP: 0 } },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => {
                    setUseCustom(true);
                    setCustomPolls(s.polls);
                  }}
                  className="flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/50 hover:border-slate-500/50 transition-all group"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Koalíció Építő (Fidesz + Mi Hazánk) ── */}
      {(() => {
        const COALITION_PARTIES = ["Fidesz", "Mi Hazánk"];
        const coalitionSeats = results
          .filter((r) => COALITION_PARTIES.includes(r.party))
          .reduce((s, r) => s + r.total, 0);
        const has100 = coalitionSeats >= 100;
        const has133 = coalitionSeats >= 133;

        return (
          <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-6 relative overflow-hidden shadow-xl">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] pointer-events-none rounded-full" />
            
            <div className="relative z-10 mb-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                {t("coalition.title")}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">{t("coalition.subtitle")}</p>
            </div>

            {/* Party tiles */}
            <div className="relative z-10 flex flex-wrap sm:flex-nowrap gap-3 mb-8 items-center">
              {COALITION_PARTIES.map((p) => {
                const r = results.find((r) => r.party === p);
                return (
                  <div key={p} className="flex-1 min-w-[120px] flex items-center gap-3 bg-slate-800/60 rounded-xl border border-slate-700/50 px-4 py-3 shadow-inner">
                    <PartyLogo party={p} size={32} className="drop-shadow-md" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">{p}</div>
                      <div className="text-2xl font-black text-white tabular-nums leading-none mt-1">{r?.total || 0}</div>
                    </div>
                  </div>
                );
              })}
              <div className="hidden sm:flex items-center justify-center px-1 text-slate-600 text-xl font-light">=</div>
              
              {/* Total Seats Box */}
              <div className="w-full sm:w-auto sm:flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 px-4 py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]">
                <div className="text-3xl font-black tabular-nums bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  {coalitionSeats}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Összesen</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 mb-8 pt-2">
              <div className="h-6 bg-slate-950 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-green-600 flex items-center justify-end pr-2 text-[10px] font-bold text-white/90 transition-all duration-700"
                  style={{ width: `${Math.min(100, (coalitionSeats / 199) * 100)}%` }}
                >
                  {coalitionSeats > 20 && `${coalitionSeats} szék`}
                </div>
              </div>
              
              {/* Markers */}
              <div className="absolute top-0 h-10 border-l border-dashed border-yellow-500/60" style={{ left: `${(100/199)*100}%` }}>
                <div className="absolute top-10 -left-6 bg-slate-900 px-2 py-0.5 rounded text-[9px] font-bold text-yellow-500 border border-yellow-500/20 whitespace-nowrap">100 (Többség)</div>
              </div>
              <div className="absolute top-0 h-10 border-l border-dashed border-red-500/60" style={{ left: `${(133/199)*100}%` }}>
                <div className="absolute top-10 -left-4 bg-slate-900 px-2 py-0.5 rounded text-[9px] font-bold text-red-400 border border-red-500/20 whitespace-nowrap">133 (2/3)</div>
              </div>
            </div>

            <div className="relative z-10 flex justify-center mt-6">
              {has133 ? (
                <div className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-red-500/10 text-red-400 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <span>🏆</span> {t("coalition.has133")}
                </div>
              ) : has100 ? (
                <div className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span>✅</span> {t("coalition.has100")}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-slate-800 text-slate-400 rounded-full border border-slate-700">
                  <span>❌</span> {t("coalition.noMaj")} {100 - coalitionSeats} {t("coalition.missing")}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── Megosztás gomb ── */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            const target = document.querySelector('[data-export="parliament"]');
            if (!target) return;
            import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js')
              .then(mod => mod.default(target, { backgroundColor: '#0f172a', scale: 2 }))
              .then(canvas => {
                const link = document.createElement('a');
                link.download = `mandatum-becsles-${new Date().toISOString().slice(0,10)}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
              })
              .catch(() => {
                alert('A kép exportálás nem sikerült. Próbáld újra!');
              });
          }}
          className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl hover:from-emerald-500 hover:to-cyan-500 transition-all flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {t("share.btn")}
        </button>
      </div>

    </div>
  );
}