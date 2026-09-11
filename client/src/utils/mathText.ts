/**
 * Also copied to adminDashboard/src/utils/mathText.ts for the question editor preview —
 * change both together.
 *
 * Finds math inside question-bank text so it can be typeset with KaTeX.
 *
 * The bank has no $…$ delimiters. Admins typed math two ways, often inside
 * Khmer sentences:
 *   LaTeX commands  — "\frac{\sin 3x - \sin x}{\sin 3x + \sin x}", "Z^{2}"
 *   plain keyboard  — "x^2", "lim_{x->3+}", "10^-7", "sqrt(2)", "Fe^3+(aq)"
 * Math can only be made of Latin letters, digits, operators and a few symbols,
 * so any other script (Khmer, punctuation like ។) ends a run. A run is typeset
 * only when it carries a real math signal (a command, ^, _{…}, ∫, √ …); plain
 * runs such as "1/2" or English sentences stay as text.
 */

export type MathSegment = { type: 'text'; value: string } | { type: 'math'; value: string; source: string };

const FUNCTIONS = ['arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'ln', 'log', 'exp', 'lim', 'max', 'min', 'det'];

// Characters that can belong to a math run.
const MATH_CHAR = /[A-Za-z0-9\\{}^_()[\]+\-*/=<>.,:;|!'′\s·×÷±∞∫∑∏√πθαβγδελμσφωΔΩ≤≥≠≈→←↔²³¹⁰⁴⁵⁶⁷⁸⁹⁺⁻°%&]/;

// Something that only math would contain.
const SIGNAL = /\\[A-Za-z]+|[A-Za-z]_bar\b|[A-Za-z0-9)}\]]\s*\^\s*[{(+\-]?[A-Za-z0-9]|[A-Za-z0-9)}]_\{|[A-Za-z]_[A-Za-z0-9]|[∫∑∏√∞≤≥≠≈→²³⁻⁺]|\bsqrt\s*\(|->/;

const SUPERSCRIPTS: Record<string, string> = { '²': '2', '³': '3', '¹': '1', '⁰': '0', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-' };

const SYMBOLS: [RegExp, string][] = [
  [/->/g, ' \\to '],
  [/∫/g, '\\int '],
  [/∑/g, '\\sum '],
  [/∏/g, '\\prod '],
  [/∞/g, '\\infty '],
  [/≤/g, '\\le '],
  [/≥/g, '\\ge '],
  [/≠/g, '\\ne '],
  [/≈/g, '\\approx '],
  [/→/g, '\\to '],
  [/←/g, '\\leftarrow '],
  [/↔/g, '\\leftrightarrow '],
  [/×/g, '\\times '],
  [/÷/g, '\\div '],
  [/±/g, '\\pm '],
  [/·/g, '\\cdot '],
  [/°/g, '^{\\circ}'],
  [/π/g, '\\pi '],
  [/θ/g, '\\theta '],
  [/α/g, '\\alpha '],
  [/β/g, '\\beta '],
  [/γ/g, '\\gamma '],
  [/δ/g, '\\delta '],
  [/ε/g, '\\varepsilon '],
  [/λ/g, '\\lambda '],
  [/μ/g, '\\mu '],
  [/σ/g, '\\sigma '],
  [/φ/g, '\\varphi '],
  [/ω/g, '\\omega '],
  [/Δ/g, '\\Delta '],
  [/Ω/g, '\\Omega '],
  [/′/g, "'"],
];

// Two-letter words that are units or differentials rather than a product of variables.
const UPRIGHT_SHORT = new Set(['dx', 'dy', 'dz', 'dt', 'du', 'dv', 'kg', 'cm', 'mm', 'km', 'ml', 'mL', 'aq', 'Pa', 'Hz', 'eV', 'kJ', 'kW', 'mA', 'mV', 'ms']);

/** Replaces a marker followed by a balanced (…) group with marker{…}, e.g. √(x+1) → \sqrt{x+1}, 2^(n+1) → 2^{n+1}. */
function wrapGroup(src: string, marker: string, command: string): string {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const at = src.indexOf(marker, i);
    if (at < 0) break;
    let k = at + marker.length;
    while (src[k] === ' ') k++;
    if (src[k] !== '(') {
      out += src.slice(i, at + marker.length);
      i = at + marker.length;
      continue;
    }
    let depth = 1;
    let j = k + 1;
    while (j < src.length && depth) {
      if (src[j] === '(') depth++;
      else if (src[j] === ')') depth--;
      j++;
    }
    if (depth) break;
    out += src.slice(i, at) + `${command}{${src.slice(k + 1, j - 1)}}`;
    i = j;
  }
  return out + src.slice(i);
}

/** Replaces f(…) with \name{…} for a balanced parenthesis group, e.g. sqrt(x+1) → \sqrt{x+1}. */
function wrapCall(src: string, word: string, command: string): string {
  let out = '';
  let i = 0;
  const re = new RegExp(`(?<![\\\\A-Za-z])${word}\\s*\\(`, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    let depth = 1;
    let j = m.index + m[0].length;
    while (j < src.length && depth) {
      if (src[j] === '(') depth++;
      else if (src[j] === ')') depth--;
      j++;
    }
    if (depth) break;
    out += src.slice(i, m.index) + `${command}{${src.slice(m.index + m[0].length, j - 1)}}`;
    i = j;
    re.lastIndex = j;
  }
  return out + src.slice(i);
}

/** Turns one detected run into KaTeX input. */
export function toLatex(run: string): string {
  let s = run;
  // Conjugates typed as Z_bar / z_bar → \bar{Z}.
  s = s.replace(/(?<![\\A-Za-z])([A-Za-z])_bar(?![A-Za-z])/g, '\\bar{$1}');
  s = s.replace(/[²³¹⁰⁴-⁹⁺⁻]+/g, (m) => `^{${[...m].map((c) => SUPERSCRIPTS[c]).join('')}}`);
  for (const [re, rep] of SYMBOLS) s = s.replace(re, rep);
  s = s.replace(/(?<![\\A-Za-z])(?:\+|-)?infinity\b/gi, (m) => (m.startsWith('-') ? '-\\infty' : m.startsWith('+') ? '+\\infty' : '\\infty'));
  s = wrapCall(s, 'sqrt', '\\sqrt');
  s = wrapGroup(s, '√', '\\sqrt');
  s = s.replace(/√\s*(\d+(?:\.\d+)?|[A-Za-z])/g, '\\sqrt{$1}');
  // Parenthesised exponents/subscripts: 2^(n+1) → 2^{n+1}.
  s = wrapGroup(s, '^', '^');
  s = wrapGroup(s, '_', '_');
  // Ion charges: Fe^3+(aq), SO4^2- (a sign right after the digits, then a bracket, space or the end).
  s = s.replace(/\^(\d*[+-])(?=[(\s]|$)/g, (_, e) => `^{${e}}`);
  // Exponents typed without braces: 10^-7, x^2, e^x.
  s = s.replace(/\^\s*([+-]?\d+(?:\.\d+)?|[+-]?[A-Za-z])(?![A-Za-z0-9{])/g, (_, e) => `^{${e}}`);
  // Keep % & # literal (KaTeX treats % as a comment).
  s = s.replace(/(?<!\\)([%&#])/g, '\\$1');
  // Letter words: known functions become operators; words, units and element
  // symbols stay upright; two-letter products like "ax" stay italic variables.
  s = s.replace(/(?<![\\A-Za-z])([A-Za-z]{2,})(?![A-Za-z])/g, (word) => {
    if (FUNCTIONS.includes(word)) return `\\${word} `;
    if (word === 'pi') return '\\pi ';
    if (word.length >= 3 || UPRIGHT_SHORT.has(word) || /^[A-Z][a-z]$/.test(word)) return `\\mathrm{${word}}`;
    return word;
  });
  s = s.replace(/\*/g, '\\cdot ');
  return s.trim();
}

const balanced = (s: string) => {
  let depth = 0;
  for (const ch of s) {
    if (ch === '{') depth++;
    else if (ch === '}' && --depth < 0) return false;
  }
  return depth === 0;
};

/** Splits text into plain and math segments. Existing $…$, \(…\) and \[…\] are honoured. */
export function splitMath(text: string): MathSegment[] {
  if (!text) return [];
  const segments: MathSegment[] = [];
  const pushText = (value: string) => {
    if (!value) return;
    const last = segments[segments.length - 1];
    if (last?.type === 'text') last.value += value;
    else segments.push({ type: 'text', value });
  };

  // Explicit delimiters first.
  // A single $ must hug its content and not be followed by a digit, so "$5 and $10" stays text.
  const delimited = /\$\$([\s\S]+?)\$\$|\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
  let cursor = 0;
  let m: RegExpExecArray | null;
  const pieces: { text: string; math?: string }[] = [];
  while ((m = delimited.exec(text))) {
    if (m.index > cursor) pieces.push({ text: text.slice(cursor, m.index) });
    pieces.push({ text: m[0], math: m[1] ?? m[2] ?? m[3] ?? m[4] });
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) pieces.push({ text: text.slice(cursor) });

  for (const piece of pieces) {
    if (piece.math != null) {
      // Delimited math is written as LaTeX on purpose: pass it through untouched.
      segments.push({ type: 'math', value: piece.math.trim(), source: piece.text });
      continue;
    }
    // Undelimited: scan runs of math-capable characters.
    const src = piece.text;
    let i = 0;
    while (i < src.length) {
      if (!MATH_CHAR.test(src[i])) {
        pushText(src[i]);
        i++;
        continue;
      }
      let j = i;
      while (j < src.length && MATH_CHAR.test(src[j])) j++;
      const run = src.slice(i, j);
      // Leading/trailing spaces and sentence punctuation stay text.
      const lead = run.match(/^[\s.,:;!]*/)![0];
      const trail = run.slice(lead.length).match(/[\s.,:;!?]*$/)![0];
      const core = run.slice(lead.length, run.length - trail.length);
      const isBlank = /_{2,}/.test(core);
      if (core && SIGNAL.test(core) && !isBlank && balanced(core) && !looksLikeProse(core)) {
        pushText(lead);
        segments.push({ type: 'math', value: toLatex(core), source: core });
        pushText(trail);
      } else {
        pushText(run);
      }
      i = j;
    }
  }
  return segments;
}

/** English sentences in the language bank can contain ^ or _; three or more real words means prose. */
function looksLikeProse(core: string): boolean {
  if (/\\[A-Za-z]+/.test(core)) return false;
  const words: string[] = core.match(/[A-Za-z]{3,}/g) || [];
  const prose = words.filter((w) => !FUNCTIONS.includes(w.toLowerCase()) && !/^(sqrt|infinity|pi)$/i.test(w));
  return prose.length >= 3;
}
