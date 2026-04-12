import { useState, useEffect } from "react";

const STREAMS = [
  {
    id: "partizan",
    label: "Partizán",
    videoId: "_3m4wtII9ew",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.08)]",
    border: "border-blue-500/20",
  },
  {
    id: "telex",
    label: "Telex",
    videoId: "ecJNoV9aSZk",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.08)]",
    border: "border-emerald-500/20",
  },
  {
    id: "kontroll",
    label: "Kontroll",
    videoId: "0suYq0b-Upc",
    color: "bg-violet-500/20 text-violet-400 border-violet-500/40",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.08)]",
    border: "border-violet-500/20",
  },
];

function VideoPanel({ stream, size }) {
  const isFull = size === "full";
  return (
    <div
      className={`relative rounded-2xl border ${stream.border} bg-slate-900/70 ${stream.glow} overflow-hidden transition-all duration-500 w-full`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${stream.color}`}>
            {stream.label}
          </span>
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider hidden sm:inline">Élő közvetítés</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">LIVE</span>
        </div>
      </div>

      {/* 16:9 embed */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${stream.videoId}?rel=0`}
          title={`${stream.label} élő közvetítés`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function LivePage() {
  const [mainIdx, setMainIdx] = useState(0);
  const main = STREAMS[mainIdx];
  const secondaries = STREAMS.filter((_, i) => i !== mainIdx);

  const [reszvetel, setReszvetel] = useState(null);

  useEffect(() => {
    function fetchReszvetel() {
      fetch("https://hungarian-election-2026-api.onrender.com/api/reszvetel")
        .then((r) => r.json())
        .then((d) => { if (!d.error) setReszvetel(d); })
        .catch(() => {});
    }
    fetchReszvetel();
    const interval = setInterval(fetchReszvetel, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">Élőben</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          Kövesd a választást{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            élőben
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Kövesd élőben a 2026-os magyarországi országgyűlési választást.
        </p>
      </div>

      {/* Main (large) video */}
      <VideoPanel stream={main} size="full" />

      {/* Swap button — centered between videos, cycles main */}
      <div className="flex justify-center my-3">
        <button
          onClick={() => setMainIdx((mainIdx + 1) % STREAMS.length)}
          className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center"
          title="Következő csatorna főoldalra"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
            <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </button>
      </div>

      {/* Secondary videos — side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secondaries.map((stream) => (
          <VideoPanel key={stream.id} stream={stream} size="half" />
        ))}
      </div>

      {/* Részvételi adatok */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* 1. Legutolsó időpont */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5 hover:border-cyan-500/30 transition-all duration-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Legutolsó időpont</p>
          <p className="text-3xl font-black text-white">{reszvetel?.idopont ?? "--:--"}</p>
          {reszvetel?.lastFetched && (
            <p className="text-[10px] text-slate-500 mt-1">
              Utolsó frissítés: {new Date(reszvetel.lastFetched).toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>

        {/* 2. Országos részvétel */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5 hover:border-cyan-500/30 transition-all duration-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Országos részvétel</p>
          <p className="text-3xl font-black text-white">
            {reszvetel?.reszvetel != null ? `${reszvetel.reszvetel}%` : "--%"}
          </p>
        </div>

        {/* 3. Legmagasabb részvétel */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5 hover:border-cyan-500/30 transition-all duration-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Legmagasabb részvétel</p>
          {reszvetel?.legmagasabb?.length > 0 ? (
            <ul className="space-y-1">
              {reszvetel.legmagasabb.map((t) => (
                <li key={t.nev} className="flex justify-between text-xs">
                  <span className="text-slate-300 truncate mr-2">{t.nev}</span>
                  <span className="text-emerald-400 font-bold flex-shrink-0">{t.szazalek}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-xs">Még nincs adat</p>
          )}
        </div>

        {/* 4. Legalacsonyabb részvétel */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5 hover:border-cyan-500/30 transition-all duration-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Legalacsonyabb részvétel</p>
          {reszvetel?.legalacsonyabb?.length > 0 ? (
            <ul className="space-y-1">
              {reszvetel.legalacsonyabb.map((t) => (
                <li key={t.nev} className="flex justify-between text-xs">
                  <span className="text-slate-300 truncate mr-2">{t.nev}</span>
                  <span className="text-red-400 font-bold flex-shrink-0">{t.szazalek}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-xs">Még nincs adat</p>
          )}
        </div>
      </div>

      {/* Forrás jelölés */}
      <div className="flex justify-center mt-4">
        <a
          href="https://valasztas2026.atlatszo.hu/#/reszvetel"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
        >
          Forrás: Átlátszó — valasztas2026.atlatszo.hu
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
