export default function LivePage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">Hamarosan élőben</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          Kövesd a választást{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            velünk élőben
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Hamarosan itt indul az élő választási közvetítés és műsorfigyelő felület.
        </p>
      </div>

      {/* TV Panel */}
      <div className="relative rounded-3xl border border-cyan-500/20 bg-slate-900/70 shadow-[0_0_40px_rgba(34,211,238,0.08)] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Élő közvetítés</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">LIVE</span>
          </div>
        </div>

        {/* 16:9 Video embed */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="YouTube live stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Hamarosan overlay */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400 ml-1">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.3" />
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white mb-1">2026. április 12.</p>
              <p className="text-sm text-slate-400">A közvetítés a választás napján indul</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {[
          { icon: "📡", title: "Élő eredmények", desc: "Valós idejű szavazatszámlálás és körzetenkénti bontás" },
          { icon: "📊", title: "Műsorfigyelő", desc: "TV csatornák élő választási műsorainak követése" },
          { icon: "💬", title: "Élő kommentár", desc: "Szakértői elemzés és gyorsjelentések a beérkező adatokról" },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5 text-center hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all duration-300"
          >
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
