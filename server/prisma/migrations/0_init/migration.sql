-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "exam" (
    "exam_id" SERIAL NOT NULL,
    "exam_name" VARCHAR(150) NOT NULL,
    "exam_type" VARCHAR(100),
    "category" VARCHAR(50),
    "target_code" VARCHAR(50),
    "description" TEXT,
    "schedules" JSONB,
    "requirements" JSONB,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("exam_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(75) NOT NULL,
    "last_name" VARCHAR(75) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(30),
    "role" VARCHAR(20) NOT NULL DEFAULT 'candidate',
    "avatar_url" VARCHAR(500),
    "target_exam_id" INTEGER,
    "target_subject" VARCHAR(150),
    "knowledge_level" VARCHAR(50),
    "available_study_hours" DECIMAL(5,2),
    "daily_goal_minutes" INTEGER NOT NULL DEFAULT 30,
    "streak_days" INTEGER NOT NULL DEFAULT 0,
    "completed_questions" INTEGER NOT NULL DEFAULT 0,
    "average_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "study_hours_total" DECIMAL(7,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clerk_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "announcement_id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "publish_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" VARCHAR(50),
    "is_urgent" BOOLEAN NOT NULL DEFAULT false,
    "attachments" JSONB,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "announcement_id" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT,
    "category" VARCHAR(50),
    "action_url" VARCHAR(500),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "subject" (
    "subject_id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "subject_name" VARCHAR(150) NOT NULL,
    "description" TEXT,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "topic" (
    "topic_id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "topic_name" VARCHAR(150) NOT NULL,
    "description" TEXT,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "past_paper" (
    "paper_id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "year" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "session" VARCHAR(50),
    "file_url" VARCHAR(500),
    "file_size" VARCHAR(30),
    "has_answer_key" BOOLEAN NOT NULL DEFAULT false,
    "total_questions" INTEGER,
    "paper_type" VARCHAR(50) NOT NULL DEFAULT 'past-paper',

    CONSTRAINT "past_paper_pkey" PRIMARY KEY ("paper_id")
);

-- CreateTable
CREATE TABLE "question" (
    "question_id" SERIAL NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" VARCHAR(50) NOT NULL,
    "difficulty_level" VARCHAR(20),
    "correct_answer" TEXT,
    "explanation" TEXT,
    "reference_note" VARCHAR(255),

    CONSTRAINT "question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "answer_option" (
    "option_id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "option_text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "answer_option_pkey" PRIMARY KEY ("option_id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "quiz_id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "difficulty_level" VARCHAR(20),
    "duration_minutes" INTEGER,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("quiz_id")
);

-- CreateTable
CREATE TABLE "quiz_question" (
    "quiz_question_id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "question_order" INTEGER,

    CONSTRAINT "quiz_question_pkey" PRIMARY KEY ("quiz_question_id")
);

-- CreateTable
CREATE TABLE "flashcard_deck" (
    "deck_id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,

    CONSTRAINT "flashcard_deck_pkey" PRIMARY KEY ("deck_id")
);

-- CreateTable
CREATE TABLE "flashcard" (
    "flashcard_id" SERIAL NOT NULL,
    "deck_id" INTEGER NOT NULL,
    "category" VARCHAR(100),
    "front_text" TEXT NOT NULL,
    "back_text" TEXT NOT NULL,
    "hint" TEXT,
    "difficulty" VARCHAR(20),

    CONSTRAINT "flashcard_pkey" PRIMARY KEY ("flashcard_id")
);

-- CreateTable
CREATE TABLE "mock_exam" (
    "mock_exam_id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "year" INTEGER,
    "duration_minutes" INTEGER,
    "total_marks" DECIMAL(6,2),
    "passing_marks" DECIMAL(6,2),
    "instructions" JSONB,

    CONSTRAINT "mock_exam_pkey" PRIMARY KEY ("mock_exam_id")
);

-- CreateTable
CREATE TABLE "mock_exam_section" (
    "section_id" SERIAL NOT NULL,
    "mock_exam_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "number_of_questions" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "mock_exam_section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "mock_exam_question" (
    "mock_exam_question_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "question_order" INTEGER,

    CONSTRAINT "mock_exam_question_pkey" PRIMARY KEY ("mock_exam_question_id")
);

-- CreateTable
CREATE TABLE "attempt" (
    "attempt_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "attempt_type" VARCHAR(20) NOT NULL,
    "quiz_id" INTEGER,
    "mock_exam_id" INTEGER,
    "score" DECIMAL(6,2),
    "start_time" TIMESTAMP(6),
    "end_time" TIMESTAMP(6),

    CONSTRAINT "attempt_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateTable
CREATE TABLE "attempt_answer" (
    "answer_id" SERIAL NOT NULL,
    "attempt_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "selected_option_id" INTEGER,
    "is_correct" BOOLEAN,

    CONSTRAINT "attempt_answer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "progress_record" (
    "record_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "proficiency_score" DECIMAL(5,2),
    "last_updated" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_record_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "weak_area" (
    "weak_area_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "severity_level" VARCHAR(20),
    "accuracy_rate" DECIMAL(5,2),
    "priority" VARCHAR(20),
    "failed_questions_count" INTEGER NOT NULL DEFAULT 0,
    "recommendation" TEXT,
    "action_quiz_id" INTEGER,
    "action_read_topic_id" INTEGER,
    "identified_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weak_area_pkey" PRIMARY KEY ("weak_area_id")
);

-- CreateTable
CREATE TABLE "study_plan" (
    "plan_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" VARCHAR(30) NOT NULL DEFAULT 'active',
    "items" JSONB,

    CONSTRAINT "study_plan_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "mentor" (
    "mentor_id" SERIAL NOT NULL,
    "first_name" VARCHAR(75) NOT NULL,
    "last_name" VARCHAR(75) NOT NULL,
    "title" VARCHAR(150),
    "role_label" VARCHAR(150),
    "avatar_url" VARCHAR(500),
    "experience_years" INTEGER,
    "rating" DECIMAL(3,2),
    "reviews_count" INTEGER NOT NULL DEFAULT 0,
    "students_trained" INTEGER NOT NULL DEFAULT 0,
    "availability" VARCHAR(150),
    "bio" TEXT,
    "hourly_rate" VARCHAR(50),
    "social_telegram" VARCHAR(100),
    "subjects" JSONB,

    CONSTRAINT "mentor_pkey" PRIMARY KEY ("mentor_id")
);

-- CreateTable
CREATE TABLE "mentor_booking" (
    "booking_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "mentor_id" INTEGER NOT NULL,
    "session_date" DATE,
    "time_slot" VARCHAR(50),
    "note" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mentor_booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_subject_exam_name" ON "subject"("exam_id", "subject_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_topic_subject_name" ON "topic"("subject_id", "topic_name");

-- CreateIndex
CREATE UNIQUE INDEX "uq_answer_option_question" ON "answer_option"("option_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_quiz_question" ON "quiz_question"("quiz_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_flashcard_deck_subject_title" ON "flashcard_deck"("subject_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "uq_mock_exam_section" ON "mock_exam_section"("mock_exam_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_mock_exam_question" ON "mock_exam_question"("section_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_attempt_question" ON "attempt_answer"("attempt_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_progress_user_topic" ON "progress_record"("user_id", "topic_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_target_exam_id_fkey" FOREIGN KEY ("target_exam_id") REFERENCES "exam"("exam_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("exam_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcement"("announcement_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("exam_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "past_paper" ADD CONSTRAINT "past_paper_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option" ADD CONSTRAINT "answer_option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_question" ADD CONSTRAINT "quiz_question_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("quiz_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_question" ADD CONSTRAINT "quiz_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_deck" ADD CONSTRAINT "flashcard_deck_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard" ADD CONSTRAINT "flashcard_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "flashcard_deck"("deck_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_exam" ADD CONSTRAINT "mock_exam_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("exam_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_exam_section" ADD CONSTRAINT "mock_exam_section_mock_exam_id_fkey" FOREIGN KEY ("mock_exam_id") REFERENCES "mock_exam"("mock_exam_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_exam_section" ADD CONSTRAINT "mock_exam_section_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_exam_question" ADD CONSTRAINT "mock_exam_question_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "mock_exam_section"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_exam_question" ADD CONSTRAINT "mock_exam_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("quiz_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_mock_exam_id_fkey" FOREIGN KEY ("mock_exam_id") REFERENCES "mock_exam"("mock_exam_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "attempt"("attempt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answer" ADD CONSTRAINT "attempt_answer_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "answer_option"("option_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_record" ADD CONSTRAINT "progress_record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_record" ADD CONSTRAINT "progress_record_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weak_area" ADD CONSTRAINT "weak_area_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weak_area" ADD CONSTRAINT "weak_area_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weak_area" ADD CONSTRAINT "weak_area_action_quiz_id_fkey" FOREIGN KEY ("action_quiz_id") REFERENCES "quiz"("quiz_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weak_area" ADD CONSTRAINT "weak_area_action_read_topic_id_fkey" FOREIGN KEY ("action_read_topic_id") REFERENCES "topic"("topic_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan" ADD CONSTRAINT "study_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_booking" ADD CONSTRAINT "mentor_booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_booking" ADD CONSTRAINT "mentor_booking_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "mentor"("mentor_id") ON DELETE CASCADE ON UPDATE CASCADE;
