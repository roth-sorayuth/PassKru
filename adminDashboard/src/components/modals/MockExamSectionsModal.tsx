import React, { useEffect, useState } from 'react';
import { X, AlertCircle, Loader2, Plus, Trash2, ListChecks } from 'lucide-react';
import { MockExamAdminDetail, MockExamAdminItem, Subject } from '../../types';
import { mockExamService } from '../../services/mockExamService';
import { QuestionPickerModal } from './QuestionPickerModal';

interface MockExamSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mockExam: MockExamAdminItem | null;
  subjects: Subject[];
  onChanged: () => void; // called after any mutation so the parent list (totals) can refresh
}

export const MockExamSectionsModal: React.FC<MockExamSectionsModalProps> = ({
  isOpen,
  onClose,
  mockExam,
  subjects,
  onChanged,
}) => {
  const [detail, setDetail] = useState<MockExamAdminDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newSectionCount, setNewSectionCount] = useState('10');
  const [adding, setAdding] = useState(false);
  const [sectionEdits, setSectionEdits] = useState<Record<number, string>>({});
  const [savingSectionId, setSavingSectionId] = useState<number | null>(null);
  const [pickerSectionId, setPickerSectionId] = useState<number | null>(null);

  const loadDetail = async () => {
    if (!mockExam) return;
    setLoading(true);
    setError('');
    try {
      const data = await mockExamService.getMockExam(mockExam.mockExamId);
      setDetail(data);
      setSectionEdits(
        Object.fromEntries((data.sections || []).map((s) => [s.sectionId, String(s.numberOfQuestions ?? 0)]))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load mock exam sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mockExam) {
      loadDetail();
      setNewSubjectId('');
      setNewSectionCount('10');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mockExam?.mockExamId]);

  if (!isOpen || !mockExam) return null;

  const handleAddSection = async () => {
    if (!newSubjectId) return;
    setAdding(true);
    setError('');
    try {
      await mockExamService.addSection(mockExam.mockExamId, {
        subjectId: Number(newSubjectId),
        numberOfQuestions: Number(newSectionCount) || 0,
      });
      setNewSubjectId('');
      setNewSectionCount('10');
      await loadDetail();
      onChanged();
    } catch (err: any) {
      setError(err.message || 'Failed to add section');
    } finally {
      setAdding(false);
    }
  };

  const handleSaveSectionCount = async (sectionId: number) => {
    const value = Number(sectionEdits[sectionId]);
    if (isNaN(value) || value < 0) return;
    setSavingSectionId(sectionId);
    setError('');
    try {
      await mockExamService.updateSection(mockExam.mockExamId, sectionId, value);
      await loadDetail();
      onChanged();
    } catch (err: any) {
      setError(err.message || 'Failed to update section');
    } finally {
      setSavingSectionId(null);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!window.confirm('Remove this section and its assigned questions?')) return;
    setError('');
    try {
      await mockExamService.deleteSection(mockExam.mockExamId, sectionId);
      await loadDetail();
      onChanged();
    } catch (err: any) {
      setError(err.message || 'Failed to delete section');
    }
  };

  const activeSection = detail?.sections.find((s) => s.sectionId === pickerSectionId) || null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
        <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <h2 className="text-base font-normal text-black">Manage Sections</h2>
              <p className="text-xs text-slate-500 font-normal">{mockExam.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {error && (
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-black text-xs flex items-center gap-2 font-normal">
                <AlertCircle className="w-4 h-4 shrink-0 text-black" />
                <span>{error}</span>
              </div>
            )}

            {/* Add Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-xs font-normal text-slate-700 uppercase tracking-wider">Add Section</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                >
                  <option value="">Select subject...</option>
                  {subjects.map((s) => (
                    <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={newSectionCount}
                  onChange={(e) => setNewSectionCount(e.target.value)}
                  placeholder="# Questions"
                  className="w-full sm:w-32 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                />
                <button
                  type="button"
                  onClick={handleAddSection}
                  disabled={!newSubjectId || adding}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal shadow-2xs transition cursor-pointer shrink-0"
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add
                </button>
              </div>
            </div>

            {/* Sections list */}
            {loading ? (
              <div className="flex items-center justify-center py-10 text-slate-400 text-sm font-normal gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading sections...
              </div>
            ) : !detail || detail.sections.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm font-normal">
                No sections yet. Add one above to start assigning questions.
              </div>
            ) : (
              <div className="space-y-2">
                {detail.sections.map((section) => (
                  <div key={section.sectionId} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-normal text-black">{section.subjectName || 'Unknown subject'}</p>
                        <p className="text-xs text-slate-500 font-normal">
                          {(section.questions?.length || 0)} question{(section.questions?.length || 0) !== 1 ? 's' : ''} assigned
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.sectionId)}
                        className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-xs font-normal text-slate-500 uppercase tracking-wider">Target Count:</label>
                      <input
                        type="number"
                        min={0}
                        value={sectionEdits[section.sectionId] ?? ''}
                        onChange={(e) =>
                          setSectionEdits((prev) => ({ ...prev, [section.sectionId]: e.target.value }))
                        }
                        className="w-24 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveSectionCount(section.sectionId)}
                        disabled={savingSectionId === section.sectionId}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-lg text-xs font-normal transition cursor-pointer"
                      >
                        {savingSectionId === section.sectionId ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPickerSectionId(section.sectionId)}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-black border border-slate-300 hover:border-black rounded-lg text-xs font-normal shadow-2xs transition cursor-pointer"
                      >
                        <ListChecks className="w-3.5 h-3.5" /> Assign Questions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <QuestionPickerModal
        isOpen={pickerSectionId !== null}
        onClose={() => setPickerSectionId(null)}
        subjectId={activeSection?.subjectId ?? null}
        subjectName={activeSection?.subjectName}
        initialSelectedIds={(activeSection?.questions || []).map((q) => q.questionId)}
        title="Assign Questions to Section"
        onSave={async (questionIds) => {
          if (!activeSection) return;
          await mockExamService.setSectionQuestions(mockExam.mockExamId, activeSection.sectionId, questionIds);
          await loadDetail();
          onChanged();
        }}
      />
    </>
  );
};
