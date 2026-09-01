import React from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { UserItem, Exam, UploadStatus } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: UserItem | null;
  exams: Exam[];
  userForm: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    targetExamId: string;
    knowledgeLevel: string;
    dailyGoalMinutes: number;
  };
  setUserForm: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    targetExamId: string;
    knowledgeLevel: string;
    dailyGoalMinutes: number;
  }>>;
  userError: string;
  userSubmitStatus: UploadStatus;
  onSubmit: (e: React.FormEvent) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  editingUser,
  exams,
  userForm,
  setUserForm,
  userError,
  userSubmitStatus,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-normal text-black">
              {editingUser ? 'Edit User Profile' : 'Create New User'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Manage user credentials, roles, and target exam assignments
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {userError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{userError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">First Name *</label>
              <input
                type="text"
                placeholder="e.g. Sokha"
                value={userForm.firstName}
                onChange={e => setUserForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Last Name *</label>
              <input
                type="text"
                placeholder="e.g. Chan"
                value={userForm.lastName}
                onChange={e => setUserForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              placeholder="user@passkru.com"
              value={userForm.email}
              onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Role</label>
              <select
                value={userForm.role}
                onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="candidate">Candidate</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Phone (Optional)</label>
              <input
                type="tel"
                placeholder="+855 ..."
                value={userForm.phoneNumber}
                onChange={e => setUserForm(f => ({ ...f, phoneNumber: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Target Exam</label>
            <select
              value={userForm.targetExamId}
              onChange={e => setUserForm(f => ({ ...f, targetExamId: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
            >
              <option value="">No Target Exam</option>
              {exams.map(e => (
                <option key={e.examId} value={e.examId}>{e.examName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Knowledge Level</label>
              <select
                value={userForm.knowledgeLevel}
                onChange={e => setUserForm(f => ({ ...f, knowledgeLevel: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-normal text-slate-700 uppercase tracking-wider">Daily Goal (Mins)</label>
              <input
                type="number"
                min={5}
                max={300}
                value={userForm.dailyGoalMinutes}
                onChange={e => setUserForm(f => ({ ...f, dailyGoalMinutes: Number(e.target.value) }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black font-normal"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-normal transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={userSubmitStatus === 'saving-db'}
              className="px-6 py-2 bg-black hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-normal shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              {userSubmitStatus === 'saving-db' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <span>{editingUser ? 'Save Changes' : 'Create User'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
