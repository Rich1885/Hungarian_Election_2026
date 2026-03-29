import { useState } from "react";
import { t, timeAgoI18n } from "../utils/i18n";

const CHANNEL_COLORS = {
  "Jólvanezígy": { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", header: "text-red-400" },
  "Partizán": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", header: "text-blue-400" },
  "Telex": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", header: "text-emerald-400" },
  "444.hu": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", header: "text-amber-400" },
};

function formatViews(views) {
  if (!views) return null;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

function VideoCard({ video }) {
  const colors = CHANNEL_COLORS[video.channel] || CHANNEL_COLORS["Telex"];

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 hover:bg-slate-800/50 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-slate-200 leading-snug line-clamp-2 mb-2 group-hover:text-white">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>{timeAgoI18n(video.published)}</span>
          {video.views && (
            <span>{formatViews(video.views)} {t("yt.views")}</span>
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
      <div className="card p-8 text-center text-slate-500 text-sm">
        {t("yt.loading")}
      </div>
    );
  }

  const channels = [...new Set(videos.map((v) => v.channel))];

  const filteredVideos = selectedChannel
    ? videos.filter((v) => v.channel === selectedChannel)
    : videos;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{t("yt.title")}</h2>
          <p className="text-xs text-slate-500">
            {videos.length} {t("yt.videos")}
          </p>
        </div>
      </div>

      {/* Channel filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedChannel(null)}
          className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
            !selectedChannel
              ? "bg-slate-700 text-white border-slate-600"
              : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
          }`}
        >
          {t("yt.all")}
        </button>
        {channels.map((ch) => {
          const colors = CHANNEL_COLORS[ch];
          const count = videos.filter((v) => v.channel === ch).length;
          return (
            <button
              key={ch}
              onClick={() => setSelectedChannel(selectedChannel === ch ? null : ch)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                selectedChannel === ch
                  ? `${colors?.bg || ""} ${colors?.text || "text-white"} ${colors?.border || "border-slate-600"}`
                  : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              {ch} ({count})
            </button>
          );
        })}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredVideos.slice(0, 20).map((video) => (
          <VideoCard key={video.videoId} video={video} />
        ))}
      </div>

      {/* Footer */}
      <p className="text-[10px] text-slate-600 text-center pt-2">
        {t("yt.source")}
      </p>
    </div>
  );
}
