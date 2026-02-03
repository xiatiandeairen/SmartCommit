import type { OutputHandler } from '@/core/output/types.js';

export class ClipboardHandler implements OutputHandler {
  async output(message: string): Promise<void> {
    const { default: clipboard } = await import('clipboardy');
    await clipboard.write(message);
  }
}
