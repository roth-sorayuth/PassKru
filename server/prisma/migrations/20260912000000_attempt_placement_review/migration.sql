-- AI study plan: the placement test and the Saturday mistake review are stored
-- as attempts so their answers live in attempt_answer like every other score.
-- Neither belongs to a single quiz or mock exam, so both reference columns stay NULL.
-- Existing 'quiz' and 'mock_exam' rules are unchanged. Safe to run more than once.

ALTER TABLE "attempt" DROP CONSTRAINT IF EXISTS "chk_attempt_type";
ALTER TABLE "attempt" ADD CONSTRAINT "chk_attempt_type"
  CHECK ("attempt_type" IN ('quiz', 'mock_exam', 'placement', 'review'));

ALTER TABLE "attempt" DROP CONSTRAINT IF EXISTS "chk_attempt_type_reference";
ALTER TABLE "attempt" ADD CONSTRAINT "chk_attempt_type_reference"
  CHECK (
    ("attempt_type" = 'quiz' AND "quiz_id" IS NOT NULL AND "mock_exam_id" IS NULL)
    OR ("attempt_type" = 'mock_exam' AND "mock_exam_id" IS NOT NULL AND "quiz_id" IS NULL)
    OR ("attempt_type" IN ('placement', 'review') AND "quiz_id" IS NULL AND "mock_exam_id" IS NULL)
  );
