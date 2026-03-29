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

  return (
    <header className="relative overflow-hidden border-b border-slate-800">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-slate-950 to-emerald-950/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
                    {/* Left — title */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-8 h-6 rounded-sm shadow-sm overflow-hidden border border-slate-700">
                <path fill="#ce2939" d="M0 0h640v160H0z"/>
                <path fill="#fff" d="M0 160h640v160H0z"/>
                <path fill="#477050" d="M0 320h640v160H0z"/>
              </svg>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {t("app.title")}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                {t("app.live")}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              {t("app.subtitle")}
            </p>
          </div>

          {/* Right — countdown */}
          <div className="text-right">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white tabular-nums">{days}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{t("app.countdown.days")}</div>
              </div>
              <div className="text-slate-600 text-xl">:</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white tabular-nums">{hours}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{t("app.countdown.hours")}</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-1">{t("app.countdown.until")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
