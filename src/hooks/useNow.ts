import { useEffect, useState } from "react";

/**
 * Returns a Date that updates every 30 seconds.
 * Used to keep countdown timers current without excessive re-renders.
 */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}
