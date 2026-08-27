import React from 'react';
import { VerificationStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, FileEdit, Send, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'SENT' | 'SCHEDULED' | 'ARCHIVED' | 'URGENT' | 'IMPORTANT' | 'NORMAL';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  switch (status) {
    case 'VERIFIED':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs ${sizeClasses}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          <span>ផ្ទៀងផ្ទាត់រួច</span>
        </span>
      );
    case 'PENDING':
    case 'PENDING_VERIFICATION':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xs animate-pulse ${sizeClasses}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          <span>រង់ចាំការផ្ទៀងផ្ទាត់</span>
        </span>
      );
    case 'OUTDATED':
    case 'ARCHIVED':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xs ${sizeClasses}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
          <span>ហួសសម័យ / ចាស់</span>
        </span>
      );
    case 'DRAFT':
      return (
        <span className={`inline-flex items-center rounded-full bg-white/5 text-[#8E929E] border border-white/10 shadow-xs ${sizeClasses}`}>
          {showIcon && <FileEdit className="w-3.5 h-3.5 text-[#8E929E] shrink-0" />}
          <span>សេចក្តីព្រាង (Draft)</span>
        </span>
      );
    case 'PUBLISHED':
      return (
        <span className={`inline-flex items-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xs ${sizeClasses}`}>
          {showIcon && <Send className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
          <span>បានបោះពុម្ពផ្សាយ</span>
        </span>
      );
    case 'REJECTED':
    case 'BLOCKED':
    case 'SUSPENDED':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-xs ${sizeClasses}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
          <span>{status === 'REJECTED' ? 'បដិសេធ' : status === 'SUSPENDED' ? 'ផ្អាកដំណើរការ' : 'ត្រូវបានបិទ'}</span>
        </span>
      );
    case 'ACTIVE':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-ping"></span>
          <span>សកម្ម (Active)</span>
        </span>
      );
    case 'URGENT':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold shadow-xs ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
          <span>បន្ទាន់ (Urgent)</span>
        </span>
      );
    case 'IMPORTANT':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-xs ${sizeClasses}`}>
          <span>សំខាន់</span>
        </span>
      );
    case 'NORMAL':
      return (
        <span className={`inline-flex items-center rounded-full bg-white/5 text-[#8E929E] border border-white/10 shadow-xs ${sizeClasses}`}>
          <span>ទូទៅ</span>
        </span>
      );
    case 'SENT':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>បានផ្ញើរួច</span>
        </span>
      );
    case 'SCHEDULED':
      return (
        <span className={`inline-flex items-center rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>បានកំណត់ពេល</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-white/5 text-[#8E929E] border border-white/10 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};
