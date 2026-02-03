import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { loadConfig } from '@/core/config/loader.js';

describe('loadConfig', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = join(tmpdir(), `commitgen-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(tmpDir)) {
      rmSync(tmpDir, { recursive: true });
    }
  });

  it('returns defaults when no config', () => {
    const config = loadConfig(tmpDir);
    expect(config.model).toBe('local');
    expect(config.style).toBe('conventional');
    expect(config.output).toBe('stdout');
  });

  it('loads from .commitgenrc.json', () => {
    writeFileSync(
      join(tmpDir, '.commitgenrc.json'),
      JSON.stringify({ model: 'remote', style: 'custom' })
    );
    const config = loadConfig(tmpDir);
    expect(config.model).toBe('remote');
    expect(config.style).toBe('custom');
  });

  it('loads from package.json commitgen', () => {
    writeFileSync(
      join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'test', commitgen: { model: 'remote' } })
    );
    const config = loadConfig(tmpDir);
    expect(config.model).toBe('remote');
  });

  it('rc overrides package.json', () => {
    writeFileSync(
      join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'test', commitgen: { model: 'local' } })
    );
    writeFileSync(
      join(tmpDir, '.commitgenrc.json'),
      JSON.stringify({ model: 'remote' })
    );
    const config = loadConfig(tmpDir);
    expect(config.model).toBe('remote');
  });
});
