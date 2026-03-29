const BASE = "https://hungarian-election-2026-api.onrender.com/api";

export async function fetchEvent() {
  const res = await fetch(`${BASE}/event`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
}

export async function fetchBook(tokenId) {
  const res = await fetch(`${BASE}/book/${tokenId}`);
  if (!res.ok) throw new Error("Failed to fetch book");
  return res.json();
}

export async function fetchHistory(tokenId, fidelity = 50) {
  const res = await fetch(`${BASE}/history/${tokenId}?fidelity=${fidelity}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function fetchMidpoint(tokenId) {
  const res = await fetch(`${BASE}/midpoint/${tokenId}`);
  if (!res.ok) throw new Error("Failed to fetch midpoint");
  return res.json();
}

export async function fetchPolls() {
  const res = await fetch(`${BASE}/polls`);
  if (!res.ok) throw new Error("Failed to fetch polls");
  return res.json();
}

export async function fetchNews() {
  const res = await fetch(`${BASE}/news`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

export async function fetchYoutube() {
  const res = await fetch(`${BASE}/youtube`);
  if (!res.ok) throw new Error("Failed to fetch youtube");
  return res.json();
}

export async function fetchWithdrawals() {
  const res = await fetch(`${BASE}/withdrawals`);
  if (!res.ok) throw new Error("Failed to fetch withdrawals");
  return res.json();
}
