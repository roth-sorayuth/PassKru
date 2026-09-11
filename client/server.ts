import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { getDatabase, formatQuestionOutput, StoredQuestionRow } from './server/database';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite database instance on startup
const db = getDatabase();

// --------------------------------------------------------------------------
// MANUAL QUESTION EXPLANATION & MANAGEMENT API (NO AI - STORED IN DATABASE)
// --------------------------------------------------------------------------

/**
 * GET /api/questions
 * Returns list of questions with their stored manual explanations.
 * Supports optional filters: subject, topic, difficulty, search.
 */
app.get('/api/questions', (req, res) => {
  try {
    const { subject, topic, difficulty, search } = req.query;
    let query = 'SELECT * FROM questions WHERE 1=1';
    const params: any[] = [];

    if (subject && subject !== 'all') {
      query += ' AND (LOWER(subject) = LOWER(?) OR LOWER(subjectKm) = LOWER(?))';
      params.push(String(subject), String(subject));
    }
    if (topic && topic !== 'all') {
      query += ' AND (LOWER(topic) = LOWER(?) OR LOWER(topicKm) = LOWER(?))';
      params.push(String(topic), String(topic));
    }
    if (difficulty && difficulty !== 'all') {
      query += ' AND difficulty = ?';
      params.push(String(difficulty));
    }
    if (search) {
      query += ' AND (question LIKE ? OR questionKm LIKE ? OR explanation LIKE ? OR explanationKm LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params) as unknown as StoredQuestionRow[];
    const formatted = rows.map(formatQuestionOutput);

    return res.json({
      success: true,
      count: formatted.length,
      questions: formatted,
    });
  } catch (error: any) {
    console.error('Error fetching questions from database:', error);
    return res.status(500).json({ error: 'Database error fetching questions' });
  }
});

/**
 * GET /api/questions/:id
 * Retrieves a single question including its stored manual explanation.
 */
app.get('/api/questions/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM questions WHERE id = ?').get(req.params.id) as unknown as StoredQuestionRow | undefined;
    if (!row) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.json(formatQuestionOutput(row));
  } catch (error: any) {
    console.error('Error retrieving question:', error);
    return res.status(500).json({ error: 'Database error retrieving question' });
  }
});

/**
 * GET /api/questions/:id/explanation
 * Directly retrieves the stored manual explanation for a question.
 */
app.get('/api/questions/:id/explanation', (req, res) => {
  try {
    const row = db.prepare('SELECT id, question, questionKm, correctAnswer, explanation, explanationKm, reference FROM questions WHERE id = ?').get(req.params.id) as any;
    if (!row) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.json({
      success: true,
      id: row.id,
      correctAnswer: row.correctAnswer,
      explanation: row.explanation,
      explanationKm: row.explanationKm || row.explanation,
      reference: row.reference || '',
    });
  } catch (error: any) {
    console.error('Error retrieving explanation:', error);
    return res.status(500).json({ error: 'Database error retrieving explanation' });
  }
});

/**
 * POST /api/questions
 * Admin creates a new question with a manual explanation.
 * Stores directly into the database. No AI is used.
 */
app.post('/api/questions', (req, res) => {
  try {
    const {
      question,
      questionKm,
      subject,
      subjectKm,
      topic,
      topicKm,
      difficulty = 'medium',
      options,
      optionsKm,
      optionA,
      optionB,
      optionC,
      optionD,
      optionA_km,
      optionB_km,
      optionC_km,
      optionD_km,
      correctAnswer,
      correctAnswerId,
      explanation,
      explanationKm,
      reference,
      targetExam = 'nie',
    } = req.body;

    // Normalizing options
    const finalOptionA = optionA || options?.A || '';
    const finalOptionB = optionB || options?.B || '';
    const finalOptionC = optionC || options?.C || '';
    const finalOptionD = optionD || options?.D || '';

    const finalOptionA_km = optionA_km || optionsKm?.A || finalOptionA;
    const finalOptionB_km = optionB_km || optionsKm?.B || finalOptionB;
    const finalOptionC_km = optionC_km || optionsKm?.C || finalOptionC;
    const finalOptionD_km = optionD_km || optionsKm?.D || finalOptionD;

    const finalCorrectAnswer = (correctAnswer || correctAnswerId || 'A').toString().toUpperCase().trim();
    const finalExplanation = typeof explanation === 'object' ? explanation?.en || explanation?.km || '' : (explanation || '').trim();
    const finalExplanationKm = typeof explanation === 'object' ? explanation?.km : (explanationKm || finalExplanation).trim();

    if (!question?.trim()) {
      return res.status(400).json({ error: 'Question text is required.' });
    }
    if (!finalOptionA.trim() || !finalOptionB.trim() || !finalOptionC.trim() || !finalOptionD.trim()) {
      return res.status(400).json({ error: 'All 4 options (A, B, C, D) are required.' });
    }
    if (!['A', 'B', 'C', 'D'].includes(finalCorrectAnswer)) {
      return res.status(400).json({ error: 'Correct answer must be one of: A, B, C, D.' });
    }
    if (!finalExplanation) {
      return res.status(400).json({ error: 'Explanation is required and must be manually provided.' });
    }

    const id = `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const insertStmt = db.prepare(`
      INSERT INTO questions (
        id, question, questionKm, subject, subjectKm, topic, topicKm, difficulty,
        optionA, optionB, optionC, optionD,
        optionA_km, optionB_km, optionC_km, optionD_km,
        correctAnswer, explanation, explanationKm, reference, targetExam
      ) VALUES (
        @id, @question, @questionKm, @subject, @subjectKm, @topic, @topicKm, @difficulty,
        @optionA, @optionB, @optionC, @optionD,
        @optionA_km, @optionB_km, @optionC_km, @optionD_km,
        @correctAnswer, @explanation, @explanationKm, @reference, @targetExam
      );
    `);

    insertStmt.run({
      id,
      question: question.trim(),
      questionKm: questionKm?.trim() || question.trim(),
      subject: subject?.trim() || 'Pedagogy',
      subjectKm: subjectKm?.trim() || subject?.trim() || 'គរុកោសល្យ',
      topic: topic?.trim() || 'General Practice',
      topicKm: topicKm?.trim() || topic?.trim() || 'លំហាត់អនុវត្តទូទៅ',
      difficulty,
      optionA: finalOptionA.trim(),
      optionB: finalOptionB.trim(),
      optionC: finalOptionC.trim(),
      optionD: finalOptionD.trim(),
      optionA_km: finalOptionA_km.trim(),
      optionB_km: finalOptionB_km.trim(),
      optionC_km: finalOptionC_km.trim(),
      optionD_km: finalOptionD_km.trim(),
      correctAnswer: finalCorrectAnswer,
      explanation: finalExplanation,
      explanationKm: finalExplanationKm,
      reference: reference?.trim() || '',
      targetExam,
    });

    const created = db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as unknown as StoredQuestionRow;
    return res.status(201).json({
      success: true,
      question: formatQuestionOutput(created),
    });
  } catch (error: any) {
    console.error('Error creating question in database:', error);
    return res.status(500).json({ error: 'Failed to create question in database.' });
  }
});

/**
 * POST /api/questions/bulk
 * Import an array of questions from JSON directly into the SQLite database.
 */
app.post('/api/questions/bulk', (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'An array of questions is required.' });
    }

    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO questions (
        id, question, questionKm, subject, subjectKm, topic, topicKm, difficulty,
        optionA, optionB, optionC, optionD,
        optionA_km, optionB_km, optionC_km, optionD_km,
        correctAnswer, explanation, explanationKm, reference, targetExam, updated_at
      ) VALUES (
        @id, @question, @questionKm, @subject, @subjectKm, @topic, @topicKm, @difficulty,
        @optionA, @optionB, @optionC, @optionD,
        @optionA_km, @optionB_km, @optionC_km, @optionD_km,
        @correctAnswer, @explanation, @explanationKm, @reference, @targetExam, CURRENT_TIMESTAMP
      );
    `);

    let importedCount = 0;
    db.exec('BEGIN');
    try {
      for (const q of questions) {
        const id = q.id || `q-json-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const question = typeof q.question === 'object' ? q.question?.en || q.question?.km : (q.question || '');
        const questionKm = typeof q.question === 'object' ? q.question?.km : (q.questionKm || question);

        const optionA = q.optionA || q.options?.A || (q.optionsList?.[0]?.text?.en || q.optionsList?.[0]?.text) || 'A';
        const optionB = q.optionB || q.options?.B || (q.optionsList?.[1]?.text?.en || q.optionsList?.[1]?.text) || 'B';
        const optionC = q.optionC || q.options?.C || (q.optionsList?.[2]?.text?.en || q.optionsList?.[2]?.text) || 'C';
        const optionD = q.optionD || q.options?.D || (q.optionsList?.[3]?.text?.en || q.optionsList?.[3]?.text) || 'D';

        const optionA_km = q.optionA_km || q.optionsKm?.A || (q.optionsList?.[0]?.text?.km) || optionA;
        const optionB_km = q.optionB_km || q.optionsKm?.B || (q.optionsList?.[1]?.text?.km) || optionB;
        const optionC_km = q.optionC_km || q.optionsKm?.C || (q.optionsList?.[2]?.text?.km) || optionC;
        const optionD_km = q.optionD_km || q.optionsKm?.D || (q.optionsList?.[3]?.text?.km) || optionD;

        const correctAnswer = (q.correctAnswer || q.correctAnswerId || 'A').toString().toUpperCase().trim();
        const explanation = typeof q.explanation === 'object' ? q.explanation?.en || q.explanation?.km || '' : (q.explanation || 'See textbook reference.');
        const explanationKm = typeof q.explanation === 'object' ? q.explanation?.km : (q.explanationKm || explanation);

        if (!question?.trim()) continue;

        insertStmt.run({
          id,
          question: question.trim(),
          questionKm: questionKm?.trim() || question.trim(),
          subject: q.subject?.trim() || 'General Culture',
          subjectKm: q.subjectKm?.trim() || 'វប្បធម៌ទូទៅ',
          topic: q.topic?.trim() || 'General Topic',
          topicKm: q.topicKm?.trim() || 'ប្រធានបទ',
          difficulty: q.difficulty || 'medium',
          optionA: String(optionA).trim(),
          optionB: String(optionB).trim(),
          optionC: String(optionC).trim(),
          optionD: String(optionD).trim(),
          optionA_km: String(optionA_km).trim(),
          optionB_km: String(optionB_km).trim(),
          optionC_km: String(optionC_km).trim(),
          optionD_km: String(optionD_km).trim(),
          correctAnswer: ['A', 'B', 'C', 'D'].includes(correctAnswer) ? correctAnswer : 'A',
          explanation: String(explanation).trim(),
          explanationKm: String(explanationKm).trim(),
          reference: q.reference?.trim() || 'MoEYS Reference',
          targetExam: q.targetExam || 'nie',
        });
        importedCount++;
      }
      db.exec('COMMIT');
    } catch (txErr) {
      db.exec('ROLLBACK');
      throw txErr;
    }

    return res.json({
      success: true,
      count: importedCount,
      message: `Successfully imported ${importedCount} questions into SQLite database.`,
    });
  } catch (error: any) {
    console.error('Error importing questions in bulk:', error);
    return res.status(500).json({ error: 'Failed to import questions in bulk.' });
  }
});

/**
 * PUT /api/questions/:id
 * Admin updates an existing question and its manual explanation.
 */
app.put('/api/questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as unknown as StoredQuestionRow | undefined;
    if (!existing) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    const {
      question,
      questionKm,
      subject,
      subjectKm,
      topic,
      topicKm,
      difficulty,
      options,
      optionsKm,
      optionA,
      optionB,
      optionC,
      optionD,
      optionA_km,
      optionB_km,
      optionC_km,
      optionD_km,
      correctAnswer,
      correctAnswerId,
      explanation,
      explanationKm,
      reference,
      targetExam,
    } = req.body;

    const finalOptionA = optionA ?? options?.A ?? existing.optionA;
    const finalOptionB = optionB ?? options?.B ?? existing.optionB;
    const finalOptionC = optionC ?? options?.C ?? existing.optionC;
    const finalOptionD = optionD ?? options?.D ?? existing.optionD;

    const finalOptionA_km = optionA_km ?? optionsKm?.A ?? existing.optionA_km;
    const finalOptionB_km = optionB_km ?? optionsKm?.B ?? existing.optionB_km;
    const finalOptionC_km = optionC_km ?? optionsKm?.C ?? existing.optionC_km;
    const finalOptionD_km = optionD_km ?? optionsKm?.D ?? existing.optionD_km;

    const finalCorrectAnswer = (correctAnswer || correctAnswerId || existing.correctAnswer).toString().toUpperCase().trim();
    const finalExplanation = typeof explanation === 'object' ? explanation?.en || explanation?.km : (explanation ?? existing.explanation);
    const finalExplanationKm = typeof explanation === 'object' ? explanation?.km : (explanationKm ?? existing.explanationKm);

    db.prepare(`
      UPDATE questions SET
        question = @question,
        questionKm = @questionKm,
        subject = @subject,
        subjectKm = @subjectKm,
        topic = @topic,
        topicKm = @topicKm,
        difficulty = @difficulty,
        optionA = @optionA,
        optionB = @optionB,
        optionC = @optionC,
        optionD = @optionD,
        optionA_km = @optionA_km,
        optionB_km = @optionB_km,
        optionC_km = @optionC_km,
        optionD_km = @optionD_km,
        correctAnswer = @correctAnswer,
        explanation = @explanation,
        explanationKm = @explanationKm,
        reference = @reference,
        targetExam = @targetExam,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id;
    `).run({
      id,
      question: question ?? existing.question,
      questionKm: questionKm ?? existing.questionKm,
      subject: subject ?? existing.subject,
      subjectKm: subjectKm ?? existing.subjectKm,
      topic: topic ?? existing.topic,
      topicKm: topicKm ?? existing.topicKm,
      difficulty: difficulty ?? existing.difficulty,
      optionA: finalOptionA,
      optionB: finalOptionB,
      optionC: finalOptionC,
      optionD: finalOptionD,
      optionA_km: finalOptionA_km,
      optionB_km: finalOptionB_km,
      optionC_km: finalOptionC_km,
      optionD_km: finalOptionD_km,
      correctAnswer: finalCorrectAnswer,
      explanation: finalExplanation,
      explanationKm: finalExplanationKm,
      reference: reference ?? existing.reference,
      targetExam: targetExam ?? existing.targetExam,
    });

    const updated = db.prepare('SELECT * FROM questions WHERE id = ?').get(id) as unknown as StoredQuestionRow;
    return res.json({
      success: true,
      question: formatQuestionOutput(updated),
    });
  } catch (error: any) {
    console.error('Error updating question:', error);
    return res.status(500).json({ error: 'Failed to update question in database.' });
  }
});

/**
 * DELETE /api/questions/:id
 * Admin deletes a question.
 */
app.delete('/api/questions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const info = db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    return res.json({
      success: true,
      deletedId: id,
      changes: info.changes,
    });
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ error: 'Failed to delete question from database.' });
  }
});


// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[Gemini] GEMINI_API_KEY is not configured in environment.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Calls Gemini API with automated retry and model failover.
 * Primary: 'gemini-3.8-flash'
 * Fallback: 'gemini-3.1-flash-lite'
 * Handles transient 503 (model experiencing high demand / UNAVAILABLE), 429, and network glitches.
 */
async function callGeminiWithRetryAndFallback(
  ai: GoogleGenAI,
  callFactory: (modelName: string) => Promise<any>,
  preferredModels: string[] = ['gemini-3.8-flash', 'gemini-3.1-flash-lite']
): Promise<any> {
  let lastError: any = null;

  for (const model of preferredModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await callFactory(model);
      } catch (err: any) {
        lastError = err;
        const msg = (err?.message || '').toLowerCase();
        const status = err?.status || err?.code || '';
        const isTransient =
          msg.includes('503') ||
          msg.includes('unavailable') ||
          msg.includes('high demand') ||
          msg.includes('429') ||
          msg.includes('resource_exhausted') ||
          msg.includes('econnreset') ||
          msg.includes('timeout') ||
          status === 503 ||
          status === 429;

        console.warn(`[Gemini] Attempt ${attempt + 1} with model '${model}' failed:`, msg || status);

        if (!isTransient || attempt >= 1) {
          break;
        }

        // Brief delay before retry
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

/**
 * Standard MoEYS pedagogical explanation fallback when AI is unavailable or undergoing high demand
 */
function buildPedagogicalFallback(params: {
  question: any;
  options?: any[];
  studentAnswerId: string;
  studentAnswerText?: string;
  correctAnswerId: string;
  correctAnswerText?: string;
  topic?: string;
  subject?: string;
  language?: string;
}) {
  const isKm = params.language !== 'en';
  const topicLabel = params.topic || params.subject || (isKm ? 'គរុកោសល្យទូទៅ' : 'General Pedagogy');
  const studentAns = params.studentAnswerText
    ? ` "${params.studentAnswerId}: ${params.studentAnswerText}"`
    : ` "${params.studentAnswerId}"`;
  const correctAns = params.correctAnswerText
    ? ` "${params.correctAnswerId}: ${params.correctAnswerText}"`
    : ` "${params.correctAnswerId}"`;

  if (isKm) {
    return {
      whyCorrect: `ចម្លើយត្រឹមត្រូវគឺ ${correctAns} ពីព្រោះវាឆ្លុះបញ្ចាំងយ៉ាងច្បាស់លាស់ពីគោលការណ៍គរុកោសល្យ កម្មវិធីសិក្សាស្តង់ដារ និងលក្ខណៈវិនិច្ឆ័យវិជ្ជាជីវៈគ្រូបង្រៀនរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។`,
      whyIncorrect: `ចម្លើយដែលអ្នកបានជ្រើសរើស ${studentAns} មិនទាន់ត្រឹមត្រូវទេ ដោយសារមិនបានឆ្លើយតបគ្រប់ជ្រុងជ្រោយទៅនឹងលក្ខខណ្ឌស្នូលនៃប្រធានបទ "${topicLabel}" ឬមានការយល់ច្រឡំលើគោលការណ៍អនុវត្តផ្ទាល់ក្នុងថ្នាក់រៀន។`,
      keyConcept: `គន្លឹះសំខាន់សម្រាប់ប្រឡងគ្រូ៖ សម្រាប់ប្រធានបទ "${topicLabel}" សូមចងចាំគោលគំនិតគ្រឹះ វិធីសាស្ត្របង្រៀនដែលផ្តោតលើសិស្សជាមជ្ឈមណ្ឌល និងការវាយតម្លៃដើម្បីកែលម្អការរៀន។`,
      fullText: `ការពន្យល់គរុកោសល្យ៖ ចម្លើយត្រឹមត្រូវគឺ (${params.correctAnswerId})។ សូមពិនិត្យឡើងវិញនូវចំណុចគន្លឹះនៃ "${topicLabel}"។`,
    };
  }

  return {
    whyCorrect: `Choice ${correctAns} is correct because it directly aligns with official pedagogical criteria and MoEYS national curriculum standards.`,
    whyIncorrect: `Your selected choice ${studentAns} is incorrect because it overlooks the primary instructional condition of "${topicLabel}" or misapplies the classroom principle.`,
    keyConcept: `Essential exam takeaway for "${topicLabel}": Focus on foundational concepts, learner-centered methodology, and formative assessment principles.`,
    fullText: `Pedagogical explanation: Correct answer is (${params.correctAnswerId}). Review key concepts of "${topicLabel}".`,
  };
}

// --------------------------------------------------------------------------
// API Route 1: AI Answer Explanation (Student gets a question wrong)
// --------------------------------------------------------------------------
app.post('/api/ai/explain-answer', async (req, res) => {
  try {
    const {
      question,
      options,
      studentAnswerId,
      studentAnswerText,
      correctAnswerId,
      correctAnswerText,
      topic,
      subject,
      language = 'km',
    } = req.body;

    if (!question || !correctAnswerId) {
      return res.status(400).json({ error: 'Missing required question details.' });
    }

    const ai = getGeminiClient();

    // Fallback response if API key is not configured
    if (!ai) {
      const fallback = buildPedagogicalFallback({
        question,
        options,
        studentAnswerId,
        studentAnswerText,
        correctAnswerId,
        correctAnswerText,
        topic,
        subject,
        language,
      });

      return res.json({
        success: true,
        source: 'rule-fallback',
        explanation: fallback,
      });
    }

    const formattedOptions = (options || [])
      .map((opt: any) => `${opt.id}: ${typeof opt.text === 'object' ? opt.text.km || opt.text.en : opt.text}`)
      .join('\n');

    const prompt = `
You are an expert Cambodian National Teacher Examination (PassKru) tutor and curriculum specialist.
A student candidate answered this exam question incorrectly.
Provide a concise, encouraging, and clear pedagogical explanation.

Question: ${typeof question === 'object' ? question.km || question.en : question}
Subject: ${subject || 'General'}
Topic: ${topic || 'General'}
Answer Choices:
${formattedOptions}

Student's Chosen Answer: ${studentAnswerId} (${studentAnswerText || ''})
Correct Answer: ${correctAnswerId} (${correctAnswerText || ''})

Requested Output Language: ${language === 'km' ? 'Khmer (ភាសាខ្មែរ)' : 'English'}

Provide:
1. whyCorrect: Clear explanation of why the correct answer is correct.
2. whyIncorrect: Specific explanation of why the student's selected answer is incorrect or where the misconception lies.
3. keyConcept: The essential pedagogical rule or formula the student should remember for the national exam.
Keep each part 1-3 sentences, direct and educational.
`;

    try {
      const response = await callGeminiWithRetryAndFallback(ai, (model) =>
        ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                whyCorrect: {
                  type: Type.STRING,
                  description: 'Why the correct answer is correct',
                },
                whyIncorrect: {
                  type: Type.STRING,
                  description: "Why the student's selected answer is incorrect",
                },
                keyConcept: {
                  type: Type.STRING,
                  description: 'The important concept to remember for the exam',
                },
              },
              required: ['whyCorrect', 'whyIncorrect', 'keyConcept'],
            },
          },
        })
      );

      const parsedData = JSON.parse(response.text || '{}');

      if (parsedData.whyCorrect && parsedData.keyConcept) {
        return res.json({
          success: true,
          source: 'gemini-ai',
          explanation: {
            whyCorrect: parsedData.whyCorrect,
            whyIncorrect: parsedData.whyIncorrect || '',
            keyConcept: parsedData.keyConcept,
            fullText: `${parsedData.whyCorrect}\n\n${parsedData.whyIncorrect}\n\n${language === 'km' ? 'គន្លឹះចាំបាច់៖' : 'Key Concept:'} ${parsedData.keyConcept}`,
          },
        });
      }
      throw new Error('Incomplete structure in Gemini response');
    } catch (apiErr: any) {
      console.warn('[Gemini] High demand or API unavailability, using pedagogical fallback:', apiErr?.message || apiErr);
      const fallback = buildPedagogicalFallback({
        question,
        options,
        studentAnswerId,
        studentAnswerText,
        correctAnswerId,
        correctAnswerText,
        topic,
        subject,
        language,
      });

      return res.json({
        success: true,
        source: 'rule-fallback',
        explanation: fallback,
      });
    }
  } catch (error: any) {
    console.error('Error handling answer explanation:', error);
    const fallback = buildPedagogicalFallback({
      question: req.body?.question || '',
      studentAnswerId: req.body?.studentAnswerId || '',
      correctAnswerId: req.body?.correctAnswerId || '',
      topic: req.body?.topic,
      subject: req.body?.subject,
      language: req.body?.language,
    });
    return res.json({
      success: true,
      source: 'rule-fallback',
      explanation: fallback,
    });
  }
});

// --------------------------------------------------------------------------
// Health Check
// --------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// --------------------------------------------------------------------------
// Start Server & Vite Integration
// --------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PassKru Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
