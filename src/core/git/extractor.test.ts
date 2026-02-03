import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { getGitContext } from '@/core/git/extractor.js';

describe('getGitContext', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = join(process.cwd(), 'tmp', `commitgen-git-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    execSync('git init', { cwd: tmpDir });
    execSync('git config user.email "test@test.com"', { cwd: tmpDir });
    execSync('git config user.name "Test"', { cwd: tmpDir });
  });

  afterEach(() => {
    if (existsSync(tmpDir)) {
      rmSync(tmpDir, { recursive: true });
    }
  });

  it('throws when no staged changes', async () => {
    await expect(getGitContext(tmpDir)).rejects.toThrow('No staged changes');
  });

  it('returns context when file is staged', async () => {
    writeFileSync(join(tmpDir, 'foo.ts'), 'const x = 1;');
    execSync('git add foo.ts', { cwd: tmpDir });
    const context = await getGitContext(tmpDir);
    expect(context.files).toContain('foo.ts');
    expect(context.stagedDiff).toContain('const x = 1');
    expect(context.branch).toBeDefined();
  });
});
