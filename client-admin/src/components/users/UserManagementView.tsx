import React, { useState, useMemo } from 'react';
import { User, UserRole, UserStatus, ExamTargetLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmModal } from '../common/ConfirmModal';
import { EmptyState } from '../common/EmptyState';
import { Pagination } from '../common/Pagination';
import { SUBJECT_LABELS, EXAM_LEVEL_LABELS } from '../../data/mockData';
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap, 
  ShieldCheck, 
  Eye, 
  Ban, 
  CheckCircle, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  BookOpen, 
  Flame, 
  FileCheck,
  Download,
  AlertCircle
} from 'lucide-react';

interface UserManagementViewProps {
  users: User[];
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  onVerifyMentor: (mentorId: string, isApproved: boolean, notes?: string) => void;
  showEnglishLabels: boolean;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onUpdateUserStatus,
  onVerifyMentor,
  showEnglishLabels,
}) => {
  const [activeTab, setActiveTab] = useState<'CANDIDATE' | 'MENTOR'>('CANDIDATE');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [selectedTargetExam, setSelectedTargetExam] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  
  // Status change modal state
  const [confirmStatusModal, setConfirmStatusModal] = useState<{
    isOpen: boolean;
    userId: string;
    targetStatus: UserStatus;
    userName: string;
  }>({
    isOpen: false,
    userId: '',
    targetStatus: 'ACTIVE',
    userName: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (u.role !== activeTab) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = u.nameKhmer.toLowerCase().includes(query) || u.nameLatin.toLowerCase().includes(query);
        const matchesContact = u.phone.includes(query) || u.email.toLowerCase().includes(query);
        if (!matchesName && !matchesContact) return false;
      }

      if (selectedProvince !== 'ALL' && u.province !== selectedProvince) {
        return false;
      }

      if (selectedTargetExam !== 'ALL' && u.targetExam !== selectedTargetExam) {
        return false;
      }

      if (selectedStatus !== 'ALL' && u.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [users, activeTab, searchQuery, selectedProvince, selectedTargetExam, selectedStatus]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const candidatesCount = users.filter((u) => u.role === 'CANDIDATE').length;
  const mentorsCount = users.filter((u) => u.role === 'MENTOR').length;
  const pendingMentorsCount = users.filter((u) => u.role === 'MENTOR' && u.status === 'PENDING_VERIFICATION').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>ការគ្រប់គ្រងអ្នកប្រើប្រាស់ (User Management)</span>
          </h2>
          <p className="text-xs text-[#8E929E] mt-1">
            ចាត់ចែងគណនីបេក្ខជនប្រឡងគ្រូ និងផ្ទៀងផ្ទាត់សញ្ញាបត្រគរុកោសល្យរបស់គ្រូបង្វឹក
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center p-1 bg-[#0D0F12] rounded-xl border border-white/5">
          <button
            onClick={() => {
              setActiveTab('CANDIDATE');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CANDIDATE'
                ? 'bg-[#1A1D24] text-white shadow-xs border border-white/10'
                : 'text-[#8E929E] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>បេក្ខជនប្រឡង ({candidatesCount})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('MENTOR');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
              activeTab === 'MENTOR'
                ? 'bg-[#1A1D24] text-white shadow-xs border border-white/10'
                : 'text-[#8E929E] hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>គ្រូបង្វឹក & សាស្ត្រាចារ្យ ({mentorsCount})</span>
            {pendingMentorsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111317] p-4 rounded-2xl border border-white/5 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5E6B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#0D0F12] border border-white/10 text-white placeholder-[#5A5E6B] rounded-xl focus:border-indigo-500/50 outline-none"
            />
          </div>

          {/* Province Filter */}
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
            >
              <option value="ALL">គ្រប់រាជធានី-ខេត្ត (ទាំងអស់)</option>
              <option value="រាជធានីភ្នំពេញ">រាជធានីភ្នំពេញ</option>
              <option value="ខេត្តកណ្ដាល">ខេត្តកណ្ដាល</option>
              <option value="ខេត្តសៀមរាប">ខេត្តសៀមរាប</option>
              <option value="ខេត្តបាត់ដំបង">ខេត្តបាត់ដំបង</option>
              <option value="ខេត្តកំពង់ចាម">ខេត្តកំពង់ចាម</option>
              <option value="ខេត្តតាកែវ">ខេត្តតាកែវ</option>
            </select>
          </div>

          {/* Target Exam Filter (for Candidates) */}
          {activeTab === 'CANDIDATE' ? (
            <div>
              <select
                value={selectedTargetExam}
                onChange={(e) => {
                  setSelectedTargetExam(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
              >
                <option value="ALL">គ្រប់កម្រិតប្រឡង (ទាំងអស់)</option>
                <option value="NIE_HIGH_SCHOOL">គ្រូវិទ្យាល័យ (NIE)</option>
                <option value="BASIC_SECONDARY">គ្រូអនុវិទ្យាល័យ</option>
                <option value="PRIMARY_SCHOOL">គ្រូបឋមសិក្សា</option>
              </select>
            </div>
          ) : (
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
              >
                <option value="ALL">ស្ថានភាពផ្ទៀងផ្ទាត់ (ទាំងអស់)</option>
                <option value="ACTIVE">បានផ្ទៀងផ្ទាត់រួច (Active)</option>
                <option value="PENDING_VERIFICATION">រង់ចាំការផ្ទៀងផ្ទាត់ (Pending)</option>
                <option value="SUSPENDED">ផ្អាកបណ្តោះអាសន្ន</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-[#0D0F12] border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-[#E0E0E0]"
            >
              <option value="ALL">គ្រប់ស្ថានភាពគណនី</option>
              <option value="ACTIVE">សកម្ម (Active)</option>
              <option value="SUSPENDED">ផ្អាក (Suspended)</option>
              <option value="PENDING_VERIFICATION">រង់ចាំផ្ទៀងផ្ទាត់</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111317] rounded-2xl border border-white/5 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="រកមិនឃើញទិន្នន័យអ្នកប្រើប្រាស់ទេ"
            description="សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬជ្រើសរើសជម្រើសចម្រោះផ្សេងទៀត។"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0D0F12] border-b border-white/5 text-[11px] font-bold text-[#8E929E] uppercase tracking-wider">
                  <th className="px-5 py-3.5">អ្នកប្រើប្រាស់</th>
                  <th className="px-4 py-3.5">ទំនាក់ទំនង & ទីតាំង</th>
                  {activeTab === 'CANDIDATE' ? (
                    <>
                      <th className="px-4 py-3.5">កម្រិតប្រឡងគោលដៅ</th>
                      <th className="px-4 py-3.5 text-center">លទ្ធផល & សកម្មភាព</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3.5">កម្រិតសញ្ញាបត្រ & កន្លែងការងារ</th>
                      <th className="px-4 py-3.5">ឯកទេសបង្រៀន</th>
                    </>
                  )}
                  <th className="px-4 py-3.5">ស្ថានភាព</th>
                  <th className="px-5 py-3.5 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-[#C5C8D1]">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    {/* User Profile */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.nameKhmer}
                            className="w-9 h-9 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                            {user.nameKhmer.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white">{user.nameKhmer}</p>
                          <p className="text-[11px] text-[#8E929E]">{user.nameLatin}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Province */}
                    <td className="px-4 py-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[#E0E0E0]">
                        <Phone className="w-3.5 h-3.5 text-[#5A5E6B]" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#8E929E] text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#5A5E6B]" />
                        <span>{user.province}</span>
                      </div>
                    </td>

                    {/* Specific Data Columns */}
                    {activeTab === 'CANDIDATE' ? (
                      <>
                        <td className="px-4 py-3.5">
                          {user.targetExam && (
                            <span className="font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md text-[11px]">
                              {EXAM_LEVEL_LABELS[user.targetExam]?.shortKm || user.targetExam}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="inline-flex items-center gap-3">
                            <span className="text-[#8E929E]" title="កម្រងសំណួរដែលបានធ្វើ">
                              📝 <strong className="text-white">{user.completedQuizzesCount || 0}</strong>
                            </span>
                            <span className="text-amber-400 font-semibold" title="ថ្ងៃជាប់ៗគ្នា">
                              🔥 <strong>{user.studyStreakDays || 0}</strong> ថ្ងៃ
                            </span>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3.5 space-y-0.5">
                          <p className="font-semibold text-white line-clamp-1">{user.mentorDegree}</p>
                          <p className="text-[11px] text-[#8E929E]">{user.mentorWorkplace}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {user.mentorSpecialty?.map((s) => (
                              <span
                                key={s}
                                className={`text-[10px] px-1.5 py-0.5 rounded-md border ${
                                  SUBJECT_LABELS[s]?.color || 'bg-white/5 border-white/10 text-white'
                                }`}
                              >
                                {SUBJECT_LABELS[s]?.km || s}
                              </span>
                            ))}
                          </div>
                        </td>
                      </>
                    )}

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={user.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-[#8E929E] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="មើលព័ត៌មានលម្អិត"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {user.role === 'MENTOR' && user.status === 'PENDING_VERIFICATION' && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsVerifyModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>ផ្ទៀងផ្ទាត់</span>
                          </button>
                        )}

                        {user.status === 'ACTIVE' ? (
                          <button
                            onClick={() =>
                              setConfirmStatusModal({
                                isOpen: true,
                                userId: user.id,
                                targetStatus: 'SUSPENDED',
                                userName: user.nameKhmer,
                              })
                            }
                            className="p-1.5 text-[#8E929E] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="ផ្អាកគណនី"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setConfirmStatusModal({
                                isOpen: true,
                                userId: user.id,
                                targetStatus: 'ACTIVE',
                                userName: user.nameKhmer,
                              })
                            }
                            className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                            title="បើកដំណើរការគណនីឡើងវិញ"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* User Details Drawer Modal */}
      {selectedUser && !isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto text-[#E0E0E0]">
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                {selectedUser.avatarUrl ? (
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.nameKhmer}
                    className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-lg border border-indigo-500/30">
                    {selectedUser.nameKhmer.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.nameKhmer}</h3>
                  <p className="text-xs text-[#8E929E]">{selectedUser.nameLatin} • {selectedUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-[#8E929E] hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#0D0F12] p-3.5 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">លេខទូរស័ព្ទ</span>
                  <span className="font-semibold text-white">{selectedUser.phone}</span>
                </div>
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">អ៊ីមែល</span>
                  <span className="font-semibold text-white">{selectedUser.email}</span>
                </div>
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">រាជធានី-ខេត្ត</span>
                  <span className="font-semibold text-white">{selectedUser.province}</span>
                </div>
                <div>
                  <span className="text-[#5A5E6B] block text-[10px]">កាលបរិច្ឆេទចុះឈ្មោះ</span>
                  <span className="font-semibold text-white">{selectedUser.registeredDate}</span>
                </div>
              </div>

              {selectedUser.role === 'CANDIDATE' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-white">ព័ត៌មានការរៀន និងលទ្ធផលប្រឡង</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <span className="text-[10px] text-indigo-400 font-medium">កម្រងសំណួរ</span>
                      <p className="text-base font-black text-indigo-300 mt-0.5">{selectedUser.completedQuizzesCount || 0}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <span className="text-[10px] text-emerald-400 font-medium">ពិន្ទុសាកល្បង</span>
                      <p className="text-base font-black text-emerald-300 mt-0.5">{selectedUser.mockExamAverageScore || 0}%</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      <span className="text-[10px] text-amber-400 font-medium">Streak រៀន</span>
                      <p className="text-base font-black text-amber-300 mt-0.5">{selectedUser.studyStreakDays || 0} ថ្ងៃ</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.role === 'MENTOR' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-white">ព័ត៌មានវិជ្ជាជីវៈ និងសញ្ញាបត្រគរុកោសល្យ</h4>
                  <div className="p-3 bg-[#0D0F12] rounded-xl border border-white/5 space-y-1.5">
                    <div>
                      <span className="text-[#5A5E6B] text-[10px]">កម្រិតសញ្ញាបត្រ៖</span>
                      <p className="font-semibold text-white">{selectedUser.mentorDegree}</p>
                    </div>
                    <div>
                      <span className="text-[#5A5E6B] text-[10px]">កន្លែងបម្រើការងារបច្ចុប្បន្ន៖</span>
                      <p className="font-semibold text-white">{selectedUser.mentorWorkplace}</p>
                    </div>
                  </div>

                  {selectedUser.mentorVerificationDocUrl && (
                    <div className="p-3 bg-[#0D0F12] rounded-xl border border-amber-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-amber-400">ឯកសារបញ្ជាក់សញ្ញាបត្រដែលបានភ្ជាប់</span>
                        <a
                          href={selectedUser.mentorVerificationDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 font-bold flex items-center gap-1 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>មើលច្បាប់ដើម</span>
                        </a>
                      </div>
                      <img
                        src={selectedUser.mentorVerificationDocUrl}
                        alt="Verification Doc"
                        className="w-full h-36 object-cover rounded-lg border border-white/10 shadow-xs"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-semibold text-[#8E929E] hover:text-white bg-[#1A1D24] hover:bg-[#222731] rounded-xl border border-white/5 cursor-pointer"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Verification Action Modal */}
      {selectedUser && isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#111317] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>ផ្ទៀងផ្ទាត់គណនីគ្រូបង្វឹក ({selectedUser.nameKhmer})</span>
              </div>
              <button
                onClick={() => {
                  setIsVerifyModalOpen(false);
                  setSelectedUser(null);
                }}
                className="text-[#8E929E] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <p className="text-[#C5C8D1]">
                សូមពិនិត្យសញ្ញាបត្រគរុកោសល្យ និងប្រវត្តិរូបរបស់ <strong>{selectedUser.nameKhmer}</strong> មុននឹងអនុម័តផ្តល់សិទ្ធិជាគ្រូបង្វឹកផ្លូវការលើ PassKru។
              </p>

              {selectedUser.mentorVerificationDocUrl && (
                <div className="p-3 bg-[#0D0F12] rounded-xl border border-white/10">
                  <span className="font-semibold text-[#8E929E] block mb-1.5">រូបភាពសញ្ញាបត្រ/លិខិតបញ្ជាក់៖</span>
                  <img
                    src={selectedUser.mentorVerificationDocUrl}
                    alt="Certificate"
                    className="w-full h-40 object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#8E929E] mb-1">
                  កំណត់សម្គាល់រដ្ឋបាល (Admin Review Notes)
                </label>
                <textarea
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="ឧ. បានផ្ទៀងផ្ទាត់សញ្ញាបត្រ NIE ជំនាន់ ២៨ ត្រឹមត្រូវ..."
                  rows={3}
                  className="w-full p-2.5 text-xs bg-[#0D0F12] border border-white/10 text-white rounded-xl outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  onVerifyMentor(selectedUser.id, false, verifyNotes);
                  setIsVerifyModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl cursor-pointer"
              >
                បដិសេធ (Reject)
              </button>
              <button
                onClick={() => {
                  onVerifyMentor(selectedUser.id, true, verifyNotes);
                  setIsVerifyModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xs cursor-pointer"
              >
                អនុម័តផ្ទៀងផ្ទាត់ (Approve Mentor)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for user suspension/activation */}
      <ConfirmModal
        isOpen={confirmStatusModal.isOpen}
        onClose={() => setConfirmStatusModal({ ...confirmStatusModal, isOpen: false })}
        onConfirm={() => {
          onUpdateUserStatus(confirmStatusModal.userId, confirmStatusModal.targetStatus);
          setConfirmStatusModal({ ...confirmStatusModal, isOpen: false });
        }}
        title={confirmStatusModal.targetStatus === 'SUSPENDED' ? 'ផ្អាកដំណើរការគណនី' : 'បើកដំណើរការគណនី'}
        description={`តើអ្នកប្រាកដជាចង់ ${
          confirmStatusModal.targetStatus === 'SUSPENDED' ? 'ផ្អាកគណនីរបស់' : 'បើកដំណើរការគណនីឡើងវិញសម្រាប់'
        } ${confirmStatusModal.userName} មែនទេ?`}
        confirmText="យល់ព្រម"
        isDestructive={confirmStatusModal.targetStatus === 'SUSPENDED'}
      />
    </div>
  );
};
