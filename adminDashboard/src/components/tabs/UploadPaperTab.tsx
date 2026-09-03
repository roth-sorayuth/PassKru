import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, PlusCircle } from 'lucide-react';
import { Exam, Subject, UploadStatus } from '../../types';
import { examService } from '../../services/examService';

interface UploadPaperTabProps {
  exams?: Exam[];
  subjects: Subject[];
  file: File | null;
  setFile: (file: File | null) => void;
  form: {
    title: string;
    subjectId: string;
    year: number;
    paperType: string;
    totalQuestions: string;
    hasAnswerKey: boolean;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    title: string;
    subjectId: string;
    year: number;
    paperType: string;
    totalQuestions: string;
    hasAnswerKey: boolean;
  }>>;
  uploadStatus: UploadStatus;
  uploadError: string;
  onSubmit: (e: React.FormEvent, selectedExamId?: number, overrideSubjectId?: number) => void;
  onGoToLibrary: () => void;
  onRefreshMetadata?: () => void;
}

export const UploadPaperTab: React.FC<UploadPaperTabProps> = ({
  exams = [],
  subjects,
  file,
  setFile,
  form,
  setForm,
  uploadStatus,
  uploadError,
  onSubmit,
  onGoToLibrary,
  onRefreshMetadata,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [localError, setLocalError] = useState<string>('');

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  // Auto-default to first exam if not selected yet
  useEffect(() => {
    if (!selectedExamId && exams.length > 0) {
      setSelectedExamId(String(exams[0].examId));
    }
  }, [exams, selectedExamId]);

  // Group subjects by Exam
  const subjectsByExam = useMemo(() => {
    const grouped: Record<string, { examName: string; list: Subject[] }> = {};
    subjects.forEach((s) => {
      const eId = String(s.exam?.examId || (s as any).examId || 'other');
      const eName = s.exam?.examName || 'ទូទៅ';
      if (!grouped[eId]) {
        grouped[eId] = { examName: eName, list: [] };
      }
      grouped[eId].list.push(s);
    });
    return grouped;
  }, [subjects]);

  // Filter subjects strictly for the selected exam
  const filteredSubjects = useMemo(() => {
    if (!selectedExamId) return subjects;
    return subjects.filter((s) => {
      const examId = s.exam?.examId || (s as any).examId;
      return String(examId) === String(selectedExamId);
    });
  }, [subjects, selectedExamId]);

  // Form submission interceptor to create new subject if '__new__' is chosen
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    let targetSubjectId: number | undefined = undefined;

    if (form.subjectId === '__new__') {
      if (!newSubjectName.trim()) {
        setLocalError('សូមបញ្ចូលឈ្មោះមុខវិជ្ជាថ្មី (Please enter new subject name)');
        return;
      }
      if (!selectedExamId) {
        setLocalError('សូមជ្រើសរើសកម្រិតប្រឡងជាមុនសិន (Please select target exam)');
        return;
      }

      try {
        setIsCreatingSubject(true);
        const createdSubject = await examService.createSubject({
          examId: Number(selectedExamId),
          subjectName: newSubjectName.trim(),
        });

        targetSubjectId = createdSubject.subjectId;
        setForm((f) => ({ ...f, subjectId: String(createdSubject.subjectId) }));
        setNewSubjectName('');
        if (onRefreshMetadata) {
          onRefreshMetadata();
        }
      } catch (err: any) {
        setLocalError(err.message || 'Failed to create new subject');
        setIsCreatingSubject(false);
        return;
      } finally {
        setIsCreatingSubject(false);
      }
    }

    onSubmit(e, selectedExamId ? Number(selectedExamId) : undefined, targetSubjectId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="max-w-2xl mb-6">
          <h2 className="text-lg font-normal text-black">បញ្ចូលវិញ្ញាសាប្រឡង (Upload Past Paper)</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            ជ្រើសរើសកម្រិតប្រឡង និងមុខវិជ្ជា (ឬបន្ថែមមុខវិជ្ជាថ្មីដោយផ្ទាល់) បន្ទាប់មកបញ្ចូលឯកសារ PDF ទៅកាន់ប្រព័ន្ធ។
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-black bg-slate-100'
                : file
                ? 'border-slate-300 bg-slate-50'
                : 'border-slate-300 hover:border-black bg-slate-50/50 hover:bg-slate-100/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-2 text-black">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                </div>
                <p className="font-normal text-black text-sm">{file.name}</p>
                <p className="text-xs text-slate-500 font-normal">{(file.size / (1024 * 1024)).toFixed(2)} MB PDF selected · ចុចដើម្បីប្តូរឯកសារ</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-black border border-slate-200 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-normal text-slate-700">ទម្លាក់ឯកសារ PDF នៅទីនេះ ឬ <span className="text-black underline underline-offset-2">ជ្រើសរើសឯកសារ</span></p>
                <p className="text-[11px] text-slate-400 font-normal">ទម្រង់ដែលអាចបញ្ចូលបាន: PDF រហូតដល់ 50MB</p>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Paper Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">ចំណងជើងវិញ្ញាសា *</label>
              <input
                type="text"
                placeholder="ឧ. វិញ្ញាសាគណិតវិទ្យា ឆ្នាំ២០២៤"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>

            {/* 2. Target Exam Filter (Exam Level) */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">កម្រិតប្រឡង *</label>
              <select
                value={selectedExamId}
                onChange={e => {
                  const examId = e.target.value;
                  setSelectedExamId(examId);
                  setForm(f => ({ ...f, subjectId: '' }));
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="">ជ្រើសរើសកម្រិតប្រឡង (ទាំងអស់)...</option>
                {exams.map(e => (
                  <option key={e.examId} value={e.examId}>
                    {e.examName}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Target Subject (with '+ Add New Subject' at bottom) */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">មុខវិជ្ជា *</label>
              <select
                value={form.subjectId}
                onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              >
                <option value="">ជ្រើសរើសមុខវិជ្ជា...</option>
                {subjects.map(s => (
                  <option key={s.subjectId} value={s.subjectId}>
                    {s.subjectName}
                  </option>
                ))}
                {/* Add New Subject Option at the bottom */}
                <option value="__new__" className="font-semibold text-black bg-slate-100">
                  ➕ បន្ថែមមុខវិជ្ជាថ្មី... (+ Add New Subject)
                </option>
              </select>
            </div>

            {/* 3.1 Inline Input when '__new__' is chosen */}
            {form.subjectId === '__new__' && (
              <div className="space-y-2 sm:col-span-2 p-4 bg-slate-50/80 border border-slate-200 rounded-2xl animate-fadeIn">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-black" />
                  <label className="text-xs font-normal text-black uppercase tracking-wider">
                    ឈ្មោះមុខវិជ្ជាថ្មីដែលចង់បន្ថែម * (New Subject Name)
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="ឧ. ចំណេះដឹងទូទៅ (General Knowledge)"
                  value={newSubjectName}
                  onChange={e => setNewSubjectName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal shadow-2xs"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 font-normal">
                  មុខវិជ្ជាថ្មីនេះនឹងត្រូវបានបង្កើត និងរក្សាទុកក្នុងប្រព័ន្ធដោយស្វ័យប្រវត្តិ។
                </p>
              </div>
            )}

            {/* 4. Exam Year */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">ឆ្នាំប្រឡង *</label>
              <input
                type="number"
                min="2000"
                max="2099"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>

            {/* 5. Paper Type */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">ប្រភេទវិញ្ញាសា</label>
              <select
                value={form.paperType}
                onChange={e => setForm(f => ({ ...f, paperType: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="past-paper">វិញ្ញាសាចាស់ៗ</option>
                <option value="prepare-paper">វិញ្ញាសាត្រៀម</option>
                <option value="mock-exam">ប្រឡងសាកល្បង</option>
                <option value="practice">លំហាត់អនុវត្ត</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.hasAnswerKey}
                  onChange={e => setForm(f => ({ ...f, hasAnswerKey: e.target.checked }))}
                  className="w-4 h-4 rounded text-black border-slate-300 focus:ring-black"
                />
                <span className="text-xs sm:text-sm font-normal text-slate-700">មានចម្លើយ និងដំណោះស្រាយ</span>
              </label>
            </div>
          </div>

          {/* Status Alerts */}
          {(uploadError || localError) && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs sm:text-sm flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{localError || uploadError}</span>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs sm:text-sm flex items-center justify-between font-normal">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>បានបញ្ចូលវិញ្ញាសាដោយជោគជ័យ!</span>
              </div>
              <button
                type="button"
                onClick={onGoToLibrary}
                className="text-black font-normal underline hover:no-underline cursor-pointer"
              >
                ទៅកាន់បណ្ណាល័យវិញ្ញាសា →
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isCreatingSubject || uploadStatus === 'uploading-storage' || uploadStatus === 'saving-db'}
              className="px-6 py-2.5 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs sm:text-sm font-normal shadow-2xs transition flex items-center gap-2 cursor-pointer"
            >
              {isCreatingSubject || uploadStatus === 'uploading-storage' || uploadStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>
                    {isCreatingSubject
                      ? 'កំពុងបង្កើតមុខវិជ្ជាថ្មី...'
                      : uploadStatus === 'uploading-storage'
                      ? 'កំពុងបញ្ចូលឯកសារ PDF...'
                      : 'កំពុងរក្សាទុកក្នុងប្រព័ន្ធ...'}
                  </span>
                </>
              ) : (
                <span>រក្សាទុក និងផ្សព្វផ្សាយវិញ្ញាសា</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
