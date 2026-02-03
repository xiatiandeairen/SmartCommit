import type { MessageGenerator } from '@/core/generator/types.js';
import type { CommitgenConfig } from '@/core/config/types.js';
import { LocalAdapter } from '@/core/generator/local-adapter.js';
import { RemoteAdapter } from '@/core/generator/remote-adapter.js';

export function createGenerator(config: CommitgenConfig): MessageGenerator {
  const model = config.model ?? 'local';
  if (model === 'remote') {
    return new RemoteAdapter(config.remote);
  }
  return new LocalAdapter();
}
