interface DateRangeEntry {
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
}

interface SingleDateEntry {
  date_awarded?: string | null;
}

const toTime = (dateStr?: string | null): number => {
  if (!dateStr) return -Infinity;
  const time = new Date(dateStr).getTime();
  return Number.isNaN(time) ? -Infinity : time;
};

const dateRangeSortKey = (item: DateRangeEntry): number => {
  if (item.is_current) return Infinity;
  return toTime(item.end_date ?? item.start_date);
};

export function sortByDateRangeDesc<T extends DateRangeEntry>(items: T[]): T[] {
  return [...items].sort((a, b) => dateRangeSortKey(b) - dateRangeSortKey(a));
}

export function sortBySingleDateDesc<T extends SingleDateEntry>(items: T[]): T[] {
  return [...items].sort((a, b) => toTime(b.date_awarded) - toTime(a.date_awarded));
}

export function isDateRangeValid(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return true;
  return new Date(startDate).getTime() <= new Date(endDate).getTime();
}

export function formatMonthYear(dateStr?: string | null): string {
  if (!dateStr) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (!match) return dateStr;
  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  isCurrent: boolean,
): string {
  const start = formatMonthYear(startDate) || '—';
  const end = isCurrent ? 'Present' : formatMonthYear(endDate) || '—';
  return `${start} - ${end}`;
}
