import { useState, useMemo } from "react";
import { PARTY_COLORS } from "../utils/mandateCalculator";
import { OEVK_PATHS } from "../utils/oevkPaths";

/* ── Valódi Magyarország térkép: 106 OEVK a tényleges határokkal ── */

// Megye → régió mapping
function getRegion(county) {
  if (county === "Budapest") return "budapest";
  if (county === "Pest") return "pest";
  if (["Győr-Moson-Sopron", "Vas", "Zala", "Veszprém", "Komárom-Esztergom"].includes(county))
    return "nyugat";
  if (["Baranya", "Somogy", "Tolna", "Fejér"].includes(county)) return "del-dunantul";
  if (["Bács-Kiskun", "Csongrád-Csanád", "Békés", "Jász-Nagykun-Szolnok"].includes(county))
    return "alfold-del";
  if (["Borsod-Abaúj-Zemplén", "Heves", "Nógrád", "Szabolcs-Szatmár-Bereg", "Hajdú-Bihar"].includes(county))
    return "alfold-eszak";
  return "egyeb";
}

const REGION_LABELS = {
  budapest: "Budapest",
  pest: "Pest megye",
  nyugat: "Nyugat-Dunántúl",
  "del-dunantul": "Dél-Dunántúl",
  "alfold-del": "Dél-Alföld",
  "alfold-eszak": "Észak-Mo. & Alföld",
};

export default function DistrictMap({ oevkDetails }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Enrich districts with region info
  const districts = useMemo(() => {
    return OEVK_PATHS.map((d) => ({
      ...d,
      region: getRegion(d.county),
    }));
  }, []);

  // Körzetenként: ki nyeri?
  const districtColors = useMemo(() => {
    const colors = {};
    districts.forEach((d, idx) => {
      if (oevkDetails && oevkDetails[idx]) {
        colors[d.id] = {
          winner: oevkDetails[idx].winner,
          color: PARTY_COLORS[oevkDetails[idx].winner] || "#64748b",
          margin: oevkDetails[idx].margin,
          votes: oevkDetails[idx].votes,
        };
      } else {
        // Fallback: Budapest/Pest → TISZA, vidék → vegyes
        const urbanRegions = ["budapest", "pest"];
        const isTisza = urbanRegions.includes(d.region);
        colors[d.id] = {
          winner: isTisza ? "Tisza" : "Fidesz",
          color: isTisza ? PARTY_COLORS.Tisza : PARTY_COLORS.Fidesz,
          margin: 0,
        };
      }
    });
    return colors;
  }, [districts, oevkDetails]);

  // Régió összesítés
  const regionSummary = useMemo(() => {
    const summary = {};
    districts.forEach((d) => {
      if (!summary[d.region]) summary[d.region] = { fidesz: 0, tisza: 0, other: 0, total: 0 };
      summary[d.region].total++;
      const info = districtColors[d.id];
      if (info?.winner === "Fidesz") summary[d.region].fidesz++;
      else if (info?.winner === "Tisza") summary[d.region].tisza++;
      else summary[d.region].other++;
    });
    return summary;
  }, [districts, districtColors]);

  const hoveredDistrict = districts.find((d) => d.id === hoveredId);
  const hoveredInfo = hoveredId ? districtColors[hoveredId] : null;

  const totalFidesz = Object.values(districtColors).filter((d) => d.winner === "Fidesz").length;
  const totalTisza = Object.values(districtColors).filter((d) => d.winner === "Tisza").length;
  const totalOther = 106 - totalFidesz - totalTisza;

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Egyéni választókerületek (OEVK)</h3>
          <p className="text-[10px] text-slate-500">
            106 körzet - Uniform National Swing becslés a 2022-es eredmények alapján
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PARTY_COLORS.Tisza }} />
            <span className="text-emerald-400 font-bold">{totalTisza}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PARTY_COLORS.Fidesz }} />
            <span className="text-orange-400 font-bold">{totalFidesz}</span>
          </span>
          {totalOther > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-500" />
              <span className="text-slate-400 font-bold">{totalOther}</span>
            </span>
          )}
        </div>
      </div>

      {/* Régió szűrők */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          onClick={() => setSelectedRegion(null)}
          className={`px-2 py-1 text-[10px] rounded-md border transition-colors ${
            !selectedRegion
              ? "bg-slate-700 text-white border-slate-600"
              : "bg-slate-800/50 text-slate-500 border-slate-700/50 hover:text-slate-300"
          }`}
        >
          Mind (106)
        </button>
        {Object.entries(REGION_LABELS).map(([key, label]) => {
          const s = regionSummary[key];
          if (!s) return null;
          return (
            <button
              key={key}
              onClick={() => setSelectedRegion(selectedRegion === key ? null : key)}
              className={`px-2 py-1 text-[10px] rounded-md border transition-colors ${
                selectedRegion === key
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-slate-800/50 text-slate-500 border-slate-700/50 hover:text-slate-300"
              }`}
            >
              {label} ({s.total})
            </button>
          );
        })}
      </div>

      <div className="relative">
        {/* SVG Térkép - valódi OEVK határok */}
        <svg viewBox="0 0 900 400" className="w-full" style={{ maxHeight: "500px" }}>
          {/* Háttér */}
          <rect width="900" height="400" fill="transparent" />

          {districts.map((d) => {
            const info = districtColors[d.id];
            const isFiltered = selectedRegion && d.region !== selectedRegion;
            const isHovered = hoveredId === d.id;

            return (
              <path
                key={d.id}
                d={d.path}
                fill={isFiltered ? "#1e293b" : info?.color || "#64748b"}
                stroke={isHovered ? "#fff" : "#0f172a"}
                strokeWidth={isHovered ? 2 : 0.5}
                opacity={isFiltered ? 0.15 : isHovered ? 1 : 0.85}
                className="cursor-pointer transition-opacity duration-150"
                onMouseEnter={() => setHoveredId(d.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}

          {/* Körzet számok - csak hover-nél vagy Budapest körzeteknél */}
          {districts
            .filter((d) => d.region === "budapest" || hoveredId === d.id)
            .map((d) => (
              <text
                key={`label-${d.id}`}
                x={d.cx}
                y={d.cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
                fill="rgba(255,255,255,0.7)"
                fontSize={d.region === "budapest" ? 5 : 8}
                fontWeight={600}
              >
                {d.num}
              </text>
            ))}
        </svg>

        {/* Tooltip */}
        {hoveredDistrict && hoveredInfo && (
          <div className="absolute top-2 right-2 bg-slate-800 border border-slate-700 rounded-lg p-3 min-w-52 shadow-xl z-10">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredInfo.color }}
              />
              <span className="text-xs font-bold text-white">{hoveredDistrict.name}</span>
            </div>
            <div className="text-[10px] text-slate-400 mb-2">
              {hoveredDistrict.county} megye - OEVK #{hoveredDistrict.num}
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Becsült győztes:</span>
              <span className="font-bold" style={{ color: hoveredInfo.color }}>
                {hoveredInfo.winner}
              </span>
            </div>
            {hoveredInfo.margin > 0 && (
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Előny (szavazat):</span>
                <span className="text-slate-300 font-mono">
                  {Math.round(hoveredInfo.margin).toLocaleString()}
                </span>
              </div>
            )}
            {hoveredInfo.votes && (
              <div className="mt-2 pt-2 border-t border-slate-700 space-y-1">
                {Object.entries(hoveredInfo.votes)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([party, votes]) => (
                    <div key={party} className="flex justify-between text-[10px]">
                      <span style={{ color: PARTY_COLORS[party] || "#94a3b8" }}>{party}</span>
                      <span className="text-slate-400 font-mono">
                        {Math.round(votes).toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Régió összesítés */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
        {Object.entries(REGION_LABELS).map(([key, label]) => {
          const s = regionSummary[key];
          if (!s) return null;
          return (
            <div
              key={key}
              onClick={() => setSelectedRegion(selectedRegion === key ? null : key)}
              className={`bg-slate-800/50 rounded-lg p-2 border cursor-pointer transition-colors ${
                selectedRegion === key
                  ? "border-slate-500"
                  : "border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <div className="text-[10px] text-slate-500 mb-1">{label}</div>
              <div className="flex gap-2 text-[11px]">
                <span className="text-emerald-400 font-bold">{s.tisza}</span>
                <span className="text-slate-600">—</span>
                <span className="text-orange-400 font-bold">{s.fidesz}</span>
              </div>
              <div className="flex mt-1 rounded-full overflow-hidden h-1.5">
                <div
                  className="h-full"
                  style={{ width: `${(s.tisza / s.total) * 100}%`, backgroundColor: PARTY_COLORS.Tisza }}
                />
                <div
                  className="h-full"
                  style={{ width: `${(s.fidesz / s.total) * 100}%`, backgroundColor: PARTY_COLORS.Fidesz }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
