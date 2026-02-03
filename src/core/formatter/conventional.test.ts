import { describe, it, expect } from 'vitest';
import { ConventionalFormatter } from '@/core/formatter/conventional.js';

describe('ConventionalFormatter', () => {
  const formatter = new ConventionalFormatter();

  it('formats type: description', () => {
    expect(formatter.format('feat: add login', 'conventional')).toBe('feat: add login');
  });

  it('formats type(scope): description', () => {
    expect(formatter.format('fix(auth): resolve token expiry', 'conventional')).toBe(
      'fix(auth): resolve token expiry'
    );
  });

  it('infers type from content', () => {
    expect(formatter.format('add new user API', 'conventional')).toMatch(/^feat.*add new user API/);
  });

  it('truncates first line to 72 chars', () => {
    const long = 'a'.repeat(100);
    const result = formatter.format(`chore: ${long}`, 'conventional');
    expect(result.split('\n')[0].length).toBeLessThanOrEqual(72);
  });

  it('returns chore: update for empty input', () => {
    expect(formatter.format('', 'conventional')).toBe('chore: update');
    expect(formatter.format('   ', 'conventional')).toBe('chore: update');
  });
});
