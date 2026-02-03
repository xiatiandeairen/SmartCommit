import type { MessageGenerator } from '@/core/generator/types.js';
import type { GitContext } from '@/core/git/types.js';
import { extname } from 'path';

const KEYWORD_MAP: Record<string, string> = {
  feat: 'feat',
  add: 'feat',
  new: 'feat',
  fix: 'fix',
  bug: 'fix',
  error: 'fix',
  doc: 'docs',
  readme: 'docs',
  refactor: 'refactor',
  test: 'test',
  style: 'style',
  format: 'style',
  perf: 'perf',
  build: 'build',
  ci: 'ci',
  chore: 'chore',
};

function inferType(context: GitContext): string {
  const combined = `${context.stagedDiff} ${context.files.join(' ')}`.toLowerCase();
  for (const [keyword, type] of Object.entries(KEYWORD_MAP)) {
    if (combined.includes(keyword)) return type;
  }
  return 'chore';
}

function inferScope(context: GitContext): string | undefined {
  if (context.files.length === 0) return undefined;
  const dirs = new Map<string, number>();
  for (const f of context.files) {
    const parts = f.split('/');
    if (parts.length > 1) {
      const d = parts[0];
      dirs.set(d, (dirs.get(d) ?? 0) + 1);
    }
  }
  const sorted = [...dirs.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0];
}

function inferDescription(context: GitContext): string {
  const diff = context.stagedDiff;
  const added = diff.match(/^\+[^+].*$/gm) ?? [];
  const firstMeaningful = added
    .map((l) => l.replace(/^\+\s*/, '').trim())
    .find((l) => l.length > 3 && !l.startsWith('//') && !l.startsWith('*'));
  if (firstMeaningful) {
    const cleaned = firstMeaningful.slice(0, 50).replace(/\s+/g, ' ');
    return cleaned.length < firstMeaningful.length ? cleaned + '...' : cleaned;
  }
  const ext = context.files[0] ? extname(context.files[0]).slice(1) : 'files';
  return `update ${ext}`;
}

export class LocalAdapter implements MessageGenerator {
  async generate(context: GitContext): Promise<string> {
    const type = inferType(context);
    const scope = inferScope(context);
    const description = inferDescription(context);
    const scopePart = scope ? `(${scope})` : '';
    return `${type}${scopePart}: ${description}`;
  }
}
