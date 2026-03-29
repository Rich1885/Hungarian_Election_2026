// Lightweight internationalization — HU (default) / EN
const translations = {
  // Header
  "app.title":               { hu: "Magyarország 2026",          en: "Hungary 2026" },
  "app.subtitle":            { hu: "Választási Hírközpont",       en: "Election Intelligence Hub" },
  "app.live":                { hu: "ÉLŐ",                         en: "LIVE" },
  "app.countdown.days":      { hu: "NAP",                         en: "DAYS" },
  "app.countdown.hours":     { hu: "ÓRA",                         en: "HRS" },
  "app.countdown.until":     { hu: "a választásig — Április 12",  en: "until election — April 12" },
  "app.updated":             { hu: "Frissítve",                   en: "Updated" },
  "app.refresh":             { hu: "Frissítés",                   en: "Refresh" },
  "app.loading":             { hu: "Betöltés...",                  en: "Loading..." },

  // Tabs (new order: summary, polls, parliament, map, news, youtube, polymarket)
  "tab.summary":    { hu: "Összegzés",           en: "Overview" },
  "tab.polls":      { hu: "Közvéleménykutatás",  en: "Polls" },
  "tab.parliament": { hu: "Mandátumbecslő",      en: "Seat Projector" },
  "tab.map":        { hu: "Térkép - OEVK",       en: "Map - OEVK" },
  "tab.withdrawals": { hu: "Visszalépések",        en: "Withdrawals" },
  "tab.news":       { hu: "Hírek",               en: "News" },
  "tab.youtube":    { hu: "YouTube",              en: "YouTube" },
  "tab.markets":    { hu: "Polymarket",           en: "Polymarket" },

  // Footer
  "footer.data":  { hu: "Adatok: Polymarket, Wikipedia és magyar média RSS — Automatikus frissítés 30 másodpercenként", en: "Data: Polymarket, Wikipedia & Hungarian media RSS — Auto-refresh every 30 seconds" },
  "footer.title": { hu: "Magyarország 2026 Választási Központ", en: "Hungary 2026 Election Center" },

  // Summary
  "summary.raceOverview":     { hu: "Verseny Áttekintés",        en: "Race Overview" },
  "summary.vs":               { hu: "vs",                         en: "vs" },
  "summary.marketProb":       { hu: "Piaci Valószínűség",        en: "Market Probability" },
  "summary.pollAvg":          { hu: "Közvélemény Átlag",         en: "Poll Average" },
  "summary.markets":          { hu: "Piacok",                    en: "Markets" },
  "summary.polls":            { hu: "Közvél.",                   en: "Polls" },
  "summary.signalsAlign":     { hu: "vezet mindkettőben",        en: "leads both" },
  "summary.signalsMixed":     { hu: "Eltérő jelzések",           en: "Mixed signals" },
  "summary.marketDiff":       { hu: "Piaci Különbség",           en: "Market Diff." },
  "summary.pollDiff":         { hu: "Közvélemény Különbség",     en: "Poll Diff." },
  "summary.vol24h":           { hu: "24ó Forgalom",              en: "24h Volume" },
  "summary.totalVol":         { hu: "Összes Forgalom",           en: "Total Volume" },
  "summary.polymarket":       { hu: "Polymarket",                en: "Polymarket" },
  "summary.total":            { hu: "Összesen",                  en: "Total" },
  "summary.leads":            { hu: "vezet",                     en: "leads" },
  "summary.biasTitle":        { hu: "Közvéleménykutató Elfogultság", en: "Pollster Bias" },
  "summary.biasIndep":        { hu: "Független Kutatók",         en: "Independent Pollsters" },
  "summary.biasGov":          { hu: "Kormánypárti Kutatók",      en: "Gov.-Aligned Pollsters" },
  "summary.biasGap":          { hu: "Elfogultsági rés",          en: "Bias gap" },
  "summary.biasGapDesc":      { hu: "Különbség a független és kormánypárti kutatók között", en: "Gap between independent and gov.-aligned pollsters" },
  "summary.newsTitle":        { hu: "Legfrissebb Hírek",         en: "Latest Headlines" },
  "summary.latestPoll":       { hu: "Legfrissebb Közvélemény",   en: "Latest Poll" },

  // PollSummary
  "pollsummary.overall":  { hu: "Közvélemény Átlag (Utolsó 5)", en: "Poll Average (Last 5)" },
  "pollsummary.indep":    { hu: "Független Kutatók",             en: "Independent Pollsters" },
  "pollsummary.gov":      { hu: "Kormánypárti Kutatók",          en: "Gov.-Aligned Pollsters" },
  "pollsummary.last5":    { hu: "Utolsó 5 felmérés átlaga",      en: "Average of last 5 polls" },
  "pollsummary.leads":    { hu: "vezet",                         en: "leads" },

  // PollTable
  "polltable.title":   { hu: "Legutóbbi Felmérések",  en: "Recent Polls" },
  "polltable.surveys": { hu: "felmérés",              en: "surveys" },
  "polltable.date":    { hu: "Dátum",                 en: "Date" },
  "polltable.pollster":{ hu: "Kutató",                en: "Pollster" },
  "polltable.type":    { hu: "Típus",                 en: "Type" },
  "polltable.leads":   { hu: "Vezet",                 en: "Leads" },
  "polltable.gov":     { hu: "Korm.",                 en: "Gov." },
  "polltable.ind":     { hu: "Függ.",                 en: "Indep." },
  "polltable.source":  { hu: "Forrás: Wikipedia — A 2026-os magyar parlamenti választás közvélemény-kutatásai", en: "Source: Wikipedia — 2026 Hungarian parliamentary election opinion polls" },

  // OverviewTable
  "overview.title":    { hu: "Összes kimenetel",  en: "All Outcomes" },
  "overview.active":   { hu: "aktív piac",        en: "active markets" },
  "overview.rank":     { hu: "#",                 en: "#" },
  "overview.party":    { hu: "Párt",              en: "Party" },
  "overview.prob":     { hu: "Valószínűség",      en: "Probability" },
  "overview.24h":      { hu: "24ó",               en: "24h" },
  "overview.vol24h":   { hu: "24ó Forg.",         en: "24h Vol." },
  "overview.totalVol": { hu: "Össz. Forg.",       en: "Total Vol." },

  // ParliamentChart
  "parliament.warning.title":  { hu: "⚠ Fontos: Ez egy becslés, nem jóslat!", en: "⚠ Important: This is an estimate, not a prediction!" },
  "parliament.warning.body":   {
    hu: "A mandátumszámoló a 2022-es tényleges választási eredményeket kombinálja az utolsó 5 közvélemény-kutatás átlagával, és ebből becsüli meg a 106 egyéni körzet győztesét (Uniform National Swing). A 93 listás mandátumot a D'Hondt módszerrel osztja el, a töredékszavazatokkal és győzteskompenzációval együtt. A csúszkákkal 'mi lenne, ha...' forgatókönyveket próbálhatsz ki — de ezek mind feltételezések, egyik sem jóslat. A végső szót a szavazók mondják ki április 12-én.",
    en: "The seat calculator combines the actual 2022 election results with the average of the last 5 polls to estimate the winner of each of the 106 single-member districts (Uniform National Swing). The 93 list seats are allocated using the D'Hondt method, including fragment votes and winner's compensation. Use the sliders for 'what if' scenarios — but these are all assumptions, not predictions. Voters have the final say on April 12."
  },
  "parliament.edu.hint":       { hu: "Hogyan működik a rendszer? — Kattints a részletekért ↓", en: "How does the system work? — Click for details ↓" },
  "parliament.title":          { hu: "Mandátumbecslő",              en: "Seat Projector" },
  "parliament.subtitle":       { hu: "199 mandátum = 106 egyéni + 93 listás — D'Hondt módszer", en: "199 seats = 106 districts + 93 list seats — D'Hondt method" },
  "parliament.live":           { hu: "Élő közvélemény",             en: "Live polls" },
  "parliament.custom":         { hu: "Egyéni szimuláció",           en: "Custom simulation" },
  "parliament.liveBtn":        { hu: "Élő adatok",                  en: "Live data" },
  "parliament.sliders.title":  { hu: "Szavazati arányok",           en: "Vote shares" },
  "parliament.sliders.hint":   { hu: "Húzd a csúszkákat a \"mi lenne, ha...\" szimulációhoz", en: "Drag sliders for 'what if' scenarios" },
  "parliament.total":          { hu: "Összesen",                    en: "Total" },
  "parliament.tooHigh":        { hu: "— Túl magas!",                en: "— Too high!" },
  "parliament.largestParty":   { hu: "Legnagyobb párt",             en: "Largest party" },
  "parliament.govSide":        { hu: "Kormányoldal (Fidesz)",       en: "Gov. side (Fidesz)" },
  "parliament.opposition":     { hu: "Ellenzék",                    en: "Opposition" },
  "parliament.supermajority":  { hu: "Kétharmados többség!",        en: "Supermajority!" },
  "parliament.majority":       { hu: "Egyszerű többség",            en: "Simple majority" },
  "parliament.scenarios":      { hu: "Gyors forgatókönyvek:",       en: "Quick scenarios:" },
  "parliament.sc.current":     { hu: "Jelenlegi",                 en: "Current" },
  "parliament.sc.close":       { hu: "Szoros",                    en: "Close race" },
  "parliament.sc.fidesz23":    { hu: "Fidesz 2/3",                en: "Fidesz 2/3" },
  "parliament.sc.tisza23":     { hu: "TISZA 2/3",                 en: "TISZA 2/3" },
  "parliament.oevk":           { hu: "egyéni",                      en: "district" },
  "parliament.list":           { hu: "listás",                      en: "list" },
  "parliament.mandate":        { hu: "mandátum",                    en: "seats" },
  "parliament.threshold":      { hu: "KÜSZÖB ALATT",                en: "BELOW THRESHOLD" },
  "parliament.majority.badge": { hu: "TÖBBSÉG",                     en: "MAJORITY" },
  "parliament.2thirds.badge":  { hu: "KÉTHARMAD",                   en: "SUPERMAJ." },

  // Coalition
  "coalition.title":           { hu: "Koalíció Építő",              en: "Coalition Builder" },
  "coalition.subtitle":        { hu: "Fidesz + Mi Hazánk — az egyetlen valós koalíciós forgatókönyv", en: "Fidesz + Mi Hazánk — the only realistic coalition scenario" },
  "coalition.seats":           { hu: "mandátum",                    en: "seats" },
  "coalition.has133":          { hu: "Kétharmados többség!",        en: "Supermajority!" },
  "coalition.has100":          { hu: "Van többség a kormányalakításhoz", en: "Majority — can form government" },
  "coalition.noMaj":           { hu: "Nincs többség —",             en: "No majority —" },
  "coalition.missing":         { hu: "mandátum hiányzik",           en: "seats short" },

  // Education
  "edu.title":      { hu: "Így Számolunk — A Rendszer Magyarázata",   en: "How It Works — The System Explained" },
  "edu.subtitle":   { hu: "Miért torzít a választási rendszer? Miért kaphat valaki több szavazatot, de kevesebb mandátumot?", en: "Why does the electoral system distort? Why can someone get more votes but fewer seats?" },
  "edu.1.title":    { hu: "1. Győzteskompenzáció",                    en: "1. Winner's Compensation" },
  "edu.2.title":    { hu: "2. Töredékszavazatok",                     en: "2. Fragment Votes" },
  "edu.3.title":    { hu: "3. D'Hondt Módszer",                       en: "3. D'Hondt Method" },
  "edu.4.title":    { hu: "4. Az 5%-os Küszöb",                       en: "4. The 5% Threshold" },

  // Share
  "share.btn":      { hu: "Kép mentése / Megosztás",  en: "Save Image / Share" },

  // MapPage
  "map.warning.title": { hu: "⚠ Ez egy becslés, nem jóslat!", en: "⚠ This is an estimate, not a prediction!" },
  "map.title":         { hu: "OEVK Térkép",            en: "District Map" },
  "map.live":          { hu: "Élő közvélemény",         en: "Live polls" },
  "map.custom":        { hu: "Egyéni",                  en: "Custom" },
  "map.liveBtn":       { hu: "Élő adatok",              en: "Live data" },
  "map.oevkTitle":     { hu: "Egyéni körzetek",         en: "Single-member districts" },
  "map.scenarios":     { hu: "Gyors forgatókönyvek:",   en: "Quick scenarios:" },

  // News
  "news.title":         { hu: "Legfrissebb Hírek",   en: "Latest News" },
  "news.electionNews":  { hu: "Választási Hírek",    en: "Election News" },
  "news.filter":        { hu: "Összes",              en: "All" },
  "news.count":         { hu: "cikk",                en: "articles" },
  "news.source":        { hu: "Összegyűjtve: Telex, 444.hu, HVG, Index RSS — szűrve választási tartalomra", en: "Aggregated: Telex, 444.hu, HVG, Index RSS — filtered for election content" },

  // YouTube
  "yt.title":      { hu: "Legfrissebb Videók",   en: "Latest Videos" },
  "yt.filter":     { hu: "Összes",               en: "All" },
  "yt.all":        { hu: "Mind",                 en: "All" },
  "yt.videos":     { hu: "videó",                en: "videos" },
  "yt.views":      { hu: "megtekintés",          en: "views" },
  "yt.loading":    { hu: "YouTube videók betöltése...", en: "Loading YouTube videos..." },
  "yt.source":     { hu: "Forrás: YouTube RSS — Jólvanezígy, Partizán, Telex, 444.hu", en: "Source: YouTube RSS — Jólvanezígy, Partizán, Telex, 444.hu" },

  // PartyCard
  "card.winChance":     { hu: "Győzelmi esély",   en: "Win probability" },
  "card.24h":           { hu: "24ó",              en: "24h" },
  "card.7d":            { hu: "7n",               en: "7d" },
  "card.vol24h":        { hu: "24ó Forg.",        en: "24h Vol." },
  "card.liquidity":     { hu: "Likvid.",          en: "Liquid." },
  "card.priceHistory":  { hu: "Ártörténet",       en: "Price history" },
  "card.orderBook":     { hu: "Ajánlati könyv",   en: "Order book" },
  "card.marketQuality": { hu: "Piaci minőség",    en: "Market quality" },

  // Withdrawal Tracker
  "withdraw.title":       { hu: "Visszalepes-koveto",           en: "Withdrawal Tracker" },
  "withdraw.subtitle":    { hu: "Jelolti visszalepesek a kormanyvaltasert", en: "Candidate withdrawals for government change" },
  "withdraw.national":    { hu: "Orszagos szintu visszalepesek", en: "National-level withdrawals" },
  "withdraw.district":    { hu: "Egyeni korzeti visszalepesek", en: "District-level withdrawals" },
  "withdraw.party":       { hu: "Part",                          en: "Party" },
  "withdraw.candidate":   { hu: "Jelolt",                        en: "Candidate" },
  "withdraw.date":        { hu: "Datum",                         en: "Date" },
  "withdraw.beneficiary": { hu: "Kedvezmenyezett",               en: "Beneficiary" },
  "withdraw.reason":      { hu: "Indoklas",                      en: "Reason" },
  "withdraw.source":      { hu: "Forras",                        en: "Source" },
  "withdraw.noList":      { hu: "Nem indit listat",              en: "Not running a list" },
  "withdraw.steppedDown": { hu: "Visszalepett",                  en: "Stepped down" },
  "withdraw.inFavourOf":  { hu: "javara",                        en: "in favour of" },
  "withdraw.nviTitle":    { hu: "NVI Hivatalos Adatok",          en: "NVI Official Data" },
  "withdraw.nviTotal":    { hu: "Osszes jelolt",                 en: "Total candidates" },
  "withdraw.nviActive":   { hu: "Aktiv",                         en: "Active" },
  "withdraw.nviWithdrawn":{ hu: "Visszalepett/Torolt",           en: "Withdrawn/Removed" },
  "withdraw.impact":      { hu: "Hatas a mandatumbecslesre",     en: "Impact on seat projection" },
  "withdraw.totalCount":  { hu: "visszalepes osszesen",          en: "total withdrawals" },

  // Party Strategies
  "withdraw.strategies":       { hu: "Párt stratégiák",              en: "Party Strategies" },
  "withdraw.strategy.full":    { hu: "Teljes visszalépés",           en: "Full withdrawal" },
  "withdraw.strategy.partial": { hu: "Részleges visszalépés",        en: "Partial withdrawal" },
  "withdraw.strategy.running": { hu: "Indul",                        en: "Running" },
  "withdraw.strategy.marginal":{ hu: "Marginális",                   en: "Marginal" },
  "withdraw.strategy.everywhere":{ hu: "Mindenhol indul",            en: "Running everywhere" },

  // Notable Non-Withdrawals
  "withdraw.nonWithdrawals":   { hu: "Nem léptek vissza",            en: "Notable Non-Withdrawals" },
  "withdraw.nonWithdrawals.desc":{ hu: "Ahol a pártok úgy döntöttek, NEM lépnek vissza", en: "Where parties decided NOT to step down" },
  "withdraw.staysInRace":      { hu: "Marad a versenyben",           en: "Stays in race" },

  // MSZP Independents
  "withdraw.mszpIndep":        { hu: "MSZP függetlenek",             en: "MSZP Independents" },
  "withdraw.mszpIndep.desc":   { hu: "Volt MSZP-s politikusok akik függetlenként indulnak", en: "Former MSZP politicians running as independents" },

  // OEVK Estimate
  "withdraw.oevkEstimate":     { hu: "OEVK becslés",                 en: "District Estimate" },
  "withdraw.oevkTisza":        { hu: "TISZA felé hajlik",            en: "TISZA-leaning" },
  "withdraw.oevkBattle":       { hu: "Csatatér",                     en: "Battleground" },
  "withdraw.oevkFidesz":       { hu: "Fidesz felé hajlik",           en: "Fidesz-leaning" },
  "withdraw.oevkOf106":        { hu: "a 106-ból",                    en: "of 106" },

  // timeAgo
  "time.justNow":  { hu: "épp most",            en: "just now" },
  "time.minsAgo":  { hu: "p ezelőtt",           en: "m ago" },
  "time.hoursAgo": { hu: "ó ezelőtt",           en: "h ago" },
  "time.daysAgo":  { hu: "n ezelőtt",           en: "d ago" },
};

let currentLang = "hu";

export function setLanguage(lang) { currentLang = lang; }
export function getLanguage() { return currentLang; }

export function t(key) {
  const entry = translations[key];
  if (!entry) return key;
  return entry[currentLang] || entry.hu || key;
}

export function timeAgoI18n(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("time.justNow");
  if (mins < 60) return `${mins}${t("time.minsAgo")}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}${t("time.hoursAgo")}`;
  return `${Math.floor(hrs / 24)}${t("time.daysAgo")}`;
}
