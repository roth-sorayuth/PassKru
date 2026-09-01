import React, { useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Subject, UploadStatus } from '../../types';

interface UploadPaperTabProps {
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
  onSubmit: (e: React.FormEvent) => void;
  onGoToLibrary: () => void;
}

export const UploadPaperTab: React.FC<UploadPaperTabProps> = ({
  subjects,
  file,
  setFile,
  form,
  setForm,
  uploadStatus,
  uploadError,
  onSubmit,
  onGoToLibrary,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-[#0f3360]">Upload Exam Past Paper</h2>
          <p className="text-sm text-slate-500 mt-1">
            Select an exam subject, upload the official PDF question paper, and publish it to the database.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[#0a3263] bg-[#eef4fc]'
                : file
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-slate-300 hover:border-[#0a3263] bg-slate-50/50 hover:bg-[#eef4fc]/40'
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
              <div className="flex flex-col items-center gap-2 text-emerald-800">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-800 text-sm sm:text-base">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB PDF selected · Click to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#eef4fc] text-[#0a3263] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Drag & drop your PDF here, or <span className="text-[#0a3263] underline underline-offset-2">browse file</span></p>
                <p className="text-xs text-slate-400">Supported format: PDF up to 50MB</p>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Paper Title *</label>
              <input
                type="text"
                placeholder="e.g. វិញ្ញាសាគណិតវិទ្យា ២០២៤ (Mathematics State Exam 2024)"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/20 focus:border-[#0a3263]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Subject *</label>
              <select
                value={form.subjectId}
                onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/20 focus:border-[#0a3263]"
                required
              >
                <option value="">Select subject...</option>
                {subjects.map(s => (
                  <option key={s.subjectId} value={s.subjectId}>
                    {s.subjectName} {s.exam ? `(${s.exam.examName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Exam Year *</label>
              <input
                type="number"
                min="2000"
                max="2099"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/20 focus:border-[#0a3263]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Paper Type</label>
              <select
                value={form.paperType}
                onChange={e => setForm(f => ({ ...f, paperType: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/20 focus:border-[#0a3263]"
              >
                <option value="past-paper">Official Past Paper</option>
                <option value="mock-exam">Mock Exam</option>
                <option value="prepare-paper">Prepare Paper</option>
                <option value="practice">Practice Exercise</option>
                <option value="solution-only">Solution Sheet</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Questions</label>
              <input
                type="number"
                placeholder="Optional (e.g. 50)"
                value={form.totalQuestions}
                onChange={e => setForm(f => ({ ...f, totalQuestions: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a3263]/20 focus:border-[#0a3263]"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.hasAnswerKey}
                  onChange={e => setForm(f => ({ ...f, hasAnswerKey: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#0a3263] border-slate-300 focus:ring-[#0a3263]"
                />
                <span className="text-sm font-medium text-slate-700">Includes complete answer key & solutions</span>
              </label>
            </div>
          </div>

          {/* Status Alerts */}
          {uploadError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Paper uploaded and published successfully!</span>
              </div>
              <button
                type="button"
                onClick={onGoToLibrary}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                View in Library →
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={uploadStatus === 'uploading-storage' || uploadStatus === 'saving-db'}
              className="w-full sm:w-auto px-8 py-3 bg-[#0a3263] hover:bg-[#0f3360] disabled:bg-slate-300 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              {uploadStatus === 'uploading-storage' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading to Storage...
                </>
              ) : uploadStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving to Database...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload & Publish Paper
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
