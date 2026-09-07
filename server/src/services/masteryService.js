/**
 * The single source of truth for "how well does this candidate know this
 * topic?" — the Topic Mastery node of the learning loop.
 *
 * This exists because the same question previously had three different
 * answers in three files: weak areas flagged below 70 (single-attempt
 * accuracy), the dashboard counted a topic mastered at 70 (blended
 * proficiency), and the course generator skipped a topic at 80 (blended
 * proficiency). So a topic could be simultaneously "mastered" on the
 * dashboard and "still to teach" in the course, and 70-79 was a band no rule
 * named at all. Every threshold decision in the app now routes through here.
 */

/**
 * Below this accuracy on a topic, it is flagged as a weak area.
 *
 * Kept at 70 to match the boundary the app already shipped with, so existing
 * WeakArea rows stay consistent with newly written ones.
 */
export const WEAK_AREA_THRESHOLD = 70;

/** Proficiency at or above which a topic counts as strong (not a weak area). */
export const PROFICIENT_THRESHOLD = 70;

/**
 * Proficiency at or above which a topic is considered mastered and can be
 * skipped in the course.
 *
 * Raised from the generator's old 80 and paired with MIN_ATTEMPTS_FOR_MASTERY
 * below: proficiency is a blend of past and present (see
 * scoringService.computeProficiency), so a single lucky quiz could clear 80
 * on its own and permanently drop a topic the candidate had seen exactly
 * once. Mastery should require evidence, not one good day.
 */
export const MASTERED_THRESHOLD = 85;

/** A topic needs this many graded attempts before mastery can be claimed. */
export const MIN_ATTEMPTS_FOR_MASTERY = 2;

/** Boundary between `learning` and `developing`. Both are weak. */
export const DEVELOPING_THRESHOLD = 55;

/**
 * Mastery states, weakest first. `untouched` is distinct from `learning`:
 * a topic with no attempt yet isn't weak, it's simply unmeasured, and the
 * course should treat those differently (teach vs. re-teach).
 */
export const MASTERY_STATES = ["untouched", "learning", "developing", "proficient", "mastered"];

/** Which side of the loop's Strong/Weak fork each state falls on. */
const BRANCH_BY_STATE = {
  untouched: "unknown",
  learning: "weak",
  developing: "weak",
  proficient: "strong",
  mastered: "strong",
};

/**
 * Derives a topic's mastery state.
 *
 * `attemptCount` is how many graded attempts have touched this topic. It is
 * optional so existing callers that only hold a proficiency score keep
 * working — but without it, mastery is capped at `proficient`, because
 * mastery is a claim about consistency and a single number can't evidence it.
 */
export function resolveMasteryState(proficiencyScore, attemptCount = null) {
  if (proficiencyScore === null || proficiencyScore === undefined) return "untouched";

  const score = Number(proficiencyScore);
  if (!Number.isFinite(score)) return "untouched";

  if (score >= MASTERED_THRESHOLD) {
    // Unknown attempt count is treated as insufficient evidence rather than
    // assumed sufficient — the conservative direction, since the cost of a
    // false "mastered" is skipped teaching the candidate actually needed.
    if (attemptCount === null || attemptCount === undefined) return "proficient";
    return attemptCount >= MIN_ATTEMPTS_FOR_MASTERY ? "mastered" : "proficient";
  }
  if (score >= PROFICIENT_THRESHOLD) return "proficient";
  if (score >= DEVELOPING_THRESHOLD) return "developing";
  return "learning";
}

/** "strong" | "weak" | "unknown" — the loop's fork, for a given state. */
export function branchForState(state) {
  return BRANCH_BY_STATE[state] ?? "unknown";
}

/** Convenience: does this state sit on the Strong side of the fork? */
export function isStrong(state) {
  return branchForState(state) === "strong";
}

/** Convenience: does this state sit on the Weak side of the fork? */
export function isWeak(state) {
  return branchForState(state) === "weak";
}

/**
 * Whether a topic has enough demonstrated mastery for the course generator to
 * skip teaching it. Deliberately stricter than `isStrong` — `proficient` is
 * good enough to stop nagging about, not good enough to stop covering.
 */
export function canSkipInCourse(proficiencyScore, attemptCount = null) {
  return resolveMasteryState(proficiencyScore, attemptCount) === "mastered";
}

/**
 * Full mastery descriptor for one topic, as the API returns it to the client.
 * Bilingual labels live here rather than in each surface so a topic reads the
 * same on the quiz result screen, the course page and the dashboard.
 */
const STATE_LABELS = {
  untouched: { en: "Not started", km: "មិនទាន់ចាប់ផ្តើម" },
  learning: { en: "Learning", km: "កំពុងរៀន" },
  developing: { en: "Developing", km: "កំពុងរីកចម្រើន" },
  proficient: { en: "Proficient", km: "ស្ទាត់ជំនាញ" },
  mastered: { en: "Mastered", km: "ជំនាញពេញលេញ" },
};

export function describeMastery(proficiencyScore, attemptCount = null) {
  const state = resolveMasteryState(proficiencyScore, attemptCount);
  return {
    state,
    branch: branchForState(state),
    label: STATE_LABELS[state].en,
    labelKm: STATE_LABELS[state].km,
    proficiency:
      proficiencyScore === null || proficiencyScore === undefined ? null : Math.round(Number(proficiencyScore)),
    attemptCount: attemptCount ?? null,
  };
}
