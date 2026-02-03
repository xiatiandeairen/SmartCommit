import { describe, it, expect } from 'vitest';
import { LocalAdapter } from '@/core/generator/local-adapter.js';
import type { GitContext } from '@/core/git/types.js';

describe('LocalAdapter', () => {
  const adapter = new LocalAdapter();

  it('generates feat for add keyword', async () => {
    const context: GitContext = {
      stagedDiff: '+ add new feature',
      branch: 'main',
      files: ['src/foo.ts'],
    };
    const result = await adapter.generate(context);
    expect(result).toMatch(/^feat/);
  });

  it('generates fix for bug keyword', async () => {
    const context: GitContext = {
      stagedDiff: '+ fix bug in parser',
      branch: 'main',
      files: [],
    };
    const result = await adapter.generate(context);
    expect(result).toMatch(/^fix/);
  });

  it('generates chore for generic content', async () => {
    const context: GitContext = {
      stagedDiff: '+ some changes',
      branch: 'main',
      files: ['config.json'],
    };
    const result = await adapter.generate(context);
    expect(result).toMatch(/^chore/);
  });

  it('includes scope when files in same dir', async () => {
    const context: GitContext = {
      stagedDiff: '',
      branch: 'main',
      files: ['core/utils.ts', 'core/helper.ts'],
    };
    const result = await adapter.generate(context);
    expect(result).toContain('(core)');
  });
});
