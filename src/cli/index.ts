import { Command } from 'commander';
import { runGenerate } from '@/cli/commands/generate.js';

const program = new Command();

program
  .name('commitgen')
  .description('Auto-generate commit messages from staged changes')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate a commit message from staged changes')
  .option('-m, --model <type>', 'Model type: local or remote', 'local')
  .option('-s, --style <type>', 'Commit style: conventional or custom', 'conventional')
  .option('-c, --copy', 'Copy generated message to clipboard')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-d, --debug', 'Enable debug mode with key path tracing')
  .action(async (opts) => {
    await runGenerate({
      model: opts.model as 'local' | 'remote',
      style: opts.style as 'conventional' | 'custom',
      copy: opts.copy,
      verbose: opts.verbose,
      debug: opts.debug,
    });
  });

program.parse();
