// src/lib/date.ts

export function calculateActiveDay(
  startDate: Date,
  totalDays: number
) {
  const now = new Date();

  // Normalize both to local midnight
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  const activeDay = diffDays + 1;

  if (activeDay < 1) return 0;
  if (activeDay > totalDays) return totalDays + 1;

  return activeDay;
}