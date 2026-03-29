import { useEffect, useState } from "react";
import { fetchBook, fetchHistory } from "../api";
import OrderBook from "./OrderBook";
import PriceChart from "./PriceChart";
import { t } from "../utils/i18n";

function fmtMoney(v) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function StatBox({ label, value, sub }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export default function PartyCard({ market }) {
  const [book, setBook] = useState(null);
  const [history, setHistory] = useState([]);

  const prob = parseFloat(market.outcomePrices?.[0] || 0);
  const tokenId = market.clobTokenIds?.[0];
  const isLeading = prob >= 0.5;

  useEffect(() => {
    if (!tokenId) return;
    fetchBook(tokenId).then(setBook).catch(() => {});
    fetchHistory(tokenId, 80).then((d) => setHistory(d.history || d || [])).catch(() => {});
  }, [tokenId]);

  const dayChg = market.oneDayPriceChange * 100;
  const weekChg = market.oneWeekPriceChange * 100;

  return (
    <div className={`card overflow-hidden ${isLeading ? "glow-green" : "glow-red"}`}>
      {/* Header gradient */}
      <div className={`h-1 ${isLeading ? "bg-gradient-to-r from-emerald-500 to-cyan-500" : "bg-gradient-to-r from-red-500 to-orange-500"}`} />

      <div className="p-6">
        {/* Party name + probability */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{market.groupItemTitle}</h3>
          <div className={`text-5xl font-black tabular-nums ${isLeading ? "text-emerald-400" : "text-red-400"}`}>
            {(prob * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-1">{t("card.winChance")}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-6 py-4 border-y border-slate-800">
          <StatBox
            label={t("card.24h")}
            value={
              <span className={dayChg > 0 ? "text-emerald-400" : dayChg < 0 ? "text-red-400" : "text-slate-400"}>
                {dayChg > 0 ? "+" : ""}{dayChg.toFixed(1)}%
              </span>
            }
          />
          <StatBox
            label={t("card.7d")}
            value={
              <span className={weekChg > 0 ? "text-emerald-400" : weekChg < 0 ? "text-red-400" : "text-slate-400"}>
                {weekChg > 0 ? "+" : ""}{weekChg.toFixed(1)}%
              </span>
            }
          />
          <StatBox label={t("card.vol24h")} value={<span className="text-amber-400">{fmtMoney(market.volume24hr)}</span>} />
          <StatBox label={t("card.liquidity")} value={<span className="text-cyan-400">{fmtMoney(market.liquidity)}</span>} />
        </div>

        {/* Price chart */}
        {history.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t("card.priceHistory")}</h4>
            <PriceChart data={history} isLeading={isLeading} />
          </div>
        )}

        {/* Order book */}
        {book && (
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-3">{t("card.orderBook")}</h4>
            <OrderBook data={book} />
          </div>
        )}

        {/* Market quality */}
        {market.competitive > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{t("card.marketQuality")}</span>
              <span className="text-emerald-400">{(market.competitive * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${market.competitive * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
