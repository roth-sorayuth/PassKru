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
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="max-w-2xl mb-6">
          <h2 className="text-lg font-normal text-black">Upload Exam Past Paper</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Select an exam subject, upload the official PDF question paper, and publish it to the database.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
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
                <p className="text-xs text-slate-500 font-normal">{(file.size / (1024 * 1024)).toFixed(2)} MB PDF selected · Click to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-black border border-slate-200 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-normal text-slate-700">Drag & drop your PDF here, or <span className="text-black underline underline-offset-2">browse file</span></p>
                <p className="text-[11px] text-slate-400 font-normal">Supported format: PDF up to 50MB</p>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">Paper Title *</label>
              <input
                type="text"
                placeholder="e.g. វិញ្ញាសាគណិតវិទ្យា ២០២៤ (Mathematics State Exam 2024)"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">Target Subject *</label>
              <select
                value={form.subjectId}
                onChange={e => setForm(f => ({ ...f, subjectId: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
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

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">Exam Year *</label>
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

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">Paper Type</label>
              <select
                value={form.paperType}
                onChange={e => setForm(f => ({ ...f, paperType: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="past-paper">Official Past Paper</option>
                <option value="mock-exam">Mock Exam</option>
                <option value="prepare-paper">Prepare Paper</option>
                <option value="practice">Practice Exercise</option>
                <option value="solution-only">Solution Sheet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-600 uppercase tracking-wider">Total Questions</label>
              <input
                type="number"
                placeholder="Optional (e.g. 50)"
                value={form.totalQuestions}
                onChange={e => setForm(f => ({ ...f, totalQuestions: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>

            <div className="sm:col-span-2 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.hasAnswerKey}
                  onChange={e => setForm(f => ({ ...f, hasAnswerKey: e.target.checked }))}
                  className="w-4 h-4 rounded text-black border-slate-300 focus:ring-black"
                />
                <span className="text-xs sm:text-sm font-normal text-slate-700">Includes complete answer key & solutions</span>
              </label>
            </div>
          </div>

          {/* Status Alerts */}
          {uploadError && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs sm:text-sm flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs sm:text-sm flex items-center justify-between font-normal">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                <span>Paper uploaded and published successfully!</span>
              </div>
              <button
                type="button"
                onClick={onGoToLibrary}
                className="text-xs font-normal text-black underline hover:text-slate-700 cursor-pointer"
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
              className="px-4 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs sm:text-sm font-normal shadow-2xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              {uploadStatus === 'uploading-storage' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Uploading to Storage...</span>
                </>
              ) : uploadStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-slate-700" />
                  <span>Upload & Publish Paper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
