import type { GitContext } from '@/core/git/types.js';

export interface MessageGenerator {
  generate(context: GitContext): Promise<string>;
}
