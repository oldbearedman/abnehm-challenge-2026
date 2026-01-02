export function calcDayPercent(profile) {
  if (!profile?.entries || profile.entries.length < 2) return null;

  const sorted = [...profile.entries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const last = sorted[sorted.length - 1];
  const prev = sorted[sorted.length - 2];

  const diff = prev.weight - last.weight;
  return (diff / prev.weight) * 100;
}

export function calcTrendPercent(profile, days = 7) {
  if (!profile?.entries || profile.entries.length < 2) return null;

  const sorted = [...profile.entries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const recent = sorted.slice(-days);
  if (recent.length < 2) return null;

  const first = recent[0].weight;
  const last = recent[recent.length - 1].weight;

  const diff = first - last;
  return (diff / first) * 100;
}


