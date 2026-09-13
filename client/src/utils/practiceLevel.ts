// The practice page's level filter: a browsing choice kept for the browser
// session, separate from the level saved on the profile. The quiz page reads it
// so a subject opened from practice is listed and scored under that level.
import type { ExamTarget } from '../types';

export const PRACTICE_LEVEL_KEY = 'passkru_practice_level';

export const isPracticeLevel = (value: unknown): value is ExamTarget =>
  value === 'nie' || value === 'rttc' || value === 'pttc';

export const readPracticeLevel = (): ExamTarget | null => {
  try {
    const saved = sessionStorage.getItem(PRACTICE_LEVEL_KEY);
    return isPracticeLevel(saved) ? saved : null;
  } catch {
    return null;
  }
};

export const writePracticeLevel = (level: ExamTarget) => {
  try {
    sessionStorage.setItem(PRACTICE_LEVEL_KEY, level);
  } catch {}
};
