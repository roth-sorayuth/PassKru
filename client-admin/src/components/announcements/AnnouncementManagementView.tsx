import React, { useState } from 'react';
import { Announcement, ExamTargetLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Pin, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar, 
  FileText, 
  Send, 
  X,
  AlertCircle
} from 'lucide-react';

interface AnnouncementManagementViewProps {
  announcements: Announcement[];
  onCreateAnnouncement: (ann: Omit<Announcement, 'id' | 'viewsCount'>) => void;
  onUpdateAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onTogglePin: (id: string) => void;
  showEnglishLabels: boolean;
}

export const AnnouncementManagementView: React.FC<AnnouncementManagementViewProps> = ({
  announcements,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onTogglePin,
  showEnglishLabels,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [previewingAnnouncement, setPreviewingAnnouncement] = useState<Announcement | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: '',
  });

  // Form
  const [formState, setFormState] = useState<{
    referenceNumber: string;
    title: string;
    summary: string;
    content: string;
    category: 'EXAM_DATE' | 'REGISTRATION' | 'RESULT' | 'REGULATION' | 'GENERAL';
    priority: 'URGENT' | 'IMPORTANT' | 'NORMAL';
    status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
    publishDate: string;
    isPinned: boolean;
    targetAudience: ExamTargetLevel[] | 'ALL';
    attachmentName: string;
    author: string;
  }>({
    referenceNumber: 'សេចក្តីជូនដំណឹងលេខ ',
    title: '',
    summary: '',
    content: '',
    category: 'EXAM_DATE',
    priority: 'URGENT',
    status: 'PUBLISHED',
    publishDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    isPinned: false,
    targetAudience: 'ALL',
    attachmentName: 'Circular_MoEYS_Official.pdf',
    author: 'ក្រសួងអប់រំ យុវជន និងកីឡា / MoEYS',
  });

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setFormState({
      referenceNumber: 'សេចក្តីជូនដំណឹងលេខ ',
      title: '',
      summary: '',
      content: '',
      category: 'EXAM_DATE',
      priority: 'IMPORTANT',
      status: 'PUBLISHED',
      publishDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      isPinned: false,
      targetAudience: 'ALL',
      attachmentName: '',
      author: 'រដ្ឋបាល PassKru',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setFormState({
      referenceNumber: ann.referenceNumber || '',
      title: ann.title,
      summary: ann.summary,
      content: ann.content,
      category: ann.category,
      priority: ann.priority,
      status: ann.status,
      publishDate: ann.publishDate,
      isPinned: ann.isPinned,
      targetAudience: ann.targetAudience,
      attachmentName: ann.attachmentName || '',
      author: ann.author,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) return;

    if (editingAnnouncement) {
      onUpdateAnnouncement({
        ...editingAnnouncement,
        ...formState,
      });
    } else {
      onCreateAnnouncement(formState);
    }
    setIsModalOpen(false);
  };

  const filtered = announcements.filter((ann) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = ann.title.toLowerCase().includes(q) || ann.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== 'ALL' && ann.category !== selectedCategory) return false;
    if (selectedPriority !== 'ALL' && ann.priority !== selectedPriority) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            <span>ការគ្រប់គ្រងសេចក្តីជូនដំណឹង (Announcement Management)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            ផ្សព្វផ្សាយសេចក្តីជូនដំណឹងផ្លូវការរបស់ក្រសួងអប់រំ និងការណែនាំដល់បេក្ខជនប្រឡងគ្រូ
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតសេចក្តីជូនដំណឹងថ្មី</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកចំណងជើងសេចក្តីជូនដំណឹង..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl text-white placeholder-[#5A5E6B] focus:border-indigo-500/50 outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់ប្រភេទសេចក្តីជូនដំណឹង (ទាំងអស់)</option>
            <option value="EXAM_DATE">កាលបរិច្ឆេទប្រឡង (Exam Date)</option>
            <option value="REGISTRATION">ការចុះឈ្មោះ និងឯកសារ (Registration)</option>
            <option value="RESULT">លទ្ធផលប្រឡង (Results)</option>
            <option value="REGULATION">បទប្បញ្ញត្តិ & គោលការណ៍ (Regulations)</option>
            <option value="GENERAL">ព័ត៌មានទូទៅ (General)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
          >
            <option value="ALL">គ្រប់កម្រិតអាទិភាព (ទាំងអស់)</option>
            <option value="URGENT">បន្ទាន់ (Urgent)</option>
            <option value="IMPORTANT">សំខាន់ (Important)</option>
            <option value="NORMAL">ធម្មតា (Normal)</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="រកមិនឃើញសេចក្តីជូនដំណឹងទេ"
          description="មិនមានសេចក្តីជូនដំណឹងដែលត្រូវនឹងការស្វែងរកឡើយ។"
          actionText="បង្កើតសេចក្តីជូនដំណឹងថ្មី"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((ann) => (
            <div
              key={ann.id}
              className={`bg-[#111317] rounded-2xl border p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                ann.isPinned ? 'border-amber-500/30 bg-amber-500/5 ring-1 ring-amber-500/20' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {ann.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      <Pin className="w-3 h-3 fill-amber-400" />
                      <span>បានខ្ទាស់ (Pinned)</span>
                    </span>
                  )}
                  <StatusBadge status={ann.priority} size="sm" />
                  <StatusBadge status={ann.status} size="sm" />
                  {ann.referenceNumber && (
                    <span className="text-[11px] font-semibold text-[#8E929E] bg-[#0D0F12] border border-white/5 px-2 py-0.5 rounded-md">
                      {ann.referenceNumber}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{ann.title}</h3>
                <p className="text-xs text-[#8E929E] line-clamp-2 leading-relaxed">{ann.summary}</p>

                <div className="flex items-center gap-4 text-xs text-[#5A5E6B] pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.publishDate}
                  </span>
                  <span>អ្នកផ្សាយ៖ <strong className="text-[#C5C8D1]">{ann.author}</strong></span>
                  <span>👁️ {(ann.viewsCount ?? 0).toLocaleString()} ដង</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => onTogglePin(ann.id)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    ann.isPinned ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-[#0D0F12] text-[#8E929E] border-white/10 hover:bg-[#1A1D24] hover:text-white'
                  }`}
                  title={ann.isPinned ? 'ដោះខ្ទាស់' : 'ខ្ទាស់លើគេ'}
                >
                  <Pin className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPreviewingAnnouncement(ann)}
                  className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="មើលគំរូផ្សាយ"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenEdit(ann)}
                  className="p-2 bg-[#0D0F12] hover:bg-[#1A1D24] text-[#8E929E] hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="កែសម្រួល"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      id: ann.id,
                      title: ann.title,
                    })
                  }
                  className="p-2 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  title="លុប"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <h3 className="text-base font-bold text-white">
                {editingAnnouncement ? 'កែសម្រួលសេចក្តីជូនដំណឹង' : 'បង្កើតសេចក្តីជូនដំណឹងថ្មី'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">លេខលិខិតផ្លូវការ</label>
                  <input
                    type="text"
                    value={formState.referenceNumber}
                    onChange={(e) => setFormState({ ...formState, referenceNumber: e.target.value })}
                    placeholder="ឧ. សេចក្តីជូនដំណឹងលេខ ០៨ អយក.ប្រក"
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 text-white placeholder-[#5A5E6B]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">កម្រិតអាទិភាព *</label>
                  <select
                    value={formState.priority}
                    onChange={(e) => setFormState({ ...formState, priority: e.target.value as any })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 font-semibold text-[#E0E0E0]"
                  >
                    <option value="URGENT">បន្ទាន់ (Urgent - ជូនដំណឹងភ្លាមៗ)</option>
                    <option value="IMPORTANT">សំខាន់ (Important)</option>
                    <option value="NORMAL">ធម្មតា (Normal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ចំណងជើងសេចក្តីជូនដំណឹង *</label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="ឧ. សេចក្តីជូនដំណឹងស្តីពីកាលបរិច្ឆេទប្រឡងគ្រូ NIE ជំនាន់ទី ៣២..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 font-bold text-white placeholder-[#5A5E6B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">សេចក្តីសង្ខេប (Summary)</label>
                <textarea
                  value={formState.summary}
                  onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
                  rows={2}
                  placeholder="សេចក្តីសង្ខេបខ្លីសម្រាប់បង្ហាញលើទំព័រដើម..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 text-white placeholder-[#5A5E6B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">ខ្លឹមសារលម្អិត (Content) *</label>
                <textarea
                  required
                  value={formState.content}
                  onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                  rows={5}
                  placeholder="សរសេរខ្លឹមសារសេចក្តីជូនដំណឹងនៅទីនេះ..."
                  className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 leading-relaxed text-white placeholder-[#5A5E6B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ស្ថានភាពបោះពុម្ព</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-[#E0E0E0] focus:border-indigo-500/50"
                  >
                    <option value="PUBLISHED">ផ្សាយភ្លាមៗ (Published)</option>
                    <option value="DRAFT">រក្សាទុកជាព្រាង (Draft)</option>
                    <option value="SCHEDULED">កំណត់ពេលផ្សាយ (Scheduled)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#8E929E] mb-1">ឈ្មោះឯកសារភ្ជាប់ (PDF)</label>
                  <input
                    type="text"
                    value={formState.attachmentName}
                    onChange={(e) => setFormState({ ...formState, attachmentName: e.target.value })}
                    placeholder="Circular_Official.pdf"
                    className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-white placeholder-[#5A5E6B] focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={formState.isPinned}
                  onChange={(e) => setFormState({ ...formState, isPinned: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded-md cursor-pointer"
                />
                <label htmlFor="pinCheck" className="font-semibold text-[#8E929E] cursor-pointer">
                  ខ្ទាស់សេចក្តីជូនដំណឹងនេះនៅផ្នែកខាងលើគេបង្អស់ (Pin to Top)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8E929E] bg-[#1A1D24] hover:bg-[#222731] hover:text-white font-semibold rounded-xl cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingAnnouncement ? 'រក្សាទុកការកែប្រែ' : 'បោះពុម្ពសេចក្តីជូនដំណឹង'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-[#E0E0E0]">
            <div className="flex items-start justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <StatusBadge status={previewingAnnouncement.priority} size="sm" />
                {previewingAnnouncement.referenceNumber && (
                  <span className="text-xs text-[#8E929E] font-semibold bg-[#0D0F12] border border-white/5 px-2 py-0.5 rounded-md">
                    {previewingAnnouncement.referenceNumber}
                  </span>
                )}
              </div>
              <button onClick={() => setPreviewingAnnouncement(null)} className="text-[#8E929E] hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <h3 className="text-lg font-bold text-white leading-snug">{previewingAnnouncement.title}</h3>
              <div className="text-xs text-[#5A5E6B] flex items-center gap-3">
                <span>កាលបរិច្ឆេទ៖ {previewingAnnouncement.publishDate}</span>
                <span>អ្នកផ្សាយ៖ {previewingAnnouncement.author}</span>
              </div>

              <div className="p-4 bg-[#0D0F12] rounded-2xl border border-white/5 text-xs text-[#E0E0E0] whitespace-pre-line leading-relaxed">
                {previewingAnnouncement.content}
              </div>

              {previewingAnnouncement.attachmentName && (
                <div className="flex items-center justify-between p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>{previewingAnnouncement.attachmentName}</span>
                  </div>
                  <span className="text-[11px] text-indigo-400 font-bold hover:underline cursor-pointer">
                    ទាញយក PDF
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                onClick={() => setPreviewingAnnouncement(null)}
                className="px-4 py-2 bg-[#1A1D24] hover:bg-[#222731] text-white font-semibold rounded-xl text-xs cursor-pointer border border-white/10"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
        onConfirm={() => {
          onDeleteAnnouncement(deleteModal.id);
          setDeleteModal({ isOpen: false, id: '', title: '' });
        }}
        title="លុបសេចក្តីជូនដំណឹង"
        description={`តើអ្នកប្រាកដជាចង់លុប "${deleteModal.title}" មែនទេ?`}
        confirmText="លុបចោល"
        isDestructive={true}
      />
    </div>
  );
};
