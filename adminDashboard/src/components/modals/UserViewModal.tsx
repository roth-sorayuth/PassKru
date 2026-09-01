import React from 'react';
import { X, Mail, Phone, GraduationCap, Flame, Clock, Award, Shield, Trash2 } from 'lucide-react';
import { UserItem } from '../../types';

interface UserViewModalProps {
  user: UserItem | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export const UserViewModal: React.FC<UserViewModalProps> = ({ user, onClose, onDelete }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-black border border-slate-200 flex items-center justify-center font-normal text-sm shadow-2xs">
              {user.firstName?.[0] || 'U'}
            </div>
            <div>
              <h2 className="text-base font-normal text-black leading-snug">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-xs text-slate-500 font-normal">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-normal text-slate-500 uppercase tracking-wider block">Role</span>
              <span className="text-xs font-normal text-black capitalize mt-0.5 inline-block">
                {user.role}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-normal text-slate-500 uppercase tracking-wider block">Target Exam</span>
              <span className="text-xs font-normal text-black mt-0.5 inline-block truncate">
                {user.targetExam?.examName || user.targetSubject || 'None'}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {user.phoneNumber && (
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-normal">{user.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-normal">{user.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Flame className="w-4 h-4 text-slate-400" />
              <span className="font-normal">Study Streak: {user.streakDays || 0} days</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-normal">Daily Goal: {user.dailyGoalMinutes || 30} mins/day</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(user.userId);
              onClose();
            }}
            className="text-xs font-normal text-rose-600 hover:text-rose-800 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete User
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-normal transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
