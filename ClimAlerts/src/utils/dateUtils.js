/**
 * Shared date utilities for ClimAlerts
 * All dates are computed relative to the current time.
 */

const FMT_DATETIME = {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
};

const FMT_DATE = {
  month: 'short', day: 'numeric', year: 'numeric',
};

const FMT_DATE_SHORT = {
  month: 'short', day: 'numeric',
};

/** Format a Date object as "Jun 12, 2026 08:30 AM" */
export const fmtDateTime = (d) =>
  d.toLocaleString('en-US', FMT_DATETIME);

/** Format a Date object as "Jun 12, 2026" */
export const fmtDate = (d) =>
  d.toLocaleDateString('en-US', FMT_DATE);

/** Format a Date object as "Jun 12" */
export const fmtDateShort = (d) =>
  d.toLocaleDateString('en-US', FMT_DATE_SHORT);

/** Return a Date that is `hours` hours before now */
export const hoursAgo = (hours) => {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
};

/** Return a Date that is `days` days before now */
export const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

/** Return a Date that is `mins` minutes before now */
export const minutesAgo = (mins) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - mins);
  return d;
};

/** Current date/time formatted as "Jun 12, 2026 08:30 AM" */
export const nowDateTime = () => fmtDateTime(new Date());

/** Current date formatted as "Jun 12, 2026" */
export const nowDate = () => fmtDate(new Date());

/** "Jun 5 - Jun 12, 2026" — a date range ending today */
export const dateRange = (daysBack) => {
  const end = new Date();
  const start = daysAgo(daysBack);
  if (start.getFullYear() === end.getFullYear()) {
    return `${fmtDateShort(start)} - ${fmtDate(end)}`;
  }
  return `${fmtDate(start)} - ${fmtDate(end)}`;
};

/** Generate last N day labels like ["Jun 6", "Jun 7", ...] */
export const lastNDayLabels = (n) => {
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    labels.push(fmtDateShort(daysAgo(i)));
  }
  return labels;
};
