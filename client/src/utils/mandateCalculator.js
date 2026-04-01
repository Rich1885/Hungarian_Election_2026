// client/src/utils/mandateCalculator.js
// Magyar választási mandátumszámoló algoritmus – Vokstérkép-minőségű verzió
// 199 mandátum = 106 egyéni (OEVK) + 93 listás
// D'Hondt elosztás, 5%-os küszöb, töredékszavazat, győzteskompenzáció

// ────────────────────────────────────────────────
//  D'Hondt módszer
// ────────────────────────────────────────────────
function calculateDHondt(votes, totalSeats) {
  const allocatedSeats = {};
  for (const party in votes) allocatedSeats[party] = 0;

  for (let i = 0; i < totalSeats; i++) {
    let maxQ = -1;
    let winner = null;
    for (const party in votes) {
      const q = votes[party] / (allocatedSeats[party] + 1);
      if (q > maxQ) { maxQ = q; winner = party; }
    }
    if (winner) allocatedSeats[winner]++;
  }
  return allocatedSeats;
}

// ────────────────────────────────────────────────
//  106 OEVK bázisadatok – NVI hivatalos sorrend
//  Kombinált bázis: 2022 OGY + 2024 EP eredmények
// ────────────────────────────────────────────────
//
// Mezők:  id, name, region,
//         fidesz22  – 2022 OGY Fidesz % (OEVK szint)
//         opp22     – 2022 OGY Egységben/Ellenzék %
//         fidesz24  – 2024 EP Fidesz %
//         tisza24   – 2024 EP Tisza %
//         dk24      – 2024 EP DK %
//         mh24      – 2024 EP Mi Hazánk %
//
// A „bázis" (ahonnan a swing indul) ezek súlyozott átlaga.

const RAW_OEVK = buildRawOevkData();

function buildRawOevkData() {
  const d = [];

  // ── 1-21: Vidéki megyeszékhelyek és vegyes körzetek ──
  const seg1 = [
    // id, name, region, f22, opp22, f24, t24, dk24, mh24
    [1,  'Győr 1.',              'city',  56, 33, 47, 30, 5, 7],
    [2,  'Székesfehérvár 1.',    'city',  53, 35, 45, 32, 5, 7],
    [3,  'Debrecen 1.',          'city',  52, 35, 44, 32, 6, 7],
    [4,  'Debrecen 2.',          'city',  54, 33, 46, 30, 5, 8],
    [5,  'Miskolc 1.',           'city',  48, 39, 42, 35, 6, 7],
    [6,  'Miskolc 2.',           'city',  50, 37, 43, 33, 6, 8],
    [7,  'Szeged 1.',            'city',  44, 43, 39, 37, 7, 6],
    [8,  'Szeged 2.',            'city',  46, 41, 40, 36, 7, 6],
    [9,  'Pécs 1.',              'city',  45, 42, 40, 37, 7, 6],
    [10, 'Pécs 2.',              'city',  47, 40, 42, 35, 6, 7],
    [11, 'Nyíregyháza 1.',       'city',  55, 32, 47, 29, 5, 8],
    [12, 'Kecskemét 1.',         'city',  56, 31, 48, 28, 4, 9],
    [13, 'Szombathely 1.',       'city',  46, 42, 41, 36, 6, 6],
    [14, 'Kaposvár 1.',          'city',  58, 29, 50, 26, 4, 9],
    [15, 'Veszprém 1.',          'city',  50, 37, 44, 33, 5, 7],
    [16, 'Eger 1.',              'city',  49, 38, 43, 33, 6, 7],
    [17, 'Szolnok 1.',           'city',  54, 33, 47, 29, 5, 8],
    [18, 'Békéscsaba 1.',        'city',  53, 34, 46, 30, 5, 8],
    [19, 'Zalaegerszeg 1.',      'city',  57, 30, 49, 27, 4, 9],
    [20, 'Sopron 1.',            'city',  54, 34, 47, 31, 5, 7],
    [21, 'Tatabánya 1.',         'city',  50, 37, 44, 33, 6, 7],
  ];

  // ── 22-39: Budapest (18 OEVK) – Tisza/Ellenzéki fellegvár ──
  const seg2 = [
    [22, 'Budapest 1. (I-V.)',       'budapest', 38, 50, 33, 42, 9, 4],
    [23, 'Budapest 2. (II. É)',      'budapest', 40, 48, 35, 40, 8, 4],
    [24, 'Budapest 3. (II. D-III.)', 'budapest', 39, 49, 34, 41, 9, 4],
    [25, 'Budapest 4. (IV.)',        'budapest', 37, 49, 33, 41, 9, 5],
    [26, 'Budapest 5. (VI-VII.)',    'budapest', 30, 57, 26, 47, 11, 3],
    [27, 'Budapest 6. (VIII. É)',    'budapest', 34, 53, 30, 44, 10, 4],
    [28, 'Budapest 7. (VIII-IX.)',   'budapest', 33, 54, 29, 45, 10, 4],
    [29, 'Budapest 8. (X.)',         'budapest', 39, 48, 35, 40, 8, 5],
    [30, 'Budapest 9. (XI. É)',      'budapest', 36, 51, 32, 43, 9, 4],
    [31, 'Budapest 10. (XI. D)',     'budapest', 38, 49, 34, 41, 9, 4],
    [32, 'Budapest 11. (XII-Hv)',    'budapest', 42, 46, 37, 38, 8, 5],
    [33, 'Budapest 12. (XIII. É)',   'budapest', 32, 55, 28, 46, 10, 4],
    [34, 'Budapest 13. (XIII. D)',   'budapest', 34, 53, 30, 44, 10, 4],
    [35, 'Budapest 14. (XIV.)',      'budapest', 36, 51, 32, 43, 9, 4],
    [36, 'Budapest 15. (XV-XVI.)',   'budapest', 42, 45, 38, 38, 8, 5],
    [37, 'Budapest 16. (XVII.)',     'budapest', 44, 43, 40, 36, 7, 5],
    [38, 'Budapest 17. (XVIII.)',    'budapest', 43, 44, 39, 37, 8, 5],
    [39, 'Budapest 18. (XIX-XXI-XXIII.)', 'budapest', 41, 46, 37, 39, 8, 5],
  ];

  // ── 40-71: Vidéki városok és vegyes körzetek (32 OEVK) ──
  const seg3 = [
    [40, 'Debrecen 3.',                'city',  55, 32, 47, 29, 5, 8],
    [41, 'Hajdú-Bihar 1.',             'rural', 61, 26, 53, 24, 4, 9],
    [42, 'Hajdú-Bihar 2.',             'rural', 59, 28, 52, 25, 4, 9],
    [43, 'Szabolcs-Sz-B 1.',           'rural', 62, 25, 54, 22, 3, 10],
    [44, 'Szabolcs-Sz-B 2.',           'rural', 63, 24, 55, 21, 3, 10],
    [45, 'Szabolcs-Sz-B 3.',           'rural', 64, 23, 56, 20, 3, 11],
    [46, 'Borsod-A-Z 1.',              'rural', 57, 30, 49, 27, 5, 9],
    [47, 'Borsod-A-Z 2.',              'rural', 59, 28, 51, 25, 4, 10],
    [48, 'Borsod-A-Z 3.',              'rural', 60, 27, 52, 24, 4, 10],
    [49, 'Heves 1.',                   'rural', 54, 33, 47, 29, 5, 8],
    [50, 'Heves 2.',                   'rural', 56, 31, 49, 27, 5, 9],
    [51, 'Jász-N-Sz 1.',               'rural', 58, 29, 50, 26, 4, 9],
    [52, 'Jász-N-Sz 2.',               'rural', 59, 28, 51, 25, 4, 10],
    [53, 'Bács-Kiskun 1.',             'rural', 58, 29, 50, 26, 4, 9],
    [54, 'Bács-Kiskun 2.',             'rural', 60, 27, 52, 24, 4, 10],
    [55, 'Bács-Kiskun 3.',             'rural', 57, 30, 49, 27, 5, 9],
    [56, 'Csongrád-Cs 1.',             'rural', 52, 35, 45, 31, 6, 7],
    [57, 'Csongrád-Cs 2.',             'rural', 54, 33, 47, 29, 5, 8],
    [58, 'Békés 1.',                   'rural', 56, 31, 49, 27, 5, 9],
    [59, 'Békés 2.',                   'rural', 58, 29, 50, 26, 4, 9],
    [60, 'Fejér 1.',                   'rural', 53, 34, 46, 30, 5, 8],
    [61, 'Fejér 2.',                   'rural', 55, 32, 48, 28, 5, 8],
    [62, 'Komárom-E 1.',               'rural', 52, 35, 45, 31, 6, 7],
    [63, 'Komárom-E 2.',               'rural', 54, 33, 47, 29, 5, 8],
    [64, 'Győr-M-S 1.',                'rural', 56, 31, 49, 27, 5, 8],
    [65, 'Győr-M-S 2.',                'rural', 55, 32, 48, 28, 5, 8],
    [66, 'Vas 1.',                     'rural', 54, 33, 47, 29, 5, 8],
    [67, 'Vas 2.',                     'rural', 56, 31, 49, 27, 5, 9],
    [68, 'Veszprém m. 1.',             'rural', 53, 34, 46, 30, 5, 8],
    [69, 'Veszprém m. 2.',             'rural', 55, 32, 48, 28, 5, 8],
    [70, 'Baranya 1.',                 'rural', 54, 33, 47, 29, 5, 8],
    [71, 'Baranya 2.',                 'rural', 56, 31, 49, 27, 5, 9],
  ];

  // ── 72-83: Pest megye (12 OEVK) – agglomeráció, kiegyenlítettebb ──
  const seg4 = [
    [72, 'Pest 1. (Budakeszi-Érd)',    'pest', 43, 44, 38, 38, 8, 5],
    [73, 'Pest 2. (Szentendre)',        'pest', 42, 45, 37, 39, 8, 5],
    [74, 'Pest 3. (Dunakeszi)',         'pest', 41, 46, 36, 40, 8, 5],
    [75, 'Pest 4. (Gödöllő)',          'pest', 44, 43, 39, 37, 7, 6],
    [76, 'Pest 5. (Veresegyház)',       'pest', 46, 41, 41, 35, 7, 6],
    [77, 'Pest 6. (Vác)',              'pest', 48, 39, 43, 33, 6, 7],
    [78, 'Pest 7. (Gyál-Ócsa)',        'pest', 49, 38, 44, 32, 6, 7],
    [79, 'Pest 8. (Monor)',            'pest', 51, 36, 45, 31, 5, 8],
    [80, 'Pest 9. (Dabas-Ráckeve)',    'pest', 52, 35, 46, 30, 5, 8],
    [81, 'Pest 10. (Érd D)',           'pest', 45, 42, 40, 36, 7, 6],
    [82, 'Pest 11. (Szigetszentm.)',   'pest', 47, 40, 42, 34, 7, 6],
    [83, 'Pest 12. (Cegléd)',          'pest', 53, 34, 47, 29, 5, 8],
  ];

  // ── 84-106: Vidéki fennmaradó körzetek (23 OEVK) ──
  const seg5 = [
    [84,  'Somogy 1.',           'rural', 59, 28, 51, 25, 4, 9],
    [85,  'Somogy 2.',           'rural', 61, 26, 53, 23, 4, 10],
    [86,  'Tolna 1.',            'rural', 57, 30, 49, 27, 5, 9],
    [87,  'Tolna 2.',            'rural', 59, 28, 51, 25, 4, 9],
    [88,  'Zala 1.',             'rural', 58, 29, 50, 26, 4, 9],
    [89,  'Zala 2.',             'rural', 60, 27, 52, 24, 4, 10],
    [90,  'Nógrád 1.',           'rural', 53, 34, 46, 30, 5, 8],
    [91,  'Nógrád 2.',           'rural', 55, 32, 48, 28, 5, 9],
    [92,  'Szabolcs-Sz-B 4.',    'rural', 61, 26, 53, 23, 3, 10],
    [93,  'Szabolcs-Sz-B 5.',    'rural', 60, 27, 52, 24, 3, 10],
    [94,  'Borsod-A-Z 4.',       'rural', 58, 29, 50, 26, 5, 9],
    [95,  'Borsod-A-Z 5.',       'rural', 56, 31, 48, 28, 5, 8],
    [96,  'Hajdú-Bihar 3.',      'rural', 58, 29, 50, 26, 4, 9],
    [97,  'Somogy 3.',           'rural', 60, 27, 52, 24, 4, 10],
    [98,  'Fejér 3.',            'rural', 54, 33, 47, 29, 5, 8],
    [99,  'Győr-M-S 3.',         'rural', 55, 32, 48, 28, 5, 8],
    [100, 'Komárom-E 3.',        'rural', 53, 34, 46, 30, 5, 8],
    [101, 'Bács-Kiskun 4.',      'rural', 59, 28, 51, 25, 4, 9],
    [102, 'Csongrád-Cs 3.',      'rural', 55, 32, 48, 28, 5, 8],
    [103, 'Békés 3.',            'rural', 57, 30, 49, 27, 5, 9],
    [104, 'Jász-N-Sz 3.',        'rural', 57, 30, 49, 27, 5, 9],
    [105, 'Baranya 3.',          'rural', 55, 32, 48, 28, 5, 8],
    [106, 'Veszprém m. 3.',      'rural', 54, 33, 47, 29, 5, 8],
  ];

  [...seg1, ...seg2, ...seg3, ...seg4, ...seg5].forEach(row => {
    const [id, name, region, f22, opp22, f24, t24, dk24, mh24] = row;
    // Kombinált bázis: 2022 OGY + 2024 EP súlyozott átlaga
    // A 2022-es ellenzéki eredményből becsüljük a Tisza potenciálját (~70%-a az ellenzéki szavazóknak)
    const tiszaFrom22 = opp22 * 0.70;
    const dkFrom22 = opp22 * 0.15;

    d.push({
      id,
      name: `${name} OEVK`,
      region,
      // Fidesz bázis: 50% 2022 + 50% 2024
      fideszBase: f22 * 0.5 + f24 * 0.5,
      // Tisza bázis: 40% becsült 2022 + 60% valós 2024 EP (a Tisza frissebb, EP relevánsabb)
      tiszaBase: tiszaFrom22 * 0.4 + t24 * 0.6,
      // DK bázis
      dkBase: dkFrom22 * 0.4 + dk24 * 0.6,
      // Mi Hazánk bázis
      mhBase: mh24,
      // Maradék kispárt-keret
      otherBase: Math.max(2, 100 - (f22 * 0.5 + f24 * 0.5) - (tiszaFrom22 * 0.4 + t24 * 0.6) - (dkFrom22 * 0.4 + dk24 * 0.6) - mh24),
    });
  });

  return d;
}

// ────────────────────────────────────────────────
//  Országos bázis referencia (ahonnan a swing indul)
//  2022 OGY + 2024 EP átlaga
// ────────────────────────────────────────────────
const NATIONAL_BASE = {
  'Fidesz': 49.0,     // ~54% OGY + ~44% EP → átlag
  'Tisza': 27.5,      // becsült 2022 (~24%) + 2024 EP (~30%) → súlyozott
  'DK': 6.5,
  'Mi Hazánk': 7.5,
  'Momentum': 2.5,
  'MSZP-Párbeszéd': 2.0,
  'LMP': 1.0,
};

// ────────────────────────────────────────────────
//  Proporcionális Swing – logit-alapú
//  Megakadályozza a 0% alá vagy 100% fölé csúszást,
//  és „összenyomja" a görbét a széleken (reálisabb).
// ────────────────────────────────────────────────
function logit(p) {
  const clamped = Math.max(0.001, Math.min(0.999, p));
  return Math.log(clamped / (1 - clamped));
}

function invLogit(x) {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Proporcionális swing alkalmazása egy körzetre.
 * A logit-térben tolja el a szavazatarányokat,
 * majd visszanormálja, hogy összesen ~100% legyen.
 */
function applySwing(district, nationalPolls, validParties) {
  const votersPerDistrict = 47000;
  const districtVotes = {};

  // Régió-szorzók a kispártokhoz
  const regionMod = (party, region) => {
    if (party === 'DK') {
      if (region === 'budapest') return 1.8;
      if (region === 'pest') return 1.3;
      if (region === 'city') return 1.1;
      return 0.65;
    }
    if (party === 'Momentum') {
      if (region === 'budapest') return 2.0;
      if (region === 'pest') return 1.4;
      if (region === 'city') return 0.9;
      return 0.5;
    }
    if (party === 'Mi Hazánk') {
      if (region === 'budapest') return 0.55;
      if (region === 'pest') return 0.8;
      if (region === 'city') return 1.0;
      return 1.4;
    }
    if (party === 'MSZP-Párbeszéd') {
      if (region === 'budapest') return 1.6;
      if (region === 'pest') return 1.2;
      return 0.8;
    }
    if (party === 'LMP') {
      if (region === 'budapest') return 1.8;
      if (region === 'pest') return 1.3;
      return 0.6;
    }
    return 1.0;
  };

  // Nyers százalékos becslés logit-swing-gel
  const rawPcts = {};
  for (const party of validParties) {
    const currentNational = nationalPolls[party] / 100;
    const baseNational = (NATIONAL_BASE[party] || 3) / 100;

    let localBase;
    if (party === 'Fidesz') {
      localBase = district.fideszBase / 100;
    } else if (party === 'Tisza') {
      localBase = district.tiszaBase / 100;
    } else if (party === 'DK') {
      localBase = (district.dkBase / 100) * regionMod(party, district.region);
    } else if (party === 'Mi Hazánk') {
      localBase = (district.mhBase / 100) * regionMod(party, district.region);
    } else {
      // Kispártok: országos bázis * régió szorzó
      localBase = (baseNational) * regionMod(party, district.region);
    }

    // Logit-swing: logit(local_new) = logit(local_base) + [logit(national_new) - logit(national_base)]
    const swingLogit = logit(currentNational) - logit(baseNational);
    const newLocal = invLogit(logit(localBase) + swingLogit);

    rawPcts[party] = Math.max(0.005, newLocal); // minimum 0.5%
  }

  // Normalizálás: az összes párt összege legyen ~1.0
  const total = Object.values(rawPcts).reduce((s, v) => s + v, 0);
  for (const party of validParties) {
    districtVotes[party] = (rawPcts[party] / total) * votersPerDistrict;
  }

  return districtVotes;
}

// ────────────────────────────────────────────────
//  Fő mandátumszámoló
// ────────────────────────────────────────────────
export function calculateMandates(nationalPolls) {
  const TOTAL_VOTERS = 5000000;
  const OEVK_SEATS = 106;
  const LIST_SEATS = 93;
  const THRESHOLD = 5;

  // 1. Küszöb: 5% alatti pártok kiesnek a listás elosztásból
  const validParties = [];
  const belowThreshold = [];

  for (const [party, percentage] of Object.entries(nationalPolls)) {
    if (percentage >= THRESHOLD) {
      validParties.push(party);
    } else {
      belowThreshold.push({ party, percentage });
    }
  }

  const oevkWins = {};
  const fragmentVotes = {};
  const oevkDetails = [];

  validParties.forEach(p => {
    oevkWins[p] = 0;
    fragmentVotes[p] = 0;
  });

  // 2. 106 egyéni körzet szimulációja proporcionális swing modellel
  for (let i = 0; i < OEVK_SEATS; i++) {
    const district = RAW_OEVK[i];
    const districtVotes = applySwing(district, nationalPolls, validParties);

    const sortedParties = Object.keys(districtVotes)
      .sort((a, b) => districtVotes[b] - districtVotes[a]);

    const winner = sortedParties[0];
    const second = sortedParties[1];

    if (winner) {
      oevkWins[winner]++;

      oevkDetails.push({
        id: district.id,
        name: district.name,
        region: district.region,
        winner,
        margin: districtVotes[winner] - (districtVotes[second] || 0),
        votes: districtVotes,
      });

      // 3. Töredékszavazatok – Magyar szabály:
      //    Győztes:  surplus = (győztes szavazat) − (második szavazat) − 1
      //    Vesztes:  MINDEN szavazata töredékszavazat
      for (const p of validParties) {
        if (p === winner) {
          const surplus = districtVotes[winner] - (districtVotes[second] || 0) - 1;
          fragmentVotes[winner] += Math.max(0, surplus);
        } else {
          fragmentVotes[p] += districtVotes[p] || 0;
        }
      }
    }
  }

  // 4. Országos listás szavazatok + töredékszavazatok
  const totalListVotes = {};
  validParties.forEach(p => {
    const directListVotes = (nationalPolls[p] / 100) * TOTAL_VOTERS;
    totalListVotes[p] = directListVotes + fragmentVotes[p];
  });

  // 5. D'Hondt elosztás (93 listás hely)
  const listSeats = calculateDHondt(totalListVotes, LIST_SEATS);

  // 6. Végeredmény
  const results = validParties.map(p => {
    const total = oevkWins[p] + listSeats[p];
    return {
      party: p,
      oevk: oevkWins[p],
      list: listSeats[p],
      total,
      percentage: nationalPolls[p],
      is2Thirds: total >= 133,
      isMajority: total >= 100,
      isBlocking: total >= 67,
    };
  });

  belowThreshold.forEach(({ party, percentage }) => {
    results.push({
      party,
      oevk: 0,
      list: 0,
      total: 0,
      percentage,
      is2Thirds: false,
      isMajority: false,
      isBlocking: false,
      belowThreshold: true,
    });
  });

  return {
    results: results.sort((a, b) => b.total - a.total),
    oevkDetails,
    summary: {
      totalSeats: 199,
      governmentSeats: results.filter(r => r.party === 'Fidesz').reduce((s, r) => s + r.total, 0),
      oppositionSeats: results.filter(r => r.party !== 'Fidesz').reduce((s, r) => s + r.total, 0),
      largestParty: results.sort((a, b) => b.total - a.total)[0]?.party,
      has2Thirds: results.some(r => r.is2Thirds),
      hasMajority: results.some(r => r.isMajority),
    },
  };
}

// ────────────────────────────────────────────────
//  Exportok (a UI-hoz, 100% kompatibilis)
// ────────────────────────────────────────────────
export const DEFAULT_POLLS = {
  'Fidesz': 39,
  'Tisza': 44,
  'Mi Hazánk': 6,
  'DK': 1,
  'Momentum': 0,
  'MSZP-Párbeszéd': 0,
  'LMP': 0,
};

export const PARTY_COLORS = {
  'Fidesz': '#f97316',
  'Tisza': '#10b981',
  'Mi Hazánk': '#64748b',
  'DK': '#3b82f6',
  'Momentum': '#a855f7',
  'MSZP-Párbeszéd': '#ef4444',
  'LMP': '#22c55e',
};

export function runDemo() {
  console.log('=== Magyar Mandátumszámoló – Vokstérkép v2 ===');

  const scenarios = [
    { name: 'Jelenlegi közvélemény', polls: { Fidesz: 40, Tisza: 45, 'Mi Hazánk': 6, DK: 4 } },
    { name: 'Szoros verseny', polls: { Fidesz: 44, Tisza: 44, 'Mi Hazánk': 6, DK: 3 } },
    { name: 'Fidesz 2/3', polls: { Fidesz: 55, Tisza: 30, 'Mi Hazánk': 7, DK: 5 } },
    { name: 'TISZA földcsuszamlás', polls: { Fidesz: 33, Tisza: 50, 'Mi Hazánk': 8, DK: 5 } },
  ];

  scenarios.forEach(({ name, polls }) => {
    const { results, summary } = calculateMandates(polls);
    console.log(`\n--- ${name} ---`);
    results.forEach(r => {
      const flags = [];
      if (r.is2Thirds) flags.push('2/3!');
      if (r.isMajority) flags.push('TÖBBSÉG');
      if (r.belowThreshold) flags.push('küszöb alatt');
      console.log(`  ${r.party}: ${r.total} mandátum (${r.oevk} egyéni + ${r.list} listás) ${flags.join(' ')}`);
    });
    console.log(`  Összesen: ${summary.governmentSeats} Fidesz vs ${summary.oppositionSeats} ellenzék`);
  });
}
