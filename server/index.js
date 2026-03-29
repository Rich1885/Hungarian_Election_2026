const express = require("express");
const cors = require("cors");
const https = require("https");
const http = require("http");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── Proxy helper ────────────────────────────────────────────────────────────

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "hungary-hub/2.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`Invalid JSON from ${url}`));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

// ── Routes ──────────────────────────────────────────────────────────────────

// GET /api/event — full event with all markets
app.get("/api/event", async (req, res) => {
  try {
    const data = await fetchJSON(
      "https://gamma-api.polymarket.com/events?slug=hungary-parliamentary-election-winner"
    );
    const event = Array.isArray(data) ? data[0] : data;
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Parse JSON string fields in markets
    const markets = (event.markets || []).map((m) => ({
      question: m.question || "Unknown",
      conditionId: m.conditionId || "",
      clobTokenIds: safeParse(m.clobTokenIds),
      outcomes: safeParse(m.outcomes),
      outcomePrices: safeParse(m.outcomePrices),
      volume: parseFloat(m.volume) || 0,
      volume24hr: parseFloat(m.volume24hr) || 0,
      volume1wk: parseFloat(m.volume1wk) || 0,
      liquidity: parseFloat(m.liquidity) || 0,
      spread: parseFloat(m.spread) || 0,
      oneDayPriceChange: parseFloat(m.oneDayPriceChange) || 0,
      oneWeekPriceChange: parseFloat(m.oneWeekPriceChange) || 0,
      lastTradePrice: parseFloat(m.lastTradePrice) || 0,
      competitive: parseFloat(m.competitive) || 0,
      groupItemTitle: m.groupItemTitle || m.question || "Unknown",
      slug: m.slug || "",
    }));

    res.json({
      title: event.title,
      slug: event.slug,
      markets,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/midpoint/:tokenId
app.get("/api/midpoint/:tokenId", async (req, res) => {
  try {
    const data = await fetchJSON(
      `https://clob.polymarket.com/midpoint?token_id=${req.params.tokenId}`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/book/:tokenId
app.get("/api/book/:tokenId", async (req, res) => {
  try {
    const data = await fetchJSON(
      `https://clob.polymarket.com/book?token_id=${req.params.tokenId}`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/history/:tokenId
app.get("/api/history/:tokenId", async (req, res) => {
  try {
    const fidelity = req.query.fidelity || 50;
    const data = await fetchJSON(
      `https://clob.polymarket.com/prices-history?market=${req.params.tokenId}&interval=all&fidelity=${fidelity}`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/market/:conditionId — CLOB market details
app.get("/api/market/:conditionId", async (req, res) => {
  try {
    const data = await fetchJSON(
      `https://clob.polymarket.com/markets/${req.params.conditionId}`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Polls (Wikipedia) ────────────────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "hungary-hub/2.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

let pollsCache = { data: null, ts: 0 };

function parseWikiPolls(wikitext) {
  // Extract the 2026 election period section
  const startIdx = wikitext.indexOf("===2026 election period===");
  const endIdx = wikitext.indexOf("===2024\u20132026===");
  if (startIdx === -1) return [];
  const section = wikitext.substring(startIdx, endIdx > -1 ? endIdx : startIdx + 20000);

  const polls = [];
  const lines = section.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    // Poll rows start with |date pattern like |23–26 Mar 2026
    const dateMatch = line.match(/^\|(\d[\d\s–\-\w]*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+20\d{2})/i);
    if (dateMatch) {
      const date = dateMatch[1].trim();
      // Next lines: pollster, affiliation, sample, fidesz, tisza, dk, mh, mkkp, others, lead
      const rowLines = [line];
      let j = i + 1;
      // Collect all | lines until next |- or end
      while (j < lines.length && !lines[j].trim().startsWith("|-") && !lines[j].trim().startsWith("|}")) {
        if (lines[j].trim().startsWith("|") || lines[j].trim().startsWith("!")) {
          rowLines.push(lines[j].trim());
        }
        j++;
      }

      // Each row line is a separate cell (wiki tables use | per line)
      // Handle styled cells: style="..." |value → take the value after last |
      let cells = [];
      for (const rl of rowLines) {
        let cell = rl.replace(/^\|/, "").trim();
        // If cell has style="..." |value pattern, extract value after last unquoted |
        if (cell.match(/^style=/i) || cell.match(/^"?\s*style=/i)) {
          const lastPipe = cell.lastIndexOf("|");
          if (lastPipe > -1) {
            cell = cell.substring(lastPipe + 1).trim();
          }
        }
        cells.push(cell);
      }

      // Extract values from cells
      const extractNum = (cell) => {
        if (!cell) return null;
        // Remove commas from numbers like 1,000
        const clean = cell.replace(/,/g, "");
        const m = clean.match(/([\d]+(?:\.[\d]+)?)/);
        return m ? parseFloat(m[1]) : null;
      };

      const extractText = (cell) => {
        if (!cell) return "";
        // Remove wiki markup: [[...]], [url text], {{...}}, style="..."
        return cell
          .replace(/\[\[[^\]]*\|([^\]]*)\]\]/g, "$1")
          .replace(/\[\[[^\]]*\]\]/g, "")
          .replace(/\[https?:\/\/[^\s\]]*\s*([^\]]*)\]/g, "$1")
          .replace(/\{\{[^}]*\}\}/g, "")
          .replace(/style="[^"]*"/g, "")
          .replace(/''+/g, "")
          .trim();
      };

      // cells[0]=date, cells[1]=pollster, cells[2]=affiliation, cells[3]=sample
      // cells[4]=fidesz, cells[5]=tisza, cells[6]=dk, cells[7]=mh, cells[8]=mkkp, cells[9]=others, cells[10]=lead
      if (cells.length >= 8) {
        const pollster = extractText(cells[1]);
        const affiliation = extractText(cells[2]);
        const sampleSize = extractNum(cells[3]);

        // Skip event announcement rows (colspan)
        if (cells[1] && cells[1].includes("colspan")) {
          i = j;
          continue;
        }

        const poll = {
          date,
          pollster: pollster || "Unknown",
          affiliation: affiliation || "",
          sampleSize: sampleSize || null,
          fidesz: extractNum(cells[4]),
          tisza: extractNum(cells[5]),
          dk: extractNum(cells[6]),
          miHazank: extractNum(cells[7]),
          mkkp: cells.length > 8 ? extractNum(cells[8]) : null,
          others: cells.length > 9 ? extractNum(cells[9]) : null,
          lead: cells.length > 10 ? extractNum(cells[10]) : null,
        };

        // Only add if we have at least fidesz and tisza numbers
        if (poll.fidesz !== null && poll.tisza !== null) {
          // Determine who leads
          poll.leader = poll.tisza > poll.fidesz ? "Tisza" : "Fidesz";
          polls.push(poll);
        }
      }
      i = j;
    } else {
      i++;
    }
  }

  return polls;
}

app.get("/api/polls", async (req, res) => {
  try {
    // Cache for 10 minutes
    const now = Date.now();
    if (pollsCache.data && now - pollsCache.ts < 600000) {
      return res.json(pollsCache.data);
    }

    const raw = await fetchText(
      "https://en.wikipedia.org/w/api.php?action=parse&page=Opinion_polling_for_the_2026_Hungarian_parliamentary_election&format=json&prop=wikitext"
    );
    const json = JSON.parse(raw);
    const wikitext = json.parse.wikitext["*"];
    const polls = parseWikiPolls(wikitext);

    const result = {
      source: "Wikipedia — Opinion polling for the 2026 Hungarian parliamentary election",
      lastFetched: new Date().toISOString(),
      count: polls.length,
      polls,
    };

    pollsCache = { data: result, ts: now };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── News (RSS from Hungarian media) ─────────────────────────────────────────

function parseXml(text, tag) {
  const results = [];
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  let m;
  while ((m = regex.exec(text)) !== null) results.push(m[1]);
  return results;
}

function extractTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, "s"));
  return m ? m[1].trim() : "";
}

const RSS_FEEDS = [
  { name: "Telex", url: "https://telex.hu/rss" },
  { name: "444.hu", url: "https://444.hu/feed" },
  { name: "HVG", url: "https://hvg.hu/rss" },
  { name: "Index", url: "https://index.hu/24ora/rss/" },
];

const ELECTION_KEYWORDS = [
  "választás", "szavazás", "fidesz", "tisza", "orbán", "magyar péter",
  "mi hazánk", "dk", "parlament", "mandátum", "kampány", "közvélemény",
  "felmérés", "poll", "election", "kormány", "ellenzék", "miniszterelnök",
  "kétharmad", "oevk", "szavazat", "jelölt", "lista", "koalíció",
];

let newsCache = { data: null, ts: 0 };

async function fetchRssArticles(feed) {
  try {
    const xml = await fetchText(feed.url);
    const items = parseXml(xml, "item");
    return items.slice(0, 30).map((item) => {
      const title = extractTag(item, "title");
      const link = extractTag(item, "link");
      const pubDate = extractTag(item, "pubDate");
      const description = extractTag(item, "description")
        .replace(/<[^>]+>/g, "")
        .substring(0, 200);
      return { title, link, pubDate, description, source: feed.name };
    });
  } catch {
    return [];
  }
}

function isElectionRelated(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return ELECTION_KEYWORDS.some((kw) => text.includes(kw));
}

app.get("/api/news", async (req, res) => {
  try {
    const now = Date.now();
    if (newsCache.data && now - newsCache.ts < 300000) {
      return res.json(newsCache.data);
    }

    const allArticles = await Promise.all(RSS_FEEDS.map(fetchRssArticles));
    const flat = allArticles.flat();
    const filtered = flat.filter(isElectionRelated);

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    const result = {
      source: "Telex, 444.hu, HVG, Index RSS",
      lastFetched: new Date().toISOString(),
      count: filtered.length,
      articles: filtered,
    };

    newsCache = { data: result, ts: now };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── YouTube (RSS from Hungarian political channels) ─────────────────────────

const YT_CHANNELS = [
  { name: "Jólvanezígy", id: "UC9qpYwK7N9EB0-SECANa23g", color: "#ef4444" },
  { name: "Partizán", id: "UCEFpEvuosfPGlV1VyUF6QOA", color: "#3b82f6" },
  { name: "Telex", id: "UCM-1sd-cXSuCsfWp8QMY_OQ", color: "#10b981" },
  { name: "444.hu", id: "UCGoLa-QhHmTxLEdjv_8dxrg", color: "#f59e0b" },
];

let ytCache = { data: null, ts: 0 };

async function fetchYtVideos(channel) {
  try {
    const xml = await fetchText(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`
    );
    const entries = parseXml(xml, "entry");
    const videos = entries.slice(0, 25).map((entry) => {
      const title = extractTag(entry, "title");
      const videoId = extractTag(entry, "yt:videoId");
      const published = extractTag(entry, "published");
      const updated = extractTag(entry, "updated");
      // Extract media:group content
      const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
      const description = descMatch ? descMatch[1].trim().substring(0, 200) : "";
      const thumbMatch = entry.match(/url="(https:\/\/i[^"]*\.jpg)"/);
      const thumbnail = thumbMatch ? thumbMatch[1] : `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
      const viewMatch = entry.match(/views="(\d+)"/);
      const views = viewMatch ? parseInt(viewMatch[1]) : null;

      return {
        title,
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail,
        published,
        updated,
        description,
        views,
        channel: channel.name,
        channelColor: channel.color,
      };
    });
    // Filter out YouTube Shorts (tagged with #shorts in title or description)
    const filtered = videos.filter((v) => {
      const combined = (v.title + " " + v.description).toLowerCase();
      return !combined.includes("#shorts") && !combined.includes("#short");
    });
    return filtered.slice(0, 10);
  } catch {
    return [];
  }
}

app.get("/api/youtube", async (req, res) => {
  try {
    const now = Date.now();
    if (ytCache.data && now - ytCache.ts < 300000) {
      return res.json(ytCache.data);
    }

    const allVideos = await Promise.all(YT_CHANNELS.map(fetchYtVideos));
    const flat = allVideos.flat();
    flat.sort((a, b) => new Date(b.published) - new Date(a.published));

    const result = {
      source: "YouTube RSS",
      lastFetched: new Date().toISOString(),
      count: flat.length,
      videos: flat,
    };

    ytCache = { data: result, ts: now };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Withdrawals (static JSON + live NVI candidate data) ─────────────────────

const fs = require("fs");
const path = require("path");

let withdrawalsCache = { data: null, ts: 0 };
let nviCandidatesCache = { data: null, ts: 0 };

app.get("/api/withdrawals", async (req, res) => {
  try {
    const now = Date.now();

    // Read static withdrawals JSON
    if (!withdrawalsCache.data || now - withdrawalsCache.ts > 60000) {
      const raw = fs.readFileSync(path.join(__dirname, "data", "withdrawals.json"), "utf-8");
      withdrawalsCache = { data: JSON.parse(raw), ts: now };
    }

    // Fetch NVI candidates (cache 30 min)
    let nviCandidates = null;
    if (!nviCandidatesCache.data || now - nviCandidatesCache.ts > 1800000) {
      try {
        const config = await fetchJSON("https://vtr.valasztas.hu/ogy2026/data/config.json");
        const ver = config.ver || "03281700";
        const candidates = await fetchJSON(`https://vtr.valasztas.hu/ogy2026/data/${ver}/ver/EgyeniJeloltek.json`);
        nviCandidatesCache = { data: candidates, ts: now };
        nviCandidates = candidates;
      } catch {
        nviCandidates = nviCandidatesCache.data;
      }
    } else {
      nviCandidates = nviCandidatesCache.data;
    }

    // Count official withdrawals from NVI data
    let nviStats = { total: 0, withdrawn: 0, active: 0 };
    if (nviCandidates && Array.isArray(nviCandidates)) {
      nviStats.total = nviCandidates.length;
      nviStats.withdrawn = nviCandidates.filter(c => c.allapot === 4 || c.allapot === 33).length;
      nviStats.active = nviCandidates.filter(c => c.allapot === 1).length;
    }

    res.json({
      ...withdrawalsCache.data,
      nviStats,
      nviSource: "vtr.valasztas.hu/ogy2026",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function safeParse(val) {
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return Array.isArray(val) ? val : [];
}

// ── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🇭🇺 Hungary Election API running on http://localhost:${PORT}`);
});
