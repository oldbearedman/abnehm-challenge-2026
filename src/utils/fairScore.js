export function calcTrendKg(profile, days = 7) {
  if (!profile?.entries || profile.entries.length < 2) return null;

  const sorted = [...profile.entries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const recent = sorted.slice(-days);
  if (recent.length < 2) return null;

  return recent[0].weight - recent[recent.length - 1].weight;
}

export function calcFairScore(profile, weeks = 4) {
  if (!profile || !profile.startWeight) return null;

  const trendKg = calcTrendKg(profile, 7);
  if (trendKg === null) return null;

  const expectedKg = profile.startWeight * 0.01 * weeks;
  if (expectedKg <= 0) return null;

  return (trendKg / expectedKg) * 100;
}


