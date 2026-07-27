export interface MonthDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  count: number;
}

export function dateToKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function mondayFirstWeekday(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

export function buildMonthGrid(
  year: number,
  month: number,
  counts: Record<string, number>,
): MonthDay[][] {
  const todayKey = dateToKey(new Date());

  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const gridStart = new Date(firstOfMonth);
  gridStart.setUTCDate(gridStart.getUTCDate() - mondayFirstWeekday(firstOfMonth));

  const lastOfMonth = new Date(Date.UTC(year, month + 1, 0));
  const gridEnd = new Date(lastOfMonth);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - mondayFirstWeekday(lastOfMonth)));

  const days: MonthDay[] = [];
  const cursor = new Date(gridStart);
  while (cursor.getTime() <= gridEnd.getTime()) {
    const date = dateToKey(cursor);
    days.push({
      date,
      day: cursor.getUTCDate(),
      isCurrentMonth: cursor.getUTCMonth() === month,
      isToday: date === todayKey,
      count: counts[date] ?? 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const weeks: MonthDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}
