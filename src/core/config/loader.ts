import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import type { CommitgenConfig } from '@/core/config/types.js';
import { DEFAULT_CONFIG } from '@/core/config/types.js';

function findProjectRoot(startDir: string): string | null {
  let current = startDir;
  const root = dirname(current);
  while (current !== root) {
    if (
      existsSync(join(current, '.commitgenrc.json')) ||
      existsSync(join(current, 'package.json'))
    ) {
      return current;
    }
    current = dirname(current);
  }
  if (existsSync(join(current, '.commitgenrc.json')) || existsSync(join(current, 'package.json'))) {
    return current;
  }
  return null;
}

function loadCommitgenrc(cwd: string): Partial<CommitgenConfig> | null {
  const rcPath = join(cwd, '.commitgenrc.json');
  if (!existsSync(rcPath)) return null;
  try {
    const content = readFileSync(rcPath, 'utf-8');
    return JSON.parse(content) as Partial<CommitgenConfig>;
  } catch {
    return null;
  }
}

function loadFromPackageJson(cwd: string): Partial<CommitgenConfig> | null {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) return null;
  try {
    const content = readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(content) as { commitgen?: Partial<CommitgenConfig> };
    return pkg.commitgen ?? null;
  } catch {
    return null;
  }
}

export function loadConfig(cwd = process.cwd()): CommitgenConfig {
  const projectRoot = findProjectRoot(cwd) ?? cwd;
  const rcConfig = loadCommitgenrc(projectRoot);
  const pkgConfig = loadFromPackageJson(projectRoot);

  const merged: CommitgenConfig = {
    ...DEFAULT_CONFIG,
    ...pkgConfig,
    ...rcConfig,
  };

  if (merged.remote && (rcConfig?.remote || pkgConfig?.remote)) {
    merged.remote = {
      ...merged.remote,
      ...pkgConfig?.remote,
      ...rcConfig?.remote,
    };
  }

  return merged;
}
