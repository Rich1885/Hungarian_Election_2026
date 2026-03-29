// client/src/utils/mandateCalculator.js
// Magyar választási mandátumszámoló algoritmus
// 199 mandátum = 106 egyéni (OEVK) + 93 listás
// Tartalmazza: 5%-os küszöb, töredékszavazat, győzteskompenzáció, D'Hondt módszer

/**
 * D'Hondt módszer a listás helyek elosztására
 * @param {Object} votes - { pártNév: szavazatszám }
 * @param {number} totalSeats - elosztandó helyek száma (93)
 * @returns {Object} - { pártNév: mandátumszám }
 */
function calculateDHondt(votes, totalSeats) {
  const allocatedSeats = {};
  for (const party in votes) {
    allocatedSeats[party] = 0;
  }

  for (let i = 0; i < totalSeats; i++) {
    let maxQuotient = -1;
    let winningParty = null;

    for (const party in votes) {
      const quotient = votes[party] / (allocatedSeats[party] + 1);
      if (quotient > maxQuotient) {
        maxQuotient = quotient;
        winningParty = party;
      }
    }

    if (winningParty) {
      allocatedSeats[winningParty]++;
    }
  }

  return allocatedSeats;
}

/**
 * 2022-es valós OEVK eredmények alapadatai
 * Minden körzethez: a Fidesz és az ellenzék (akkor Egységben) %-os eredménye
 * Ezekre alkalmazzuk a Uniform National Swing modellt
 */
const OEVK_2022_BASE = generateOevkBase();

function generateOevkBase() {
  // 106 körzet szimulált 2022-es bázisadatai
  // A valóságban: Fidesz 54.13%, Egységben 34.44% országosan
  // Körzetenként Budapest (18 OEVK) ellenzékibb, vidék fideszesebb
  const districts = [];

  // Budapest: 18 körzet - ellenzéki felülreprezentáció
  for (let i = 0; i < 18; i++) {
    const fideszBase = 35 + Math.sin(i * 0.8) * 8; // 27-43%
    districts.push({
      id: i + 1,
      name: `Budapest ${i + 1}. OEVK`,
      region: 'budapest',
      fidesz2022: fideszBase,
      opposition2022: 100 - fideszBase - 12, // ~12% egyéb
    });
  }

  // Pest megye: 12 körzet - vegyes
  for (let i = 0; i < 12; i++) {
    const fideszBase = 45 + Math.sin(i * 0.6) * 7;
    districts.push({
      id: 19 + i,
      name: `Pest megye ${i + 1}. OEVK`,
      region: 'pest',
      fidesz2022: fideszBase,
      opposition2022: 100 - fideszBase - 10,
    });
  }

  // Nagyvárosok: 16 körzet - mérsékelt
  const cities = [
    'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr',
    'Nyíregyháza', 'Kecskemét', 'Székesfehérvár',
    'Szombathely', 'Szolnok', 'Eger', 'Kaposvár',
    'Veszprém', 'Békéscsaba', 'Zalaegerszeg', 'Sopron',
  ];
  for (let i = 0; i < 16; i++) {
    const fideszBase = 48 + Math.sin(i * 0.5) * 6;
    districts.push({
      id: 31 + i,
      name: `${cities[i]} OEVK`,
      region: 'city',
      fidesz2022: fideszBase,
      opposition2022: 100 - fideszBase - 11,
    });
  }

  // Vidék: 60 körzet - Fidesz bázis
  const counties = [
    'Bács-Kiskun', 'Baranya', 'Békés', 'Borsod-Abaúj-Zemplén',
    'Csongrád-Csanád', 'Fejér', 'Győr-Moson-Sopron', 'Hajdú-Bihar',
    'Heves', 'Jász-Nagykun-Szolnok', 'Komárom-Esztergom', 'Nógrád',
    'Somogy', 'Szabolcs-Szatmár-Bereg', 'Tolna', 'Vas',
    'Veszprém m.', 'Zala',
  ];
  for (let i = 0; i < 60; i++) {
    const county = counties[i % counties.length];
    const fideszBase = 55 + Math.sin(i * 0.3) * 8; // 47-63%
    districts.push({
      id: 47 + i,
      name: `${county} ${Math.floor(i / 18) + 1}. OEVK`,
      region: 'rural',
      fidesz2022: fideszBase,
      opposition2022: 100 - fideszBase - 9,
    });
  }

  return districts;
}

/**
 * Uniform National Swing alkalmazása egy körzetre
 * A 2022-es eredményeket eltoljuk az országos trendváltozással
 */
function applySwing(district, nationalPolls, parties2022) {
  // 2022-es országos eredmények
  const fidesz2022National = 54.13;
  const opposition2022National = 34.44;

  const districtVotes = {};
  const votersPerDistrict = 47000; // átlagos szavazószám / körzet

  for (const [party, currentPoll] of Object.entries(nationalPolls)) {
    if (party === 'Fidesz') {
      // Fidesz swing: jelenlegi - 2022-es országos, alkalmazva a helyi bázisra
      const swing = currentPoll - fidesz2022National;
      const localPct = Math.max(1, district.fidesz2022 + swing);
      districtVotes[party] = (localPct / 100) * votersPerDistrict;
    } else if (party === 'Tisza') {
      // TISZA a korábbi ellenzéki szavazóbázis nagy részét örökli
      const swing = currentPoll - opposition2022National;
      const localPct = Math.max(1, district.opposition2022 + swing);
      districtVotes[party] = (localPct / 100) * votersPerDistrict;
    } else {
      // Kisebb pártok: országos arányuk alapján, régiós korrekció nélkül
      let regionModifier = 1.0;
      if (party === 'Mi Hazánk') {
        if (district.region === 'rural') regionModifier = 1.3;
        if (district.region === 'budapest') regionModifier = 0.6;
      }
      districtVotes[party] = ((currentPoll / 100) * regionModifier) * votersPerDistrict;
    }
  }

  return districtVotes;
}

/**
 * Fő mandátumszámoló függvény
 * @param {Object} nationalPolls - { "Fidesz": 41, "Tisza": 45, "Mi Hazánk": 6, ... }
 * @returns {Array} - Rendezett eredmények mandátumszám szerint csökkenő sorrendben
 */
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

  // Inicializálás
  const oevkWins = {};
  const fragmentVotes = {};
  const oevkDetails = []; // Körzeti részletek a térképhez
  validParties.forEach(p => {
    oevkWins[p] = 0;
    fragmentVotes[p] = 0;
  });

  // 2. A 106 egyéni körzet szimulációja Uniform National Swing modellel
  for (let i = 0; i < OEVK_SEATS; i++) {
    const district = OEVK_2022_BASE[i];
    const districtVotes = applySwing(district,
      Object.fromEntries(
        Object.entries(nationalPolls).filter(([p]) => validParties.includes(p))
      ),
      null
    );

    // Ki nyerte a körzetet? (Relatív többség, nincs második forduló)
    const sortedParties = Object.keys(districtVotes)
      .sort((a, b) => districtVotes[b] - districtVotes[a]);

    const winner = sortedParties[0];
    const secondPlace = sortedParties[1];

    oevkWins[winner]++;

    // Körzeti részletek mentése (térkép komponenshez)
    oevkDetails.push({
      id: district.id,
      name: district.name,
      region: district.region,
      winner,
      margin: districtVotes[winner] - districtVotes[secondPlace],
      votes: districtVotes,
    });

    // 3. Töredékszavazatok számolása
    for (const p of validParties) {
      if (p === winner) {
        // Győzteskompenzáció: győztes szavazatai - második szavazatai - 1
        const surplus = districtVotes[winner] - (districtVotes[secondPlace] || 0) - 1;
        fragmentVotes[winner] += Math.max(0, surplus);
      } else {
        // Vesztesek: MINDEN szavazatuk megy a listára
        fragmentVotes[p] += districtVotes[p] || 0;
      }
    }
  }

  // 4. Országos listás szavazatok + töredékszavazatok összesítése
  const totalListVotes = {};
  validParties.forEach(p => {
    const directListVotes = (nationalPolls[p] / 100) * TOTAL_VOTERS;
    totalListVotes[p] = directListVotes + fragmentVotes[p];
  });

  // 5. D'Hondt módszerrel a 93 listás hely elosztása
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
      is2Thirds: total >= 133,       // Alkotmánymódosító többség
      isMajority: total >= 100,      // Egyszerű többség
      isBlocking: total >= 67,       // Blokkoló kisebbség (1/3+1)
    };
  });

  // Küszöb alatti pártok hozzáadása (0 mandátummal)
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

/**
 * Alapértelmezett közvélemény-kutatási adatok (a csúszka kezdőértékei)
 */
export const DEFAULT_POLLS = {
  'Fidesz': 40,
  'Tisza': 45,
  'Mi Hazánk': 6,
  'DK': 4,
  'Momentum': 2,
  'MSZP-Párbeszéd': 2,
  'LMP': 1,
};

/**
 * Párt színek a vizualizációhoz
 */
export const PARTY_COLORS = {
  'Fidesz': '#f97316',       // narancs
  'Tisza': '#10b981',        // zöld
  'Mi Hazánk': '#64748b',    // szürke
  'DK': '#3b82f6',           // kék
  'Momentum': '#a855f7',     // lila
  'MSZP-Párbeszéd': '#ef4444', // piros
  'LMP': '#22c55e',          // világoszöld
};

/**
 * Gyors teszt / demó
 */
export function runDemo() {
  console.log('=== Magyar Mandátumszámoló Demó ===');

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
