import { useState, useEffect } from "react";
import { t } from "../utils/i18n";

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const election = new Date("2026-04-12T00:00:00Z");
  const diff = election - now;
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const minutes = Math.max(0, Math.floor((diff % 3600000) / 60000));

  return (
    <header className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-slate-950 to-emerald-950/20" />
      <div className="absolute top-[-50%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[-50%] right-[10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left — title */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-9 h-6.5 rounded shadow-[0_0_10px_rgba(255,255,255,0.1)] overflow-hidden border border-slate-700">
                  <path fill="#ce2939" d="M0 0h640v160H0z"/>
                  <path fill="#fff" d="M0 160h640v160H0z"/>
                  <path fill="#477050" d="M0 320h640v160H0z"/>
                </svg>
                {/* Kis becsillanás a zászlón */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight drop-shadow-sm">
                {t("app.title")}
              </h1>
              
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {t("app.live")}
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-500"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              {t("app.subtitle")}
            </p>
          </div>

          {/* Right — countdown */}
          <div className="md:text-right bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800/80 shadow-inner backdrop-blur-sm self-start md:self-auto">
            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mb-2 md:mb-1">{t("app.countdown.until")}</p>
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Days */}
              <div className="flex flex-col items-center justify-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] min-w-[60px]">
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none tracking-tighter">
                  {days.toString().padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-1">{t("app.countdown.days")}</div>
              </div>
              
              <div className="text-slate-600 font-black text-xl sm:text-2xl pb-3 animate-pulse">:</div>
              
              {/* Hours */}
              <div className="flex flex-col items-center justify-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] min-w-[60px]">
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums leading-none tracking-tighter">
                  {hours.toString().padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-1">{t("app.countdown.hours")}</div>
              </div>

              <div className="text-slate-600 font-black text-xl sm:text-2xl pb-3 animate-pulse hidden sm:block">:</div>
              
              {/* Minutes (Desktop only for space reasons) */}
              <div className="hidden sm:flex flex-col items-center justify-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] min-w-[60px]">
                <div className="text-2xl sm:text-3xl font-black text-slate-300 tabular-nums leading-none tracking-tighter">
                  {minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-1">Perc</div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
}