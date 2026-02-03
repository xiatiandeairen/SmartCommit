import type { OutputHandler } from '@/core/output/types.js';
import clipboard from 'clipboardy';

export class ClipboardHandler implements OutputHandler {
  async output(message: string): Promise<void> {
    await clipboard.write(message);
  }
}
