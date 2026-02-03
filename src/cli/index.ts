import { Command } from 'commander';
import { runGenerate } from '@/cli/commands/generate.js';

const program = new Command();

program
  .name('commitgen')
  .description('Auto-generate Conventional Commit messages from staged Git changes')
  .version('0.1.0')
  .addHelpText(
    'after',
    `
Generate options:
  -m, --model <type>   local (template) or remote (API) (default: local)
  -s, --style <type>   conventional or custom (default: conventional)
  -c, --copy           copy to clipboard
  -v, --verbose        verbose logging
  -d, --debug          trace key path for debugging

Examples:
  commitgen generate              Generate message and print to stdout
  commitgen generate --copy       Generate and copy to clipboard
  commitgen generate --model remote  Use remote API
  commitgen generate --debug     Enable trace logging
`
  );

program
  .command('generate')
  .description('Generate a commit message from staged changes')
  .option('-m, --model <type>', 'local (template) or remote (API)', 'local')
  .option('-s, --style <type>', 'conventional or custom', 'conventional')
  .option('-c, --copy', 'copy to clipboard')
  .option('-v, --verbose', 'verbose logging')
  .option('-d, --debug', 'trace key path for debugging')
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
