import { AnnouncementItem, DeadlineInfo, ParsedAnnouncementDetails } from '../types';

export function formatBytes(size?: string): string {
  if (!size) return 'Unknown size';
  if (size.endsWith('MB') || size.endsWith('KB') || size.endsWith('B')) return size;
  const bytes = Number(size);
  if (isNaN(bytes)) return size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getCategoryBadge(category?: string | null): { label: string; bg: string } {
  const label = category || 'General';
  return { label, bg: 'bg-slate-100 text-black border-slate-200' };
}

export function getDeadlineInfo(ann: AnnouncementItem): DeadlineInfo | null {
  let dateVal: string | null = null;
  let examDateVal: string | null = null;

  if (ann.attachments && typeof ann.attachments === 'object') {
    if (!Array.isArray(ann.attachments)) {
      if ((ann.attachments as any).deadlineDate) dateVal = (ann.attachments as any).deadlineDate;
      if ((ann.attachments as any).registration_deadline) dateVal = (ann.attachments as any).registration_deadline;
      if ((ann.attachments as any).examDate) examDateVal = (ann.attachments as any).examDate;
    } else if (Array.isArray(ann.attachments)) {
      const meta = ann.attachments.find((item: any) => item?.deadlineDate || item?.registration_deadline || item?.examDate || item?.type === 'meta');
      if (meta?.deadlineDate || meta?.registration_deadline) dateVal = meta.deadlineDate || meta.registration_deadline;
      if (meta?.examDate) examDateVal = meta.examDate;
    }
  }

  if (!dateVal && (ann.summary || ann.content)) {
    const text = `${ann.summary || ''} ${ann.content || ''}`;
    const isoMatch = text.match(/\b(202[4-9]-\d{2}-\d{2})\b/);
    if (isoMatch) {
      dateVal = isoMatch[1];
    }
  }

  if (!dateVal) return null;

  try {
    const deadline = new Date(dateVal);
    if (isNaN(deadline.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDay = new Date(deadline);
    deadlineDay.setHours(0, 0, 0, 0);
    const diffTime = deadlineDay.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formattedDate = deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (daysRemaining < 0) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'expired',
        label: 'Deadline Passed',
        badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
        examDate: examDateVal,
      };
    } else if (daysRemaining === 0) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'urgent',
        label: 'Ends Today',
        badgeBg: 'bg-slate-100 text-black border-slate-300',
        examDate: examDateVal,
      };
    } else if (daysRemaining <= 3) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'urgent',
        label: `${daysRemaining}d left`,
        badgeBg: 'bg-slate-100 text-black border-slate-300',
        examDate: examDateVal,
      };
    } else if (daysRemaining <= 7) {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'closing_soon',
        label: `${daysRemaining}d remaining`,
        badgeBg: 'bg-slate-100 text-black border-slate-200',
        examDate: examDateVal,
      };
    } else {
      return {
        dateStr: dateVal,
        formattedDate,
        daysRemaining,
        status: 'active',
        label: `${daysRemaining} days left`,
        badgeBg: 'bg-slate-100 text-black border-slate-200',
        examDate: examDateVal,
      };
    }
  } catch {
    return null;
  }
}

export function parseAnnouncementDetails(ann: AnnouncementItem): ParsedAnnouncementDetails {
  const attachments = ann.attachments || {};
  let totalSlots: string | null = null;
  let startingSalary: string | null = null;
  let deadlineDisplay: string | null = null;
  let deadlineDateStr: string | null = null;
  let quotas: Array<{ label: string; count: string }> = [];
  let sourceRef: string | null = null;
  let qrApplyUrl: string | null = null;
  let pdfUrl: string | null = null;
  let requirements: string | null = null;

  // 1. Structured attachments object
  if (typeof attachments === 'object' && !Array.isArray(attachments)) {
    const attObj = attachments as any;
    if (attObj.pdf_url) pdfUrl = attObj.pdf_url;
    if (!pdfUrl && attObj.pdfUrl) pdfUrl = attObj.pdfUrl;
    if (!pdfUrl && attObj.url && typeof attObj.url === 'string' && (attObj.url.endsWith('.pdf') || attObj.url.includes('/documents/'))) pdfUrl = attObj.url;
    if (!pdfUrl && attObj.documentUrl) pdfUrl = attObj.documentUrl;
    if (attObj.source_ref) sourceRef = attObj.source_ref;
    if (attObj.qr_apply_url) qrApplyUrl = attObj.qr_apply_url;
    if (attObj.registration_deadline) deadlineDateStr = attObj.registration_deadline;
    if (attObj.deadlineDate) deadlineDateStr = attObj.deadlineDate;
    if (attObj.total_slots || attObj.slots) totalSlots = String(attObj.total_slots || attObj.slots);
    if (attObj.starting_salary || attObj.salary) startingSalary = String(attObj.starting_salary || attObj.salary);
    if (attObj.requirements) requirements = String(attObj.requirements);
    if (Array.isArray(attObj.quotas)) quotas = attObj.quotas;
  } else if (Array.isArray(attachments)) {
    const fileAtt = attachments.find((item: any) => item?.pdfUrl || item?.url || item?.type === 'application/pdf');
    if (fileAtt) {
      pdfUrl = fileAtt.pdfUrl || fileAtt.url;
    }
    const meta = attachments.find((item: any) => item?.type === 'meta' || item?.registration_deadline || item?.qr_apply_url || item?.source_ref || item?.deadlineDate || item?.requirements);
    if (meta) {
      if (meta.source_ref) sourceRef = meta.source_ref;
      if (meta.qr_apply_url) qrApplyUrl = meta.qr_apply_url;
      if (meta.registration_deadline || meta.deadlineDate) deadlineDateStr = meta.registration_deadline || meta.deadlineDate;
      if (!totalSlots && (meta.total_slots || meta.slots)) totalSlots = String(meta.total_slots || meta.slots);
      if (!startingSalary && (meta.starting_salary || meta.salary)) startingSalary = String(meta.starting_salary || meta.salary);
      if (meta.requirements) requirements = String(meta.requirements);
      if (!pdfUrl && (meta.pdf_url || meta.pdfUrl)) pdfUrl = meta.pdf_url || meta.pdfUrl;
    }
  } else if (typeof attachments === 'string' && attachments.startsWith('http')) {
    pdfUrl = attachments;
  }

  // 2. Extract from summary / content if not yet found
  const fullText = `${ann.summary || ''} ${ann.content || ''}`;

  if (!totalSlots) {
    const slotsMatch = fullText.match(/(?:សរុប|ចំនួន|total\s*(?:slots)?)\s*[:\s]*([0-9,]+)\s*(?:កន្លែង|នាក់|slots|positions)/i) ||
                       fullText.match(/([0-9,]+)\s*(?:កន្លែង|positions)/i);
    if (slotsMatch) {
      totalSlots = slotsMatch[1];
    }
  }

  if (!startingSalary) {
    const salaryMatch = fullText.match(/(?:ប្រាក់ខែ(?:ចាប់ពី)?|ប្រាក់បំណាច់|salary)\s*[:\s]*([0-9,.]+\s*(?:លាន|M|រៀល|៛|\$|USD)?)/i);
    if (salaryMatch) {
      const raw = salaryMatch[1].trim();
      if (raw.includes('1,500,000') || raw.includes('1500000')) {
        startingSalary = '1.5M ៛';
      } else {
        startingSalary = raw.endsWith('រៀល') ? raw.replace('រៀល', '៛') : raw;
      }
    }
  }

  if (!deadlineDateStr) {
    const deadlineMatch = fullText.match(/(?:ដល់ថ្ងៃទី|ផុតកំណត់|ឈប់ទទួល|closes|deadline)\s*[:\s]*([0-9]{1,2}\s+(?:តុលា|វិច្ឆិកា|ធ្នូ|មករា|កុម្ភៈ|មីនា|មេសា|ឧសភា|មិថុនា|កក្កដា|សីហា|កញ្ញា|\w+)\s+[0-9]{4})/i) ||
                          fullText.match(/\b(202[4-9]-\d{2}-\d{2})\b/);
    if (deadlineMatch) {
      deadlineDateStr = deadlineMatch[1];
    }
  }

  if (deadlineDateStr) {
    try {
      const d = new Date(deadlineDateStr);
      if (!isNaN(d.getTime())) {
        deadlineDisplay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        deadlineDisplay = deadlineDateStr;
      }
    } catch {
      deadlineDisplay = deadlineDateStr;
    }
  }

  if (quotas.length === 0) {
    const provinceMap: Record<string, string> = {
      'ព្រៃវែង': 'Prey Veng',
      'ត្បូងឃ្មុំ': 'Tboung Khmum',
      'កំពង់ចាម': 'Kampong Cham',
      'បាត់ដំបង': 'Battambang',
      'កែវ': 'Kep',
      'កែប': 'Kep',
      'ភ្នំពេញ': 'Phnom Penh',
      'សៀមរាប': 'Siem Reap',
      'កណ្តាល': 'Kandal',
      'កណ្ដាល': 'Kandal',
      'កំពង់ធំ': 'Kampong Thom',
      'កំពង់ស្ពឺ': 'Kampong Speu',
      'កំពត': 'Kampot',
      'តាកែវ': 'Takeo',
      'ស្វាយរៀង': 'Svay Rieng',
    };

    const quotaSection = fullText.match(/(?:កូតាតាមខេត្ត|Quota by province)[៖:]\s*([^.]+)/i);
    if (quotaSection) {
      const parts = quotaSection[1].split(/[,،/]+/);
      for (const part of parts) {
        const itemMatch = part.match(/([\u1780-\u17FFa-zA-Z\s]+)[\s—:-]+([0-9,]+)/);
        if (itemMatch) {
          const rawName = itemMatch[1].trim();
          const count = itemMatch[2].trim();
          const cleanName = provinceMap[rawName] || rawName;
          quotas.push({ label: cleanName, count });
        }
      }
    }
  }

  if (!sourceRef) {
    const refMatch = fullText.match(/(?:លិខិតលេខ|Reference)\s*([0-9\/\w.\s]+(?:សអ\.ជខសក|\w+)?)/i);
    if (refMatch) {
      sourceRef = refMatch[1].trim();
    }
  }

  let formattedPublishDate = 'Recently';
  try {
    if (ann.publishDate) {
      const pDate = new Date(ann.publishDate);
      if (!isNaN(pDate.getTime())) {
        formattedPublishDate = `Published ${pDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    }
  } catch {
    formattedPublishDate = 'Recently';
  }

  return {
    totalSlots,
    startingSalary,
    deadlineDisplay,
    deadlineDateStr,
    quotas,
    sourceRef,
    qrApplyUrl,
    pdfUrl,
    requirements,
    formattedPublishDate,
  };
}
