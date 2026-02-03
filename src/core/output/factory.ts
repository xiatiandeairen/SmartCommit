import type { OutputHandler } from '@/core/output/types.js';
import { StdoutHandler } from '@/core/output/stdout-handler.js';
import { ClipboardHandler } from '@/core/output/clipboard-handler.js';

export function createOutputHandlers(copy: boolean): OutputHandler[] {
  const handlers: OutputHandler[] = [new StdoutHandler()];
  if (copy) {
    handlers.push(new ClipboardHandler());
  }
  return handlers;
}
