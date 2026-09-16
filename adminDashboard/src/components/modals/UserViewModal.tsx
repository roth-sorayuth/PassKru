import React from 'react';
import { X, Mail, Phone, GraduationCap, Flame, Clock, Award, Shield, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
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
              <h2 className="text-base font-bold text-slate-900 leading-snug">
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
              <span className="text-[10px] font-normal text-slate-500 uppercase tracking-wider block">តួនាទី</span>
              <span className="text-xs font-semibold text-slate-900 capitalize mt-0.5 inline-block">
                {user.role === 'admin' ? 'អ្នកគ្រប់គ្រង (Admin)' : 'បេក្ខជន'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-normal text-slate-500 uppercase tracking-wider block">ការប្រឡងគោលដៅ</span>
              <span className="text-xs font-semibold text-slate-900 mt-0.5 inline-block truncate">
                {user.targetExam?.examName || user.targetSubject || 'គ្មាន'}
              </span>
            </div>
          </div>

          {/* User Record Grid (Attempts, Questions, Scores, Hours) */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-slate-900 block">កំណត់ត្រានិងស្ថិតិនៃការប្រើប្រាស់ (User Records)</span>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-medium text-slate-500 block">ធ្វើតេស្តសរុប</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {user._count?.attempts || 0} ដង
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-medium text-slate-500 block">សំណួរបានឆ្លើយ</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {user.completedQuestions || 0}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-medium text-slate-500 block">ពិន្ទុមធ្យម</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {user.averageScore ? `${Number(user.averageScore).toFixed(1)}%` : '0%'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-medium text-slate-500 block">ម៉ោងសិក្សាសរុប</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {user.studyHoursTotal ? `${Number(user.studyHoursTotal).toFixed(1)}h` : '0h'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-medium text-slate-500 block">រៀនជាប់ៗគ្នា</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {user.streakDays || 0} ថ្ងៃ
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[10px] font-medium text-slate-500 block">គោលដៅប្រចាំថ្ងៃ</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  {user.dailyGoalMinutes || 30}m
                </span>
              </div>
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
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-normal">
                កាលបរិច្ឆេទចុះឈ្មោះ៖ {new Date(user.createdAt).toLocaleDateString('km-KH', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
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
            className="text-xs font-normal text-slate-500 hover:text-black flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> លុបអ្នកប្រើប្រាស់
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-black border border-slate-300 hover:border-black rounded-xl text-xs font-normal transition cursor-pointer shadow-2xs"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
