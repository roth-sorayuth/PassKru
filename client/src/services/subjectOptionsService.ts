import { api } from '../utils/api';
import { ExamTarget } from '../types';

/**
 * Subject-selection rules for the Study Plan wizard.
 *
 * The rules (which subjects exist, and whether a track is a single major, a
 * predefined dual-major pairing, or a generalist track with no choice at all)
 * live server-side in `server/src/config/examSubjects.js` and are served over
 * `GET /api/study-plan/subject-options`. Correcting the catalogue against the
 * official MoEYS circular therefore never requires a UI change — the wizard
 * renders whatever shape it is handed.
 */

/** One selectable subject. `key` is the stable identifier that gets persisted. */
export interface SubjectOption {
  key: string;
  km: string;
  en: string;
  aliases?: string[];
}

/** One predefined RTTC dual-major pairing, e.g. `math+physics`. */
export interface SubjectPairOption {
  id: string;
  subjects: SubjectOption[];
}

/** Pick exactly one major (NIE). */
export interface SingleSubjectOptions {
  selectionMode: 'single';
  requiredCount: number;
  subjects: SubjectOption[];
}

/** Pick exactly one predefined pairing — not any two subjects (RTTC). */
export interface PairSubjectOptions {
  selectionMode: 'pair';
  requiredCount: number;
  pairs: SubjectPairOption[];
}

/** Generalist track — nothing to pick, the wizard step is skipped (PTTC / kindergarten). */
export interface NoSubjectOptions {
  selectionMode: 'none';
  requiredCount: number;
  defaultSubjects: SubjectOption[];
}

export type SubjectOptions = SingleSubjectOptions | PairSubjectOptions | NoSubjectOptions;

export interface SubjectOptionsResponse {
  success: boolean;
  targetExam: string;
  options: SubjectOptions;
}

/**
 * Fetches the subject-selection rules for one exam track.
 * Throws with `statusCode === 404` when the exam code has no rules configured —
 * callers should treat that as "no subject step" rather than a hard failure.
 */
export const getSubjectOptions = (
  targetExam: ExamTarget | string
): Promise<SubjectOptionsResponse> =>
  api(`/study-plan/subject-options?targetExam=${encodeURIComponent(targetExam)}`);

/** Flattens any options shape into a key → label lookup for summaries. */
export const flattenSubjectOptions = (options: SubjectOptions | null): SubjectOption[] => {
  if (!options) return [];
  if (options.selectionMode === 'single') return options.subjects || [];
  if (options.selectionMode === 'pair')
    return (options.pairs || []).flatMap((pair) => pair.subjects || []);
  return options.defaultSubjects || [];
};

/** Order-insensitive comparison of a pairing against the selected keys. */
export const pairMatchesKeys = (pair: SubjectPairOption, keys: string[]): boolean => {
  const pairKeys = (pair.subjects || []).map((s) => s.key).sort();
  const selected = [...keys].sort();
  return pairKeys.length === selected.length && pairKeys.every((k, i) => k === selected[i]);
};

/**
 * True when `keys` is a complete, still-valid selection for these options.
 * Used to drop a stale choice when the candidate switches exam track — an NIE
 * single major is not a valid RTTC pairing.
 */
export const isSubjectSelectionValid = (
  options: SubjectOptions | null,
  keys: string[]
): boolean => {
  if (!options) return false;
  if (options.selectionMode === 'none') return true;
  if (options.selectionMode === 'single')
    return keys.length === 1 && (options.subjects || []).some((s) => s.key === keys[0]);
  if (options.selectionMode === 'pair')
    return keys.length === 2 && (options.pairs || []).some((p) => pairMatchesKeys(p, keys));
  return false;
};
