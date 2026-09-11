export function formatKhmerDate(dateInput) {
  if (!dateInput) return 'ថ្មីៗ';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    const khmerMonths = [
      'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
      'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
    ];
    const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    const toKhmerNum = (num) => String(num).split('').map(c => {
      const parsed = parseInt(c, 10);
      return isNaN(parsed) ? c : khmerNumerals[parsed];
    }).join('');

    const day = toKhmerNum(d.getDate());
    const month = khmerMonths[d.getMonth()];
    const year = toKhmerNum(d.getFullYear());

    return `ថ្ងៃទី ${day} ${month} ${year}`;
  } catch {
    return 'ថ្មីៗ';
  }
}
