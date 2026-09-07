-- Adaptive learning loop: topic-scoped quizzes, mastery evidence, and
-- re-testable weak areas.

-- Quiz: a quiz may now cover exactly one topic, and may be generated on
-- demand for a single candidate's review session.
ALTER TABLE "quiz" ADD COLUMN "topic_id" INTEGER;
ALTER TABLE "quiz" ADD COLUMN "generated_for_user_id" INTEGER;
ALTER TABLE "quiz" ADD COLUMN "is_adaptive" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "quiz" ADD CONSTRAINT "quiz_topic_id_fkey"
  FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_generated_for_user_id_fkey"
  FOREIGN KEY ("generated_for_user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "idx_quiz_topic_owner" ON "quiz"("topic_id", "generated_for_user_id");

-- ProgressRecord: mastery needs repeated evidence, so track how many graded
-- attempts have covered a topic plus the most recent attempt's accuracy.
ALTER TABLE "progress_record" ADD COLUMN "attempts_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "progress_record" ADD COLUMN "last_accuracy" DECIMAL(5,2);

-- Existing rows predate attempt counting. They were written by at least one
-- graded attempt each (that is the only thing that creates them), so seed
-- them at 1 rather than 0 — 0 would read as "never attempted" and wrongly
-- demote every already-strong topic out of mastery.
UPDATE "progress_record" SET "attempts_count" = 1 WHERE "attempts_count" = 0;

-- WeakArea: keep resolved gaps instead of deleting them, so they can be
-- re-tested later.
ALTER TABLE "weak_area" ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'open';
ALTER TABLE "weak_area" ADD COLUMN "resolved_at" TIMESTAMP(6);
ALTER TABLE "weak_area" ADD COLUMN "next_review_at" TIMESTAMP(6);

CREATE INDEX "idx_weak_area_user_status" ON "weak_area"("user_id", "status");
