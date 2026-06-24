/**
 * Returns today's date as an ISO date string (YYYY-MM-DD) in local time.
 * Avoids timezone pitfalls that occur when using toISOString() which returns UTC.
 */
export function todayISO(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Parses an ISO date string (YYYY-MM-DD) into a Date at midnight local time.
 * Using "T00:00:00" avoids the UTC-midnight pitfall of `new Date("YYYY-MM-DD")`.
 */
export function parseLocalDate(isoDate: string): Date {
  return new Date(isoDate + "T00:00:00");
}
