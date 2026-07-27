export interface HeatmapDay {
  date: string;
  count: number;
  level: number;
}

export function dateToKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getLevel(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export function buildHeatmapWeeks(counts: Record<string, number>): HeatmapDay[][] {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const start = new Date(today);
  start.setUTCMonth(start.getUTCMonth() - 6);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const days: HeatmapDay[] = [];
  const cursor = new Date(start);
  while (cursor.getTime() <= today.getTime()) {
    const date = dateToKey(cursor);
    const count = counts[date] ?? 0;
    days.push({ date, count, level: getLevel(count) });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}
