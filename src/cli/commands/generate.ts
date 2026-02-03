import { loadConfig } from '@/core/config/loader.js';
import { createGenerator } from '@/core/generator/factory.js';
import { getFormatter } from '@/core/formatter/factory.js';
import { createOutputHandlers } from '@/core/output/factory.js';
import { getGitContext } from '@/core/git/extractor.js';
import { getLogger } from '@/utils/logger.js';
import type { CommitgenConfig } from '@/core/config/types.js';

export interface GenerateOptions {
  model?: 'local' | 'remote';
  style?: 'conventional' | 'custom';
  copy?: boolean;
  verbose?: boolean;
  debug?: boolean;
}

export async function runGenerate(options: GenerateOptions): Promise<void> {
  const logger = getLogger({
    verbose: options.verbose ?? false,
    debug: options.debug ?? false,
  });

  try {
    const config = loadConfig();
    const merged: CommitgenConfig = {
      ...config,
      model: options.model ?? config.model,
      style: options.style ?? config.style,
      verbose: options.verbose ?? config.verbose,
    };

    logger.trace('config', { merged });
    logger.debug('Config loaded', merged);

    const generator = createGenerator(merged);
    const formatter = getFormatter(merged.style ?? 'conventional');
    const handlers = createOutputHandlers(options.copy ?? false);

    logger.debug('Fetching git context...');
    const context = await getGitContext();
    logger.trace('git_context', {
      branch: context.branch,
      fileCount: context.files.length,
      files: context.files,
      diffLength: context.stagedDiff.length,
    });

    logger.debug('Generating message...');
    const raw = await generator.generate(context);
    logger.trace('generator_raw', { raw });

    const message = formatter.format(raw, merged.style ?? 'conventional');
    logger.trace('formatter_output', { message });

    for (const handler of handlers) {
      await handler.output(message);
    }
    logger.trace('output', { copy: options.copy ?? false });

    if (options.copy) {
      logger.info('Copied to clipboard');
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    logger.error(msg);
    process.exit(1);
  }
}
