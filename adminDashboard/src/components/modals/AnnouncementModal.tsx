import React, { useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Loader2, Calendar, MapPin, BookOpen } from 'lucide-react';
import { AnnouncementItem, Exam, UploadStatus } from '../../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAnnouncement: AnnouncementItem | null;
  exams: Exam[];
  announcementForm: {
    examId: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    isUrgent: boolean;
    aboutExamWhen: string;
    aboutExamWhere: string;
    aboutExamSubjects: string;
  };
  setAnnouncementForm: React.Dispatch<React.SetStateAction<{
    examId: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    isUrgent: boolean;
    aboutExamWhen: string;
    aboutExamWhere: string;
    aboutExamSubjects: string;
  }>>;
  announcementFile: File | null;
  setAnnouncementFile: (file: File | null) => void;
  announcementError: string;
  announcementSubmitStatus: UploadStatus;
  onSubmit: (e: React.FormEvent) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  editingAnnouncement,
  exams,
  announcementForm,
  setAnnouncementForm,
  announcementFile,
  setAnnouncementFile,
  announcementError,
  announcementSubmitStatus,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-normal">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-black rounded-3xl overflow-hidden flex flex-col z-10 font-normal">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base font-normal text-black">
              {editingAnnouncement ? 'កែសម្រួលសេចក្តីប្រកាស' : 'បង្កើតសេចក្តីប្រកាសថ្មី'}
            </h2>
            <p className="text-xs text-black font-normal">
              គ្រប់គ្រង និងផ្សព្វផ្សាយព័ត៌មានប្រឡងជូនបេក្ខជន
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:bg-black hover:text-white rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 font-normal">
          {announcementError && (
            <div className="p-3.5 rounded-2xl bg-white border border-black text-black text-xs flex items-center gap-2 font-normal">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{announcementError}</span>
            </div>
          )}

          {/* 1. Target Exam & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-normal text-black">គោលដៅប្រឡង (Target Exam) *</label>
              <select
                value={announcementForm.examId}
                onChange={e => setAnnouncementForm(f => ({ ...f, examId: e.target.value }))}
                className="w-full bg-white border border-black rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-black focus:outline-none focus:ring-1 focus:ring-black font-normal"
                required
              >
                <option value="">ជ្រើសរើសការប្រឡង...</option>
                {exams.map(e => (
                  <option key={e.examId} value={e.examId}>{e.examName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-black">ប្រភេទសេចក្តីប្រកាស (Category)</label>
              <select
                value={announcementForm.category}
                onChange={e => setAnnouncementForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-white border border-black rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-black focus:outline-none focus:ring-1 focus:ring-black font-normal"
              >
                <option value="recruitment">ជ្រើសរើសគ្រូ (Recruitment)</option>
                <option value="schedule">កាលវិភាគប្រឡង (Schedule)</option>
                <option value="eligibility">លក្ខខណ្ឌជ្រើសរើស (Eligibility)</option>
                <option value="guideline">សេចក្តីណែនាំ (Guideline)</option>
                <option value="result">លទ្ធផលប្រឡង (Result)</option>
              </select>
            </div>
          </div>

          {/* 2. Title */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-black">ចំណងជើងសេចក្តីប្រកាស (Title) *</label>
            <input
              type="text"
              placeholder="ឧ. សេចក្តីជូនដំណឹងស្តីពីការប្រឡងប្រជែងជ្រើសរើសគ្រូបង្រៀន..."
              value={announcementForm.title}
              onChange={e => setAnnouncementForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-white border border-black rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-black placeholder:text-black/60 focus:outline-none focus:ring-1 focus:ring-black font-normal"
              required
            />
          </div>

          {/* 3. About Exam (when, where, whatSubject) */}
          <div className="p-4 rounded-3xl border border-black bg-white space-y-3 font-normal">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-black" />
              <label className="text-xs font-normal text-black">ព័ត៌មានអំពីការប្រឡង (About Exam)</label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* When */}
              <div className="space-y-1">
                <label className="text-[11px] font-normal text-black flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-black" /> កាលបរិច្ឆេទ / ពេលវេលា (When)
                </label>
                <input
                  type="text"
                  placeholder="ឧ. ថ្ងៃទី ៣១ ខែធ្នូ ឆ្នាំ២០២៦ វេលាម៉ោង ០៨:០០ ព្រឹក"
                  value={announcementForm.aboutExamWhen}
                  onChange={e => setAnnouncementForm(f => ({ ...f, aboutExamWhen: e.target.value }))}
                  className="w-full bg-white border border-black rounded-xl px-3.5 py-2 text-xs text-black placeholder:text-black/60 focus:outline-none focus:ring-1 focus:ring-black font-normal"
                />
              </div>

              {/* Where */}
              <div className="space-y-1">
                <label className="text-[11px] font-normal text-black flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-black" /> ទីតាំង / មណ្ឌលប្រឡង (Where)
                </label>
                <input
                  type="text"
                  placeholder="ឧ. មណ្ឌលប្រឡងរាជធានីភ្នំពេញ / សាលាគរុកោសល្យ"
                  value={announcementForm.aboutExamWhere}
                  onChange={e => setAnnouncementForm(f => ({ ...f, aboutExamWhere: e.target.value }))}
                  className="w-full bg-white border border-black rounded-xl px-3.5 py-2 text-xs text-black placeholder:text-black/60 focus:outline-none focus:ring-1 focus:ring-black font-normal"
                />
              </div>
            </div>

            {/* What Subject */}
            <div className="space-y-1">
              <label className="text-[11px] font-normal text-black flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-black" /> មុខវិជ្ជាប្រឡង (What Subject to Exam)
              </label>
              <input
                type="text"
                placeholder="ឧ. ភាសាខ្មែរ, គណិតវិទ្យា, ចំណេះដឹងទូទៅ, គរុកោសល្យ"
                value={announcementForm.aboutExamSubjects}
                onChange={e => setAnnouncementForm(f => ({ ...f, aboutExamSubjects: e.target.value }))}
                className="w-full bg-white border border-black rounded-xl px-3.5 py-2 text-xs text-black placeholder:text-black/60 focus:outline-none focus:ring-1 focus:ring-black font-normal"
              />
            </div>
          </div>

          {/* 4. Summary */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-black">សេចក្តីសង្ខេប (Summary)</label>
            <textarea
              rows={2}
              placeholder="សង្ខេបខ្លឹមសារសំខាន់ៗនៃសេចក្តីប្រកាស..."
              value={announcementForm.summary}
              onChange={e => setAnnouncementForm(f => ({ ...f, summary: e.target.value }))}
              className="w-full bg-white border border-black rounded-2xl p-3 text-xs sm:text-sm text-black placeholder:text-black/60 focus:outline-none focus:ring-1 focus:ring-black font-normal"
            />
          </div>

          {/* 5. Content */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-black">ខ្លឹមសារលម្អិត (Content)</label>
            <textarea
              rows={4}
              placeholder="សេចក្តីលម្អិត ណែនាំ និងលក្ខខណ្ឌផ្សេងៗ..."
              value={announcementForm.content}
              onChange={e => setAnnouncementForm(f => ({ ...f, content: e.target.value }))}
              className="w-full bg-white border border-black rounded-2xl p-3 text-xs sm:text-sm text-black placeholder:text-black/60 focus:outline-none focus:ring-1 focus:ring-black font-normal"
            />
          </div>

          {/* 6. Attachments (PDF) */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-black">ឯកសារភ្ជាប់ផ្លូវការ PDF (Attachment PDF)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-black hover:bg-black hover:text-white group rounded-2xl p-4 text-center cursor-pointer transition"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={e => setAnnouncementFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {announcementFile ? (
                <div className="flex items-center justify-center gap-2 text-black group-hover:text-white text-xs font-normal">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{announcementFile.name} ({(announcementFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-black group-hover:text-white text-xs font-normal">
                  <Upload className="w-4 h-4" />
                  <span>ចុចដើម្បីបញ្ចូលឯកសារប្រកាសផ្លូវការជា PDF (ស្រេចចិត្ត)</span>
                </div>
              )}
            </div>
          </div>

          {/* 7. Is Urgent */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={announcementForm.isUrgent}
                onChange={e => setAnnouncementForm(f => ({ ...f, isUrgent: e.target.checked }))}
                className="w-4 h-4 rounded text-black border-black focus:ring-black accent-black"
              />
              <span className="text-xs font-normal text-black">កំណត់ជាសេចក្តីប្រកាសបន្ទាន់ (Mark as Urgent)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-black flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-black hover:text-white text-black border border-black rounded-2xl text-xs font-normal transition cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={announcementSubmitStatus === 'uploading-storage' || announcementSubmitStatus === 'saving-db'}
              className="px-5 py-2.5 bg-black hover:bg-white hover:text-black border border-black disabled:bg-white disabled:text-black/40 disabled:border-black/40 text-white rounded-2xl text-xs font-normal transition flex items-center gap-2 cursor-pointer"
            >
              {announcementSubmitStatus === 'uploading-storage' || announcementSubmitStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>កំពុងរក្សាទុក...</span>
                </>
              ) : (
                <span>{editingAnnouncement ? 'រក្សាទុកការកែប្រែ' : 'ផ្សព្វផ្សាយសេចក្តីប្រកាស'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
