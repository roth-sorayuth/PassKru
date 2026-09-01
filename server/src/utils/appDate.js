/**
 * Calendar-day helpers for user-facing stats (streaks, activity strips).
 *
 * A streak is only meaningful against the candidate's own calendar day, so
 * days are bucketed against a fixed app offset (Cambodia, UTC+7) rather than
 * whatever timezone the server happens to run in. Override with the
 * APP_UTC_OFFSET_MINUTES env var if the app is ever hosted for another region.
 */

const DEFAULT_UTC_OFFSET_MINUTES = 420; // UTC+7 — Cambodia

function offsetMinutes() {
  const raw = Number(process.env.APP_UTC_OFFSET_MINUTES);
  return Number.isFinite(raw) ? raw : DEFAULT_UTC_OFFSET_MINUTES;
}

/** Format an instant as its YYYY-MM-DD calendar day in the app timezone. */
export function toAppDateString(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return null;
  return new Date(date.getTime() + offsetMinutes() * 60000).toISOString().slice(0, 10);
}

/** Today's YYYY-MM-DD in the app timezone. */
export function appTodayString() {
  return toAppDateString(new Date());
}

/** Shift a YYYY-MM-DD string by whole days, staying on the app calendar. */
export function shiftAppDateString(dateStr, days) {
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (isNaN(date.getTime())) return dateStr;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
