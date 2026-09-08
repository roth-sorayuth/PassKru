import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  EXAM_CATEGORIES,
  ExamCategoryConfig,
  getCategoryConfig,
} from '../../data/examSelectionData';
import {
  GraduationCap,
  School,
  Building2,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  BookOpen,
  X,
  Layers,
} from 'lucide-react';

interface ExamSelectionFlowProps {
  isModal?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const ExamSelectionFlow: React.FC<ExamSelectionFlowProps> = ({
  isModal = false,
  onClose,
  onSuccess,
}) => {
  const { lang } = useLanguage();
  const { userProfile, saveExamSelection } = useApp();

  // Find initial category based on user profile if changing selection
  const initialCategoryConfig = getCategoryConfig(userProfile.examCategory || userProfile.targetExam);
  const [selectedCategory, setSelectedCategory] = useState<ExamCategoryConfig | null>(
    initialCategoryConfig || null
  );

  // Additional selected subject or combination
  const [chosenOption, setChosenOption] = useState<string>(() => {
    if (userProfile.selectedSubjects && userProfile.selectedSubjects.length > 0) {
      // Find the subject that is not 'វប្បធម៌ទូទៅ'
      const nonCulture = userProfile.selectedSubjects.find(
        (s) => !s.includes('វប្បធម៌ទូទៅ') && !s.includes('General Culture')
      );
      return nonCulture || '';
    }
    return '';
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSaving, setIsSaving] = useState(false);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'higher':
        return GraduationCap;
      case 'basic':
        return School;
      case 'primary':
      default:
        return Building2;
    }
  };

  // Compute final subjects array
  const computeFinalSubjects = (): string[] => {
    if (!selectedCategory) return [];
    if (selectedCategory.selectionType === 'automatic') {
      return [...selectedCategory.requiredSubjects];
    }
    const list = [...selectedCategory.requiredSubjects];
    if (chosenOption && !list.includes(chosenOption)) {
      list.push(chosenOption);
    }
    return list;
  };

  const handleCategorySelect = (category: ExamCategoryConfig) => {
    setSelectedCategory(category);
    // Reset chosen option if switching category
    if (selectedCategory?.id !== category.id) {
      setChosenOption('');
    }
  };

  const handleStep1Next = () => {
    if (!selectedCategory) return;
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedCategory) return;
    if (selectedCategory.selectionType !== 'automatic' && !chosenOption) {
      return;
    }
    setStep(3);
  };

  const handleSave = async () => {
    if (!selectedCategory) return;
    const finalSubjects = computeFinalSubjects();
    if (finalSubjects.length === 0) return;

    setIsSaving(true);
    try {
      await saveExamSelection({
        examCategory: selectedCategory.titleKm,
        selectedSubjects: finalSubjects,
        targetExam: selectedCategory.targetExam,
      });

      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Failed to save exam selection:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={`w-full ${
        isModal
          ? 'max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]'
          : 'max-w-4xl mx-auto py-4 px-3 sm:px-6'
      }`}
    >
      {/* Modal / Flow Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-[#0f3360] to-[#1a4a82] text-white relative shrink-0">
        {isModal && userProfile.hasCompletedExamSelection && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {lang === 'km' ? 'ជ្រើសរើសក្របខណ្ឌប្រឡង & មុខវិជ្ជា' : 'Select Exam Category & Subjects'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
              {lang === 'km'
                ? 'កំណត់ការរៀបចំមាតិកា និងសំណួរតេស្តឱ្យត្រូវនឹងជំនាញរបស់អ្នក'
                : 'Personalize questions, quizzes, and study content for your exam'}
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-white/15 text-xs font-bold">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? 'text-amber-300' : 'text-white/50'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 1 ? 'bg-amber-400 text-slate-900' : 'bg-white/20 text-white'
              }`}
            >
              1
            </span>
            <span className="hidden sm:inline">
              {lang === 'km' ? 'កម្រិតប្រឡង' : 'Exam Category'}
            </span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-amber-400' : 'bg-white/20'}`} />

          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? 'text-amber-300' : 'text-white/50'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step >= 2 ? 'bg-amber-400 text-slate-900' : 'bg-white/20 text-white'
              }`}
            >
              2
            </span>
            <span className="hidden sm:inline">
              {lang === 'km' ? 'មុខវិជ្ជា / គូឯកទេស' : 'Subjects'}
            </span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-amber-400' : 'bg-white/20'}`} />

          <div
            className={`flex items-center gap-2 ${
              step === 3 ? 'text-amber-300' : 'text-white/50'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === 3 ? 'bg-amber-400 text-slate-900' : 'bg-white/20 text-white'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">
              {lang === 'km' ? 'ផ្ទៀងផ្ទាត់ & រក្សាទុក' : 'Confirm'}
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
        {/* ======================= STEP 1 ======================= */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {lang === 'km' ? 'ជំហានទី ១៖ ជ្រើសរើសក្របខណ្ឌប្រឡង' : 'Step 1: Choose Exam Category'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {lang === 'km'
                  ? 'សូមជ្រើសរើសក្របខណ្ឌដែលអ្នកគ្រោងនឹងប្រឡងប្រជែង'
                  : 'Please select the target recruitment exam track you are sitting for'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
              {EXAM_CATEGORIES.map((category) => {
                const isSelected = selectedCategory?.id === category.id;
                const Icon = getCategoryIcon(category.id);

                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#0f3360] bg-blue-50/50 shadow-md ring-2 ring-[#0f3360]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#0f3360] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="space-y-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#0f3360] text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 mb-1.5">
                          {category.badgeKm}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                          {category.titleKm}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {category.levelKm}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {category.descriptionKm}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= STEP 2 ======================= */}
        {step === 2 && selectedCategory && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-[#0f3360] mb-1">
                {selectedCategory.titleKm}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {lang === 'km'
                  ? 'ជំហានទី ២៖ កំណត់មុខវិជ្ជាប្រឡង'
                  : 'Step 2: Choose Exam Subjects'}
              </h3>
            </div>

            {/* Required subjects section */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {lang === 'km'
                    ? 'មុខវិជ្ជាចាំបាច់ (រួមបញ្ចូលដោយស្វ័យប្រវត្តិ)'
                    : 'Mandatory Subjects (Included Automatically)'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedCategory.requiredSubjects.map((sub) => (
                  <span
                    key={sub}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 border border-amber-300 font-bold text-xs shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Choices for Higher / Basic */}
            {selectedCategory.selectionType === 'single' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {lang === 'km'
                      ? 'ជ្រើសរើសមុខវិជ្ជាឯកទេសបន្ថែម (ជ្រើសរើស ១)៖'
                      : 'Select 1 Additional Specialization Subject:'}
                  </p>
                  {chosenOption && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {lang === 'km' ? 'បានជ្រើសរើស' : 'Selected'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {selectedCategory.availableOptions?.map((opt) => {
                    const isChecked = chosenOption === opt.subjectKey;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setChosenOption(opt.subjectKey)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'border-[#0f3360] bg-blue-50/70 font-bold text-[#0f3360] shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{opt.labelKm}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'border-[#0f3360] bg-[#0f3360] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedCategory.selectionType === 'combination' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {lang === 'km'
                      ? 'ជ្រើសរើសគូឯកទេសចម្រុះ (ជ្រើសរើស ១ គូ)៖'
                      : 'Select 1 Subject Combination Pair:'}
                  </p>
                  {chosenOption && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {lang === 'km' ? 'បានជ្រើសរើស' : 'Selected'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCategory.availableOptions?.map((opt) => {
                    const isChecked = chosenOption === opt.subjectKey;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setChosenOption(opt.subjectKey)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'border-[#0f3360] bg-blue-50/70 font-bold text-[#0f3360] shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-xs sm:text-sm">{opt.labelKm}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'border-[#0f3360] bg-[#0f3360] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedCategory.selectionType === 'automatic' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm leading-relaxed">
                <p className="font-bold mb-1">
                  {lang === 'km'
                    ? '✓ រួចរាល់សម្រាប់កម្រិតបឋមសិក្សា'
                    : '✓ Ready for Primary Level'}
                </p>
                <p>
                  {lang === 'km'
                    ? 'ក្របខណ្ឌគ្រូបឋមសិក្សាតម្រូវឱ្យប្រឡងលើមុខវិជ្ជាទាំង ៣ ខាងលើនេះរួមគ្នា។ អ្នកមិនចាំបាច់ជ្រើសរើសមុខវិជ្ជាបន្ថែមទៀតទេ។'
                    : 'The primary school track encompasses all 3 core subjects above. No additional choice is required.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ======================= STEP 3 ======================= */}
        {step === 3 && selectedCategory && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {lang === 'km'
                  ? 'ជំហានទី ៣៖ ពិនិត្យ និងបញ្ជាក់ជម្រើសរបស់អ្នក'
                  : 'Step 3: Review & Confirm Selection'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {lang === 'km'
                  ? 'សូមពិនិត្យព័ត៌មានខាងក្រោមមុននឹងរក្សាទុក'
                  : 'Please verify your choices before saving'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {lang === 'km' ? 'ក្របខណ្ឌប្រឡង' : 'Exam Category'}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-[#0f3360]">
                    {selectedCategory.titleKm}
                  </h4>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#0f3360]">
                  {selectedCategory.badgeKm}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {lang === 'km' ? 'មុខវិជ្ជាដែលនឹងត្រូវអនុវត្ត' : 'Active Practice Subjects'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {computeFinalSubjects().map((sub, idx) => (
                    <div
                      key={sub}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 font-bold text-xs sm:text-sm text-slate-800 shadow-2xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs">
                        {idx + 1}
                      </div>
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {lang === 'km'
                    ? 'អ្នកអាចផ្លាស់ប្តូរជម្រើសនេះបានគ្រប់ពេលតាមរយៈផ្ទាំងគ្រប់គ្រង ឬទំព័រ Profile។'
                    : 'You can change this selection at any time from your Dashboard or Profile.'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Controls */}
      <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'km' ? 'ថយក្រោយ' : 'Back'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {step === 1 && (
            <button
              type="button"
              disabled={!selectedCategory}
              onClick={handleStep1Next}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer ${
                selectedCategory
                  ? 'bg-[#0f3360] hover:bg-[#12427d] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'km' ? 'បន្តទៅមុខ' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              disabled={selectedCategory?.selectionType !== 'automatic' && !chosenOption}
              onClick={handleStep2Next}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer ${
                selectedCategory?.selectionType === 'automatic' || chosenOption
                  ? 'bg-[#0f3360] hover:bg-[#12427d] text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'km' ? 'ពិនិត្យជម្រើស' : 'Review'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm cursor-pointer"
            >
              {isSaving ? (
                <span>{lang === 'km' ? 'កំពុងរក្សាទុក...' : 'Saving...'}</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'km' ? 'បញ្ជាក់ និងរក្សាទុក' : 'Confirm & Save'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

