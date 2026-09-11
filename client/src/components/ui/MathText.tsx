import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { splitMath } from '../../utils/mathText';

interface MathTextProps {
  text: string | null | undefined;
  className?: string;
  /** Render as a block element (e.g. a question heading) instead of inline. */
  as?: 'span' | 'p' | 'h2' | 'h3' | 'div';
}

const cache = new Map<string, string | null>();

/** KaTeX HTML for one expression, or null when it can't be typeset. */
function render(latex: string): string | null {
  if (cache.has(latex)) return cache.get(latex)!;
  let html: string | null;
  try {
    html = katex.renderToString(latex, { throwOnError: true, strict: 'ignore', output: 'html' });
  } catch {
    html = null;
  }
  if (cache.size > 2000) cache.clear();
  cache.set(latex, html);
  return html;
}

/** Formulas in a text that KaTeX can't typeset (they would show as typed). */
export function findMathProblems(text: string | null | undefined): string[] {
  return splitMath(text || '')
    .filter((p): p is Extract<typeof p, { type: 'math' }> => p.type === 'math')
    .filter((p) => render(p.value) === null)
    .map((p) => p.source);
}

/**
 * Question-bank text with its math typeset. Anything KaTeX can't parse is
 * shown exactly as typed, so a bad formula never hides the question.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className, as = 'span' }) => {
  const parts = useMemo(() => splitMath(text || ''), [text]);
  const Tag = as;

  return (
    <Tag className={className}>
      {parts.map((part, i) => {
        if (part.type === 'text') return <React.Fragment key={i}>{part.value}</React.Fragment>;
        const html = render(part.value);
        return html ? (
          <span key={i} className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <React.Fragment key={i}>{part.source}</React.Fragment>
        );
      })}
    </Tag>
  );
};
