import type { Formatter } from '@/core/formatter/types.js';
import { MAX_FIRST_LINE_LENGTH } from '@/core/formatter/types.js';

const CONVENTIONAL_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
];

function inferTypeFromContent(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes('fix') || lower.includes('bug') || lower.includes('error')) return 'fix';
  if (lower.includes('feat') || lower.includes('add') || lower.includes('new')) return 'feat';
  if (lower.includes('doc') || lower.includes('readme')) return 'docs';
  if (lower.includes('refactor')) return 'refactor';
  if (lower.includes('test')) return 'test';
  if (lower.includes('style') || lower.includes('format')) return 'style';
  if (lower.includes('perf')) return 'perf';
  if (lower.includes('build') || lower.includes('ci')) return 'ci';
  return 'chore';
}

function truncateFirstLine(text: string, maxLen: number): string {
  const lines = text.split('\n');
  const first = lines[0];
  if (first.length <= maxLen) return text;
  lines[0] = first.slice(0, maxLen - 3) + '...';
  return lines.join('\n');
}

export class ConventionalFormatter implements Formatter {
  format(raw: string, _style: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return 'chore: update';

    const match = trimmed.match(/^(\w+)(\([^)]+\))?:\s*(.+)$/s);
    let type: string;
    let scope: string | undefined;
    let description: string;

    if (match) {
      type = match[1].toLowerCase();
      scope = match[2]?.replace(/^\(|\)$/g, '');
      description = match[3].trim();
    } else {
      type = inferTypeFromContent(trimmed);
      description = trimmed;
    }

    if (!CONVENTIONAL_TYPES.includes(type)) {
      type = inferTypeFromContent(description) || 'chore';
    }

    let result = scope ? `${type}(${scope}): ${description}` : `${type}: ${description}`;
    return truncateFirstLine(result, MAX_FIRST_LINE_LENGTH);
  }
}
