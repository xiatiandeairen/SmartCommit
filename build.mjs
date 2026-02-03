import * as esbuild from 'esbuild';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'bin');

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

await esbuild.build({
  entryPoints: ['dist/cli/index.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: join(outDir, 'commitgen.cjs'),
  format: 'cjs',
  banner: { js: '#!/usr/bin/env node' },
  packages: 'external',
});

writeFileSync(
  join(outDir, 'commitgen'),
  '#!/bin/sh\ncd "$(dirname "$0")/.." && exec node bin/commitgen.cjs "$@"\n',
  { mode: 0o755 }
);
