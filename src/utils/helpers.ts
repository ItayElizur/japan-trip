import { TRAVEL, MONTH_NAMES } from '../data/constants';

export function travelTime(r1: string, r2: string): number | null {
  if (!r1 || !r2) return null;
  const k = [r1, r2].sort().join(":");
  return TRAVEL[k] ?? null;
}

export function fmtMins(m: number | null): string | null {
  if (!m) return null;
  if (m < 60) return `${m} דק'`;
  const h = Math.floor(m / 60), mn = m % 60;
  return mn ? `${h}ש' ${mn}דק'` : `${h} שעות`;
}

export function heDate(d: string): string {
  const dt = new Date(d);
  return `${dt.getDate()}/${dt.getMonth() + 1}`;
}

export function heDay(d: string): string {
  return ["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"][new Date(d).getDay()];
}

export function fmtDateHe(d: string): string {
  const [y, m, day] = d.split('-').map(Number);
  return `${day} ב${MONTH_NAMES[m]} ${y}`;
}
