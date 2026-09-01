/**
 * Calculate remaining days, hours, and minutes until target date
 * @param {Date|string} targetDate 
 * @returns {{ days: number, hours: number, minutes: number }}
 */
export const calculateCountdown = (targetDate) => {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};

/**
 * Get active day indices for the current week based on date array
 * Sunday = 0, Monday = 1, ..., Saturday = 6
 * @param {Date[]|string[]} dates
 * @returns {number[]} array of unique day indices in the current week [0, 1, 2, ...]
 */
export const getActiveDayIndicesThisWeek = (dates) => {
  if (!dates || !dates.length) return [];

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const activeIndices = new Set();

  for (const d of dates) {
    if (!d) continue;
    const dateObj = new Date(d);
    if (dateObj >= startOfWeek && dateObj <= endOfWeek) {
      activeIndices.add(dateObj.getDay());
    }
  }

  return Array.from(activeIndices).sort((a, b) => a - b);
};
