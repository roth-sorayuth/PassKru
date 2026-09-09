import rawQuizData from './quizData.json';
import { Quiz, Question, ExamTarget } from '../types';

export interface RawQuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface RawQuizQuestion {
  questionID: number;
  topicId: number;
  examName: string;
  subjectName: string;
  questionText: string;
  questionType: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  correctAnswer: string;
  explanation: string;
  referenceNote?: string;
  options: RawQuizOption[];
}

const typedQuestions = rawQuizData as RawQuizQuestion[];

const ALL_3_CATEGORIES: ExamTarget[] = ['nie', 'rttc', 'pttc'];

/**
 * 10 English Quiz sets created directly from quizData.json (50 questions per set).
 * The questions in quizData.json are pre-randomized and partitioned so that every set
 * contains easy, medium, and hard difficulty levels.
 */
export const englishQuizzes: Quiz[] = Array.from({ length: 10 }).map((_, idx) => {
  const setNumber = idx + 1;
  const startIndex = idx * 50;
  const questionsSlice = typedQuestions.slice(startIndex, startIndex + 50);

  const mappedQuestions: Question[] = questionsSlice.map((q) => {
    const correctIndex = q.options.findIndex((opt) => opt.isCorrect);
    const correctLetter = String.fromCharCode(65 + (correctIndex >= 0 ? correctIndex : 0));

    return {
      id: `q-eng-${q.questionID}`,
      subject: 'English',
      subjectKm: 'ភាសាអង់គ្លេស',
      topic: q.referenceNote || 'English Proficiency Assessment',
      topicKm: q.referenceNote || 'កម្រងតេស្តសមត្ថភាពភាសាអង់គ្លេស',
      difficulty: q.difficultyLevel,
      question: {
        km: q.questionText,
        en: q.questionText,
      },
      options: q.options.map((opt, oIdx) => ({
        id: String.fromCharCode(65 + oIdx),
        text: {
          km: opt.text,
          en: opt.text,
        },
      })),
      correctAnswerId: correctLetter,
      explanation: {
        km: q.explanation,
        en: q.explanation,
      },
      reference: q.referenceNote,
    };
  });

  return {
    id: `quiz-eng-set-${setNumber.toString().padStart(2, '0')}`,
    title: {
      km: `កម្រងសំណួរភាសាអង់គ្លេស ឈុតទី ${setNumber}`,
      en: `English Quiz Set ${setNumber}`,
    },
    subject: 'English',
    subjectKm: 'ភាសាអង់គ្លេស',
    topic: `General English Competency Check - Set ${setNumber}`,
    topicKm: `កម្រងតេស្តសមត្ថភាពភាសាអង់គ្លេសទូទៅ ឈុតទី ${setNumber}`,
    targetExam: ALL_3_CATEGORIES,
    questionsCount: mappedQuestions.length,
    durationMinutes: 50,
    difficulty: 'medium',
    questions: mappedQuestions,
  };
});
