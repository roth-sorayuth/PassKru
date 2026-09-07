# Adaptive Learning Loop — Implemented

Closing the loop the flow diagram describes:

```
Exam Track → Required Subjects → Study Path → Study → Quiz → Quiz Performance
  → Topic Mastery → { Strong → Continue | Weak → Review → Study Path → Quiz }
```

> [!IMPORTANT]
> **Phases 1–3 are implemented.** One manual step remains before the app will
> run against a real database:
>
> ```bash
> cd server && npx prisma migrate deploy
> ```
>
> The migration is `prisma/migrations/20260907000000_adaptive_learning_loop/`.
> It is additive only — new nullable/defaulted columns, no drops — and it
> backfills `progress_record.attempts_count` to 1 for existing rows so
> already-strong topics are not demoted out of mastery.

## Status

| Phase | Scope | State |
| --- | --- | --- |
| 1 | `masteryService`, threshold consolidation, review injection, result-screen mastery panel | Done |
| 2 | `Quiz.topicId`, `buildTopicQuiz`, topic-first quiz resolution | Done |
| 3 | Mastery evidence columns, spaced re-test, dashboard mastery card, pacing | Done |

**Verified:** 41 assertions pass across mastery/scoring rules and review
placement; server module graph imports cleanly; client typechecks and builds.
Not verified against a live database — no `DATABASE_URL` in this environment,
so the end-to-end run in §7 is still yours to do after the migration.

---

## 1. What already exists

| Node | Status | Where |
| --- | --- | --- |
| Exam Track | Done | Wizard step 1 → `Exam.targetCode` |
| Required Subjects | Done | `config/examSubjects.js`, `User.targetSubjects[]` |
| Study Path | Done | `StudyPlan.items.days[].tasks[]` (`studyPlanService.js`) |
| Study | Done | `read` task → `targetAction: "learning"` |
| Quiz | **Partial** | Quizzes are *subject*-level and admin-authored |
| Quiz Performance | Done | `scoringService.gradeSubmission` → `topicStats` |
| Topic Mastery | **Partial** | `ProgressRecord.proficiencyScore` exists; never shown to the user |
| Strong → Continue | **Partial** | Only implicit, via `rankNextUp` ordering |
| Weak → Review | **Partial** | `WeakArea` rows are written, but no review work is created |
| Review → Study Path | **Missing** | Requires a manual "Generate & Save" regenerate |

## 2. The five real gaps

**G1 — The loop never closes on its own.** `rankNextUp` only *reorders* tasks
that are already in the plan. If every task for a topic is already completed, a
newly-flagged weak area produces no work at all. The candidate has to
regenerate the whole course by hand.

**G2 — Quiz granularity does not match mastery granularity.** Mastery and
`WeakArea` are per-**topic**; `Quiz` is per-**subject**. `attachRealContent`
picks a subject quiz round-robin for a task titled `Practice Quiz: {topicName}`,
so the quiz often does not cover that topic — and its results then pollute
`topicStats` for unrelated topics. A genuine "review this topic" quiz cannot be
built today.

**G3 — Mastery is invisible.** The result screen shows a score and a
per-question review. `topicStats` and `proficiencyUpdates` come back in the
submit response and are thrown away. The Strong/Weak branch never appears in
the UI, so the candidate never sees the decision the system made for them.

**G4 — Two competing thresholds.** `WEAK_AREA_THRESHOLD = 70` (single-attempt
accuracy) flags weakness; `MASTERY_SKIP_THRESHOLD = 80` (blended proficiency)
skips content. Different inputs, different scales, and 70–79 is unnamed limbo.
80 on one lucky quiz is enough to skip a topic permanently.

**G5 — A fixed weak area is deleted, never re-tested.**
`refreshWeakAreasFromAttempt` deletes the row on recovery. Nothing verifies the
fix stuck by exam day.

## 3. Proposed changes

### 3.1 One mastery state machine (`server/src/services/masteryService.js`) — NEW

Single source of truth for the Strong/Weak branch, replacing both scattered
constants:

| State | Rule | Branch |
| --- | --- | --- |
| `untouched` | no attempt | — |
| `learning` | proficiency < 55 | Weak |
| `developing` | 55–69 | Weak |
| `proficient` | 70–84 | Strong |
| `mastered` | ≥ 85 **and** ≥ 2 attempts | Strong (skippable) |

The attempt-count floor is the point: one good quiz should not mint mastery.

### 3.2 Close the loop on submit (`attemptService.submitAttempt`) — MODIFY

After `refreshWeakAreasFromAttempt`, call a new
`studyPlanService.applyLoopToActivePlan(userId, topicStats)`:

* **Weak topic** → inject a review block into the active plan: a `read` task
  (revisit) plus a `quiz` task (retest *the same topic*), tagged
  `origin: "review"`, `reviewOfTopicId`, `sourceAttemptId`.
* **Newly mastered topic** → mark its remaining *unstarted* tasks
  `skipped: true, skipReason: "mastered"` so the path shortens instead of
  re-teaching known material.
* Dedupe by `reviewOfTopicId`, cap injected tasks per day, and give injected
  tasks collision-proof ids (`d{n}-r{topicId}-{seq}`) — the current
  `d{n}-t{i}` scheme collides on insert and would break `setTaskCompletion`.

**Placement (recommended):** append to the next *incomplete* day when its
remaining minutes fit inside `dailyGoalMinutes`; otherwise insert a dedicated
review day after it. Appending to the end of the plan is simpler but delivers
the review weeks after the failure, which defeats the point.

### 3.3 Topic-scoped quizzes — the unblocker for G2

**Schema:** add `Quiz.topicId Int?`, `Quiz.generatedForUserId Int?`,
`Quiz.isAdaptive Boolean @default(false)`.

**Service:** `quizService.buildTopicQuiz({ userId, topicId, count, difficulty })`
pulls `Question` rows by topic and persists a lightweight `Quiz` row. Because it
produces a real quiz, the entire existing attempt → grade → proficiency →
weak-area pipeline works unchanged.

**Generator:** `attachRealContent` resolves `task.quizId` by *topic* first,
subject second — fixing the existing mismatch between task title and quiz
content, independent of the review loop.

### 3.4 Surface the branch (`client/src/components/pages/QuizPage.tsx`) — MODIFY

Add a **Topic Mastery** panel to the result stage, rendered from data the submit
response already returns:

* per topic: accuracy this attempt, proficiency before → after, state chip;
* the diagram's fork as two explicit CTAs — **Continue** (strong) and
  **Review this topic** (weak);
* a line confirming what changed: "2 review sessions added to your study path."

Requires extending the submit response with `masteryChanges` and `planUpdates`.

### 3.5 Study path affordances (`StudyPlanPage.tsx`) — MODIFY

Badge injected tasks ("Review — added after your {date} quiz") and render
mastery-skipped tasks as struck-through rather than hiding them, so the path
visibly reacts to performance.

### 3.6 Spaced re-test (phase 3)

Keep recovered weak areas with `status: "resolved"` and `nextReviewAt = +7d`
instead of deleting, and let the generator inject a light retest when due.

## 4. Phasing

1. **Phase 1 — no migration.** `masteryService` + threshold consolidation +
   review-task injection + result-screen mastery panel. Closes the loop using
   existing subject quizzes.
2. **Phase 2 — migration.** `Quiz.topicId` + `buildTopicQuiz` + topic-first
   resolution. Makes "Review" actually target the weak topic.
3. **Phase 3 — migration.** `ProgressRecord` mastery columns, spaced re-test,
   mastery breakdown on the dashboard.

## 5. Known risk

`completeMatchingCourseTask` closes the **first** incomplete task matching
`attempt.quizId`. Once review tasks reuse quiz ids, an unrelated sitting can
close a review task. Fix by threading the launching `taskId` through
start/submit rather than matching on `quizId`.

## 6. Decisions taken

These were the open questions. Each was resolved as below; all are cheap to
change if you disagree.

1. **Review placement** → the earliest open day with room in the daily budget.
   When every open day is full, the review goes on the earliest open day
   anyway and that day runs over (flagged `overBudget`).
   *Inserting a dedicated day mid-course was tried and reverted*: plan days are
   keyed by date on the client and dated one per day, so a day inserted
   between two existing ones necessarily duplicates the next day's date and
   `dayIndex` — which breaks day lookup and renders two rows for the same day.
   Overshooting one day's minutes is a far smaller cost than a corrupted
   course structure. Appending past the end is collision-free, so a
   fully-completed course still gets a dedicated review day.
2. **Topic quizzes** → generated on demand from the question bank
   (`quizService.buildTopicQuiz`), so the loop never waits on content work.
   A recent unsat generated quiz for the same topic is reused rather than
   minting a new row per failure.
3. **Mastered topics** → auto-skipped, but rendered struck-through with an
   "Already mastered" badge. Silent removal is what makes adaptive systems
   feel broken.
4. **Thresholds** → 70 proficient / 85 + 2 attempts mastered. The attempt
   floor is the substantive part: proficiency is a blend, so a single lucky
   quiz could clear the old bar of 80 and drop a topic seen exactly once.
5. **Mock exams** → they update mastery and weak areas, but do **not** inject
   review tasks. A single mock touches dozens of topics and would bury the
   course.

## 6b. Trade-offs worth knowing

* **One day can exceed its minute budget** when review lands on a full day
  (decision 1). The plan does not currently reflow later days to compensate.
* **Generated review quizzes accumulate** one row per topic per candidate.
  They are excluded from the catalogue and reused while unsat, but nothing
  prunes them yet.
* **Re-test cadence is a fixed 7 days**, not spaced by how badly the topic
  went or how long ago it was fixed.
* **Mastery has no history.** `ProgressRecord` holds only the current value,
  so a mastery-over-time chart still needs a snapshot table.

## 7. Verification plan

1. Quiz a topic below 70 → confirm a `WeakArea` row **and** a review block
   appear in the active plan without regenerating.
2. Re-quiz the same topic above 70 → weak area clears, no duplicate review
   block is injected.
3. Score ≥ 85 twice → remaining tasks for that topic show as mastery-skipped.
4. Toggle an injected review task → `setTaskCompletion` resolves it by id (no
   collision with generated task ids).
5. Launch a review quiz → its questions all belong to the flagged topic.

---

# 8. Feature checklist per surface

Everything below is scoped to making the loop visible and self-closing. Marked
**[gap]** where nothing exists today, **[fix]** where something exists but
misreports, **[have]** where it is already built.

## 8.1 Study Plan

| # | Feature | Why |
| --- | --- | --- |
| 1 | Day-by-day path, task toggle, Next Up, smart regenerate | **[have]** |
| 2 | Generation-time mastery gating | **[have]** — but only at generation |
| 3 | **Injected review blocks, labelled with their origin** — "Added after your 12 Sep quiz on Fractions" | **[gap]** The loop's closing edge. Without the label the path looks like it changed at random |
| 4 | **Mastery-skipped tasks shown struck-through, not hidden** | **[gap]** Proof the path reacted; hiding them reads as data loss |
| 5 | **Per-task mastery chip** (Strong / Weak / Untouched on the task's topic) | **[gap]** Puts the Topic Mastery node on the path itself |
| 6 | **"Why is this here?" reason per task** — syllabus / weak area / review / retest | **[gap]** The path is currently opaque; the candidate cannot see the system reasoning |
| 7 | **Progress by topics mastered, not tasks completed** | **[fix]** Today's percent measures effort, not learning — 100% of tasks ticked can coexist with several weak topics |
| 8 | **Today view** — one obvious "do this next" above the day list | **[gap]** Loop needs a single entry point, not a calendar to scan |
| 9 | **Missed-day catch-up** — reflow or roll forward overdue days | **[gap]** Dates are fixed at generation, so three missed days leave a wall of red |

## 8.2 Quiz

| # | Feature | Why |
| --- | --- | --- |
| 1 | Lobby, timer, submit, score, per-question review with explanations, retake | **[have]** |
| 2 | **Topic Mastery panel on the result screen** — per topic: this attempt's accuracy, proficiency before → after, state chip | **[gap]** `topicStats` and `proficiencyUpdates` already come back in the submit response and are discarded |
| 3 | **The fork as two CTAs — Continue path / Review this topic** | **[gap]** This is the diagram's branch; it currently has no UI anywhere |
| 4 | **"What changed" receipt** — weak areas flagged/cleared, review tasks added, course task ticked off | **[gap]** `weakAreaChanges` and `completedTask` are already returned and unused |
| 5 | **Topic-scoped review quizzes** | **[gap]** Needs `Quiz.topicId` (§3.3). Until then "Review this topic" cannot honestly target the topic |
| 6 | **Wrong-answers-only retry** | **[gap]** `AttemptAnswer.isCorrect` already stores exactly this set |
| 7 | **Quiz knows which task launched it** (`sourceTaskId`) | **[fix]** Removes the §5 risk of closing the wrong course task |
| 8 | **Difficulty adaptation** — pick harder questions as mastery rises | **[gap]** `Question.difficultyLevel` exists and is never used in selection |

## 8.3 Dashboard

| # | Feature | Why |
| --- | --- | --- |
| 1 | Countdown, readiness, subject donuts, AI insight, streak, resource usage, study-time split, next module, recent attempts | **[have]** |
| 2 | **Topic Mastery breakdown** — untouched / learning / proficient / mastered per subject | **[gap]** The Topic Mastery node has no home in the UI at all |
| 3 | **Strong vs Weak panel with direct actions** | **[gap]** Weak areas are listed; the Strong half is never shown, so the branch looks one-sided |
| 4 | ~~Subject donuts should read mastery~~ | **[have]** Correction: they already count topics at or above the mastery threshold, not tasks |
| 5 | ~~Readiness should include mastery coverage~~ | **[have]** Correction: `avgScore * 0.7 + masteryCoverage * 0.3` already blends both. It inherits the wrong threshold, which §8.4 fixes |
| 6 | **Mastery trend over time** | **[gap]** `ProgressRecord` stores only the current value, no history — needs a snapshot row or derivation from attempts |
| 7 | **Loop activity feed** — what the system did: flagged, cleared, injected, skipped | **[gap]** Makes the adaptation legible instead of silent |
| 8 | **Pacing check** — topics remaining vs days to exam | **[gap]** The countdown exists but is not compared against remaining syllabus |

## 8.4 Cross-cutting

* **One mastery vocabulary everywhere.** A topic must show the same state on
  all three surfaces, from one shared `masteryService` + one shared chip
  component.
* **Third threshold found.** `progressService.MASTERED_THRESHOLD = 70` (aliased
  to `WEAK_AREA_THRESHOLD`) contradicts `studyPlanService.MASTERY_SKIP_THRESHOLD = 80`.
  So "mastered" currently means 70 on the dashboard and 80 in the generator.
  This strengthens **G4** — consolidation is a prerequisite, not a nice-to-have.
