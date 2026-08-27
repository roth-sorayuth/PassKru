import React, { useState } from 'react';
import { Quiz, FlashcardDeck, SubjectCategory, ExamTargetLevel, DifficultyLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { SUBJECT_LABELS, EXAM_LEVEL_LABELS, INITIAL_FLASHCARDS } from '../../data/mockData';
import { 
  CheckSquare, 
  Layers, 
  Plus, 
  Search, 
  Clock, 
  Award, 
  Users, 
  Play, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  RotateCw,
  X
} from 'lucide-react';

interface QuizzesFlashcardsViewProps {
  quizzes: Quiz[];
  flashcardDecks: FlashcardDeck[];
  onCreateQuiz: (quiz: Omit<Quiz, 'id' | 'participationsCount' | 'averageScorePercentage'>) => void;
  onCreateDeck: (deck: Omit<FlashcardDeck, 'id' | 'viewsCount'>) => void;
  onDeleteQuiz: (id: string) => void;
  onDeleteDeck: (id: string) => void;
  showEnglishLabels: boolean;
}

export const QuizzesFlashcardsView: React.FC<QuizzesFlashcardsViewProps> = ({
  quizzes,
  flashcardDecks,
  onCreateQuiz,
  onCreateDeck,
  onDeleteQuiz,
  onDeleteDeck,
  showEnglishLabels,
}) => {
  const [activeTab, setActiveTab] = useState<'QUIZZES' | 'FLASHCARDS'>('QUIZZES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  // Preview Modal for interactive flashcard testing
  const [previewDeck, setPreviewDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Modals
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'quiz' | 'deck';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'quiz',
    id: '',
    title: '',
  });

  // Form State for Quiz
  const [quizForm, setQuizForm] = useState<{
    title: string;
    description: string;
    subject: SubjectCategory;
    targetLevel: ExamTargetLevel;
    difficulty: DifficultyLevel;
    questionCount: number;
    timeLimitMinutes: number;
    passingScorePercentage: number;
    status: 'PUBLISHED' | 'DRAFT';
    createdBy: string;
  }>({
    title: '',
    description: '',
    subject: 'PEDAGOGY',
    targetLevel: 'NIE_HIGH_SCHOOL',
    difficulty: 'MEDIUM',
    questionCount: 20,
    timeLimitMinutes: 25,
    passingScorePercentage: 70,
    status: 'PUBLISHED',
    createdBy: 'រដ្ឋបាល PassKru',
  });

  // Form State for Flashcard Deck
  const [deckForm, setDeckForm] = useState<{
    title: string;
    description: string;
    subject: SubjectCategory;
    targetLevel: ExamTargetLevel;
    cardsCount: number;
    status: 'PUBLISHED' | 'DRAFT';
    cards: { id: string; frontKhmer: string; backKhmer: string; mnemonicHint?: string }[];
  }>({
    title: '',
    description: '',
    subject: 'PEDAGOGY',
    targetLevel: 'NIE_HIGH_SCHOOL',
    cardsCount: 15,
    status: 'PUBLISHED',
    cards: [
      { id: 'c1', frontKhmer: 'តាក់សូណូមីប្ល៊ូម (Bloom\'s Taxonomy)', backKhmer: 'កម្រិតទាំង ៦៖ ចងចាំ, យល់, អនុវត្ត, វិភាគ, វាយតម្លៃ, បង្កើតថ្មី', mnemonicHint: 'ចាំ-យល់-វត្ត-ភាគ-តម្លៃ-កើត' },
      { id: 'c2', frontKhmer: 'វិធីសាស្ត្របង្រៀនផ្អែកលើបញ្ហា (PBL)', backKhmer: 'Problem-Based Learning៖ ការរៀនតាមរយៈការដោះស្រាយបញ្ហាក្នុងជីវិតជាក់ស្តែង' },
    ],
  });

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) return;
    onCreateQuiz(quizForm);
    setIsQuizModalOpen(false);
  };

  const handleDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckForm.title.trim()) return;
    onCreateDeck(deckForm);
    setIsDeckModalOpen(false);
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      if (!q.title.toLowerCase().includes(s) && !q.description.toLowerCase().includes(s)) return false;
    }
    if (selectedSubject !== 'ALL' && q.subject !== selectedSubject) return false;
    return true;
  });

  const filteredDecks = flashcardDecks.filter((d) => {
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      if (!d.title.toLowerCase().includes(s) && !d.description.toLowerCase().includes(s)) return false;
    }
    if (selectedSubject !== 'ALL' && d.subject !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <span>កម្រងសំណួរ & ប័ណ្ណពាក្យ (Quizzes & Flashcards)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            ចាត់ចែងកម្រងសំណួរអនុវត្តតាមមុខវិជ្ជា និងប័ណ្ណចងចាំទ្រឹស្ដីគរុកោសល្យ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-[#0D0F12] border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('QUIZZES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'QUIZZES'
                  ? 'bg-[#1A1D24] text-indigo-400 shadow-xs border border-white/10'
                  : 'text-[#8E929E] hover:text-white'
              }`}
            >
              កម្រងសំណួរអនុវត្ត ({quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('FLASHCARDS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'FLASHCARDS'
                  ? 'bg-[#1A1D24] text-indigo-400 shadow-xs border border-white/10'
                  : 'text-[#8E929E] hover:text-white'
              }`}
            >
              ប័ណ្ណពាក្យ Flashcards ({flashcardDecks.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'QUIZZES') {
                setQuizForm({
                  title: '',
                  description: '',
                  subject: 'PEDAGOGY',
                  targetLevel: 'NIE_HIGH_SCHOOL',
                  difficulty: 'MEDIUM',
                  questionCount: 20,
                  timeLimitMinutes: 25,
                  passingScorePercentage: 70,
                  status: 'PUBLISHED',
                  createdBy: 'រដ្ឋបាល PassKru',
                });
                setIsQuizModalOpen(true);
              } else {
                setDeckForm({
                  title: '',
                  description: '',
                  subject: 'PEDAGOGY',
                  targetLevel: 'NIE_HIGH_SCHOOL',
                  cardsCount: 15,
                  status: 'PUBLISHED',
                  cards: [
                    { id: 'c1', frontKhmer: 'ពាក្យគន្លឹះទី ១', backKhmer: 'អត្ថន័យ និងការពន្យល់' },
                  ],
                });
                setIsDeckModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'QUIZZES' ? 'បង្កើតកម្រងសំណួរ' : 'បង្កើតប័ណ្ណពាក្យ'}</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកតាមចំណងជើង..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl text-white placeholder-[#5A5E6B] focus:border-indigo-500/50 outline-none"
          />
        </div>

        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់មុខវិជ្ជា (ទាំងអស់)</option>
            <option value="PEDAGOGY">គរុកោសល្យ និងវិធីសាស្ត្រ</option>
            <option value="EDUCATION_LAW">ច្បាប់ស្ដីពីការអប់រំ</option>
            <option value="GENERAL_CULTURE">វប្បធម៌ទូទៅ</option>
            <option value="KHMER_LIT">អក្សរសាស្ត្រខ្មែរ</option>
            <option value="MATH">គណិតវិទ្យា</option>
          </select>
        </div>
      </div>

      {/* Quizzes List */}
      {activeTab === 'QUIZZES' ? (
        filteredQuizzes.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="រកមិនឃើញកម្រងសំណួរទេ"
            description="មិនមានកម្រងសំណួរដែលត្រូវនឹងការស្វែងរកឡើយ។"
            actionText="បង្កើតកម្រងសំណួរថ្មី"
            onAction={() => setIsQuizModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((q) => (
              <div
                key={q.id}
                className="bg-[#111317] p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${SUBJECT_LABELS[q.subject]?.color || 'bg-white/5 border-white/10 text-white'}`}>
                      {SUBJECT_LABELS[q.subject]?.km || q.subject}
                    </span>
                    <StatusBadge status={q.status} size="sm" />
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{q.title}</h3>
                  <p className="text-xs text-[#8E929E] line-clamp-2">{q.description}</p>

                  <div className="grid grid-cols-3 gap-2 bg-[#0D0F12] p-2.5 rounded-xl border border-white/5 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#5A5E6B] block">សំណួរ</span>
                      <strong className="text-white">{q.questionCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5A5E6B] block">រយៈពេល</span>
                      <strong className="text-white">{q.timeLimitMinutes} នាទី</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5A5E6B] block">ពិន្ទុជាប់</span>
                      <strong className="text-emerald-400">{q.passingScorePercentage}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#5A5E6B] pt-1">
                    <span>អនុវត្ត៖ <strong className="text-[#C5C8D1]">{(q.participationsCount ?? 0).toLocaleString()}</strong> ដង</span>
                    <span>មធ្យមភាគ៖ <strong className="text-indigo-400">{q.averageScorePercentage ?? 0}%</strong></span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        type: 'quiz',
                        id: q.id,
                        title: q.title,
                      })
                    }
                    className="p-1.5 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Flashcards Grid */
        filteredDecks.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="រកមិនឃើញប័ណ្ណពាក្យទេ"
            description="មិនមានបណ្តុំប័ណ្ណពាក្យដែលត្រូវនឹងការស្វែងរកឡើយ។"
            actionText="បង្កើតបណ្តុំប័ណ្ណពាក្យថ្មី"
            onAction={() => setIsDeckModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                className="bg-[#111317] p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${SUBJECT_LABELS[deck.subject]?.color || 'bg-white/5 border-white/10 text-white'}`}>
                      {SUBJECT_LABELS[deck.subject]?.km || deck.subject}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                      {deck.cardCount ?? 0} ប័ណ្ណ
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{deck.title}</h3>
                  <p className="text-xs text-[#8E929E] line-clamp-2">{deck.description}</p>

                  <div className="text-[11px] text-[#5A5E6B] flex items-center justify-between pt-1">
                    <span>ចូលមើល៖ <strong className="text-[#C5C8D1]">{(deck.viewsCount ?? 0).toLocaleString()}</strong> ដង</span>
                    <StatusBadge status={deck.status} size="sm" />
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setPreviewDeck(deck);
                      setCurrentCardIndex(0);
                      setIsCardFlipped(false);
                    }}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>សាកល្បងមើលប័ណ្ណ</span>
                  </button>

                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        type: 'deck',
                        id: deck.id,
                        title: deck.title,
                      })
                    }
                    className="p-1.5 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Interactive Flashcard Preview Modal */}
      {previewDeck && (() => {
        const activeCards = (previewDeck as any)?.cards || INITIAL_FLASHCARDS.filter(c => c.deckId === previewDeck.id);
        const cardsList = activeCards.length > 0 ? activeCards : [
          { id: 'fallback-1', frontKhmer: previewDeck.title, backKhmer: previewDeck.description || 'ខ្លឹមសារមេរៀន និងការពន្យល់លម្អិត' }
        ];
        const currentCard = cardsList[Math.min(currentCardIndex, cardsList.length - 1)];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[#111317] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 text-[#E0E0E0]">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">{previewDeck.title}</h3>
                  <span className="text-xs text-[#8E929E]">
                    ប័ណ្ណទី {currentCardIndex + 1} នៃ {cardsList.length}
                  </span>
                </div>
                <button onClick={() => setPreviewDeck(null)} className="text-[#8E929E] hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Interactive Flip Card */}
              {currentCard && (
                <div
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="cursor-pointer min-h-[220px] rounded-2xl bg-[#0D0F12] border-2 border-indigo-500/30 p-6 flex flex-col justify-between transition-all hover:border-indigo-500/50 select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      {isCardFlipped ? '📖 ចម្លើយ / ការពន្យល់' : '❓ សំណួរ / ពាក្យគន្លឹះ'}
                    </span>
                    <RotateCw className="w-4 h-4 text-indigo-400" />
                  </div>

                  <div className="my-auto py-4 text-center">
                    <p className="text-base font-bold text-white leading-relaxed">
                      {isCardFlipped
                        ? currentCard.backKhmer
                        : currentCard.frontKhmer}
                    </p>
                    {isCardFlipped && (currentCard.mnemonicHint || currentCard.hint) && (
                      <p className="text-xs text-amber-300 mt-3 font-semibold bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                        💡 គន្លឹះចងចាំ៖ {currentCard.mnemonicHint || currentCard.hint}
                      </p>
                    )}
                  </div>

                  <div className="text-center text-[10px] text-[#5A5E6B]">
                    ចុចលើផ្ទៃប័ណ្ណដើម្បីត្រឡប់មុខ-ក្រោយ
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                <button
                  disabled={currentCardIndex === 0}
                  onClick={() => {
                    setCurrentCardIndex((i) => Math.max(0, i - 1));
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#8E929E] bg-[#1A1D24] hover:bg-[#222731] hover:text-white disabled:opacity-40 rounded-xl cursor-pointer"
                >
                  មុន
                </button>
                <button
                  disabled={currentCardIndex >= cardsList.length - 1}
                  onClick={() => {
                    setCurrentCardIndex((i) => Math.min(cardsList.length - 1, i + 1));
                    setIsCardFlipped(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl cursor-pointer"
                >
                  បន្ទាប់
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Create Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <h3 className="text-base font-bold text-white">បង្កើតកម្រងសំណួរអនុវត្តថ្មី</h3>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuizSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ចំណងជើងកម្រងសំណួរ *</label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="ឧ. កម្រងសំណួរគរុកោសល្យទូទៅ ឈុតទី ៣..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white placeholder-[#5A5E6B] outline-none focus:border-indigo-500/50 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ការពិពណ៌នា</label>
                <textarea
                  rows={2}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="ការពិពណ៌នាខ្លីពីគោលបំណងកម្រងសំណួរ..."
                  className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white placeholder-[#5A5E6B] outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">មុខវិជ្ជា *</label>
                  <select
                    value={quizForm.subject}
                    onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value as SubjectCategory })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="PEDAGOGY">គរុកោសល្យ</option>
                    <option value="EDUCATION_LAW">ច្បាប់អប់រំ</option>
                    <option value="GENERAL_CULTURE">វប្បធម៌ទូទៅ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កម្រិតប្រឡង</label>
                  <select
                    value={quizForm.targetLevel}
                    onChange={(e) => setQuizForm({ ...quizForm, targetLevel: e.target.value as ExamTargetLevel })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="NIE_HIGH_SCHOOL">គ្រូវិទ្យាល័យ (NIE)</option>
                    <option value="BASIC_SECONDARY">គ្រូអនុវិទ្យាល័យ</option>
                    <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ចំនួនសំណួរ</label>
                  <input
                    type="number"
                    value={quizForm.questionCount}
                    onChange={(e) => setQuizForm({ ...quizForm, questionCount: Number(e.target.value) })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">នាទីកំណត់</label>
                  <input
                    type="number"
                    value={quizForm.timeLimitMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">% ជាប់</label>
                  <input
                    type="number"
                    value={quizForm.passingScorePercentage}
                    onChange={(e) => setQuizForm({ ...quizForm, passingScorePercentage: Number(e.target.value) })}
                    className="w-full p-2 bg-[#0D0F12] border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 text-[#8E929E] bg-[#1A1D24] hover:bg-[#222731] hover:text-white font-semibold rounded-xl cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  បង្កើតកម្រងសំណួរ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={() => {
          if (deleteModal.type === 'quiz') {
            onDeleteQuiz(deleteModal.id);
          } else {
            onDeleteDeck(deleteModal.id);
          }
          setDeleteModal({ ...deleteModal, isOpen: false });
        }}
        title="លុបទិន្នន័យ"
        description={`តើអ្នកប្រាកដជាចង់លុប "${deleteModal.title}" មែនទេ?`}
        confirmText="លុបចោល"
        isDestructive={true}
      />
    </div>
  );
};
