import { exec } from 'child_process';
import { promisify } from 'util';
import { extname } from 'path';
import type { GitContext } from '@/core/git/types.js';
import { MAX_DIFF_LENGTH } from '@/core/git/types.js';

const execAsync = promisify(exec);

function getFileType(filePath: string): string {
  const ext = extname(filePath);
  const typeMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.py': 'python',
    '.go': 'go',
    '.rs': 'rust',
    '.java': 'java',
    '.md': 'markdown',
    '.json': 'json',
    '.css': 'css',
    '.html': 'html',
  };
  return typeMap[ext] ?? 'unknown';
}

function sanitizeDiff(diff: string, maxLength: number): string {
  const trimmed = diff.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength) + '\n...(truncated)';
}

export async function getGitContext(cwd = process.cwd()): Promise<GitContext> {
  const opts = { cwd, encoding: 'utf-8' as const };

  const [diffResult, branchResult, filesResult] = await Promise.all([
    execAsync('git diff --cached', opts).catch((e) => ({ stdout: '', stderr: (e as Error).message })),
    execAsync('git rev-parse --abbrev-ref HEAD', opts).catch(() => ({ stdout: 'HEAD' })),
    execAsync('git diff --cached --name-only', opts).catch(() => ({ stdout: '' })),
  ]);

  const stagedDiff = sanitizeDiff(diffResult.stdout ?? '', MAX_DIFF_LENGTH);
  const branch = (branchResult.stdout ?? 'HEAD').trim();
  const files = (filesResult.stdout ?? '')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);

  if (!stagedDiff && files.length === 0) {
    throw new Error('No staged changes found. Please run `git add` first.');
  }

  return {
    stagedDiff,
    branch,
    files,
  };
}

export { getFileType };
