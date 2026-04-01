import { useState } from "react";
import { t, timeAgoI18n } from "../utils/i18n";

const CHANNEL_COLORS = {
  "Jólvanezígy": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]", ring: "ring-red-500/50" },
  "Partizán": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]", ring: "ring-blue-500/50" },
  "Telex": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]", ring: "ring-emerald-500/50" },
  "444.hu": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", glow: "shadow-[0_0_15px_rgba(251,191,36,0.2)]", ring: "ring-amber-500/50" },
};

function formatViews(views) {
  if (!views) return null;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

function VideoCard({ video, isFeatured = false }) {
  const colors = CHANNEL_COLORS[video.channel] || CHANNEL_COLORS["Telex"];

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-slate-900/40 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-500/50 hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group ${isFeatured ? "md:col-span-2 md:row-span-2 flex flex-col h-full" : ""}`}
    >
      {/* Thumbnail Container */}
      <div className={`relative bg-slate-800 overflow-hidden ${isFeatured ? "aspect-video md:aspect-auto md:flex-1" : "aspect-video"}`}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
          loading="lazy"
        />
        
        {/* Channel Badge Absolute Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border backdrop-blur-md ${colors.bg} ${colors.text} ${colors.border}`}>
            {video.channel}
          </span>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className={`flex items-center justify-center rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:animate-pulse ${isFeatured ? 'w-20 h-20' : 'w-14 h-14'}`}>
            <svg className={`text-white ml-1 ${isFeatured ? 'w-10 h-10' : 'w-6 h-6'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {/* Gradient shadow at bottom of image for text readability if needed */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />
      </div>

      {/* Info Section */}
      <div className={`p-4 sm:p-5 relative ${isFeatured ? "bg-slate-900" : ""}`}>
        <h3 className={`font-medium text-slate-200 leading-snug line-clamp-2 mb-3 group-hover:text-white transition-colors ${isFeatured ? "text-lg sm:text-xl font-bold" : "text-sm"}`}>
          {video.title}
        </h3>
        <div className={`flex items-center justify-between text-slate-500 font-mono ${isFeatured ? "text-xs" : "text-[10px]"}`}>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {timeAgoI18n(video.published)}
          </span>
          {video.views && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              {formatViews(video.views)} {t("yt.views")}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function YouTubeFeed({ videos }) {
  const [selectedChannel, setSelectedChannel] = useState(null);

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
        <svg className="w-12 h-12 text-slate-700 animate-pulse mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t("yt.loading")}</p>
      </div>
    );
  }

  const channels = [...new Set(videos.map((v) => v.channel))];

  const filteredVideos = selectedChannel
    ? videos.filter((v) => v.channel === selectedChannel)
    : videos;

  return (
    <div className="space-y-6">
      
      {/* Header and Filters */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-700/50 p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center shadow-[inset_0_0_15px_rgba(220,38,38,0.15)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">{t("yt.title")}</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                {videos.length} elemzési videó
              </p>
            </div>
          </div>
        </div>

        {/* Channel filters - Pill style */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedChannel(null)}
            className={`px-4 py-2 text-[11px] uppercase font-bold tracking-wider rounded-full transition-all duration-300 ${
              !selectedChannel
                ? "bg-slate-200 text-slate-900 shadow-[0_0_15px_rgba(226,232,240,0.3)]"
                : "bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 hover:border-slate-500"
            }`}
          >
            {t("yt.all")}
          </button>
          
          {channels.map((ch) => {
            const colors = CHANNEL_COLORS[ch] || { bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-700", glow: "", ring: "ring-slate-500/50" };
            const count = videos.filter((v) => v.channel === ch).length;
            const isSelected = selectedChannel === ch;
            
            return (
              <button
                key={ch}
                onClick={() => setSelectedChannel(isSelected ? null : ch)}
                className={`flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
                  isSelected
                    ? `${colors.bg} ${colors.text} border border-transparent ring-2 ${colors.ring} ${colors.glow}`
                    : "bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-white hover:bg-slate-700 hover:border-slate-500"
                }`}
              >
                {ch}
                <span className={`flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-mono leading-none ${isSelected ? 'bg-black/20' : 'bg-slate-900/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Video grid with Featured element */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredVideos.slice(0, 16).map((video, index) => {
          // A legelső videó mindig nagy (featured) kártya, ha nincs szűrés bekapcsolva
          const isFeatured = index === 0 && !selectedChannel;
          return <VideoCard key={video.videoId} video={video} isFeatured={isFeatured} />;
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center pt-6 pb-2">
        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold tracking-widest text-slate-600 flex items-center gap-2">
          <span>{t("yt.source")}</span>
        </div>
      </div>
    </div>
  );
}