import React, { useState } from 'react';
import { ExamTargetLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Bell, 
  Send, 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Smartphone, 
  Check, 
  X,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface NotificationBroadcast {
  id: string;
  titleKhmer: string;
  bodyKhmer: string;
  targetAudience: string;
  sentAt: string;
  recipientsCount: number;
  openRatePercentage: number;
  channel: 'PUSH_AND_APP' | 'TELEGRAM_BOT' | 'ALL';
}

const INITIAL_BROADCASTS: NotificationBroadcast[] = [
  {
    id: 'nb-1',
    titleKhmer: 'រំលឹកកាលបរិច្ឆេទ៖ នៅសល់តែ ៥ ថ្ងៃទៀតប៉ុណ្ណោះសម្រាប់ការផុតកំណត់ពាក្យប្រឡង NIE',
    bodyKhmer: 'សូមបេក្ខជនទាំងអស់ប្រញាប់រៀបចំឯកសារសញ្ញាបត្រ និងលិខិតថ្កោលទោសឱ្យបានរួចរាល់។',
    targetAudience: 'បេក្ខជនប្រឡង NIE ទាំងអស់',
    sentAt: '2026-04-10 09:00',
    recipientsCount: 4200,
    openRatePercentage: 88,
    channel: 'ALL',
  },
  {
    id: 'nb-2',
    titleKhmer: 'វិញ្ញាសាប្រឡងសាកល្បងថ្នាក់ជាតិលើកទី ២ បានបើកដំណើរការហើយ!',
    bodyKhmer: 'ចូលរួមធ្វើតេស្តសាកល្បងសមត្ថភាពរយៈពេល ១២០ នាទីដើម្បីដឹងពីចំណុចខ្លាំង-ខ្សោយរបស់អ្នក។',
    targetAudience: 'បេក្ខជនទាំងអស់',
    sentAt: '2026-04-05 14:30',
    recipientsCount: 8900,
    openRatePercentage: 74,
    channel: 'PUSH_AND_APP',
  },
];

export const NotificationManagerView: React.FC<{ showEnglishLabels: boolean }> = ({ showEnglishLabels }) => {
  const [broadcasts, setBroadcasts] = useState<NotificationBroadcast[]>(INITIAL_BROADCASTS);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('ALL');
  const [channel, setChannel] = useState<'PUSH_AND_APP' | 'TELEGRAM_BOT' | 'ALL'>('ALL');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newBroadcast: NotificationBroadcast = {
      id: `nb-${Date.now()}`,
      titleKhmer: title,
      bodyKhmer: body,
      targetAudience: target === 'ALL' ? 'បេក្ខជនទាំងអស់' : target === 'NIE' ? 'បេក្ខជន NIE' : 'គ្រូបង្វឹកទាំងអស់',
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      recipientsCount: target === 'ALL' ? 12450 : 4200,
      openRatePercentage: 0,
      channel,
    };

    setBroadcasts([newBroadcast, ...broadcasts]);
    setTitle('');
    setBody('');
    setIsSuccessAlert(true);
    setTimeout(() => setIsSuccessAlert(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          <span>ការផ្ញើសារជូនដំណឹងទៅកាន់បេក្ខជន (Push & In-App Notifications)</span>
        </h2>
        <p className="text-xs text-[#8E929E] mt-1">
          ផ្ញើសារជូនដំណឹងបន្ទាន់ រំលឹកកាលបរិច្ឆេទប្រឡង ឬចែករំលែកវិញ្ញាសាថ្មីៗទៅកាន់បេក្ខជនទូទាំងប្រទេស
        </p>
      </div>

      {isSuccessAlert && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>សារជូនដំណឹងត្រូវបានផ្សព្វផ្សាយដោយជោគជ័យទៅកាន់បេក្ខជនទូទាំងប្រព័ន្ធ!</span>
        </div>
      )}

      {/* Grid: Send Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Composer */}
        <div className="lg:col-span-1 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            <span>បង្កើតសារជូនដំណឹងថ្មី</span>
          </h3>

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-[#8E929E] mb-1">ក្រុមគោលដៅទទួលសារ (Target Audience)</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-[#E0E0E0] focus:border-indigo-500/50"
              >
                <option value="ALL">បេក្ខជនប្រឡងទាំងអស់ (12,450+ នាក់)</option>
                <option value="NIE">បេក្ខជនប្រឡងគ្រូវិទ្យាល័យ NIE (4,200+ នាក់)</option>
                <option value="RTC">បេក្ខជនប្រឡងគ្រូអនុវិទ្យាល័យ RTC (3,800+ នាក់)</option>
                <option value="MENTORS">គ្រូបង្វឹក និងសាស្ត្រាចារ្យ (84 នាក់)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#8E929E] mb-1">បណ្តាញផ្សាយ</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-[#E0E0E0] focus:border-indigo-500/50"
              >
                <option value="ALL">Push Notification + កម្មវិធី + Telegram Bot</option>
                <option value="PUSH_AND_APP">App Push Notification តែមួយគត់</option>
                <option value="TELEGRAM_BOT">PassKru Telegram Channel តែមួយគត់</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#8E929E] mb-1">ចំណងជើងសារ *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ឧ. សល់ ៣ ថ្ងៃទៀតប្រឡងសាកល្បង..."
                className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none font-bold text-white placeholder-[#5A5E6B] focus:border-indigo-500/50"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8E929E] mb-1">ខ្លឹមសារសារ *</label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="សរសេរខ្លឹមសារលម្អិត..."
                className="w-full p-2.5 bg-[#0D0F12] border border-white/10 rounded-xl outline-none text-white placeholder-[#5A5E6B] focus:border-indigo-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>ផ្សាយដំណឹងភ្លាមៗ</span>
            </button>
          </form>
        </div>

        {/* Broadcast History */}
        <div className="lg:col-span-2 bg-[#111317] p-5 rounded-2xl border border-white/5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>ប្រវត្តិសារដែលបានផ្ញើរួច ({broadcasts.length})</span>
          </h3>

          <div className="space-y-3">
            {broadcasts.map((b) => (
              <div key={b.id} className="p-4 rounded-xl border border-white/5 bg-[#0D0F12] space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    {b.targetAudience}
                  </span>
                  <span className="text-[11px] text-[#5A5E6B]">{b.sentAt}</span>
                </div>

                <h4 className="text-sm font-bold text-white">{b.titleKhmer}</h4>
                <p className="text-xs text-[#8E929E]">{b.bodyKhmer}</p>

                <div className="flex items-center justify-between text-[11px] text-[#5A5E6B] pt-2 border-t border-white/5">
                  <span>អ្នកទទួល៖ <strong className="text-[#C5C8D1]">{(b.recipientsCount ?? 0).toLocaleString()} នាក់</strong></span>
                  {b.openRatePercentage > 0 && (
                    <span className="text-emerald-400 font-semibold">អត្រាបើកមើល៖ {b.openRatePercentage}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
