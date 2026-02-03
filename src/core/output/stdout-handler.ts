import type { OutputHandler } from '@/core/output/types.js';

export class StdoutHandler implements OutputHandler {
  output(message: string): void {
    console.log(message);
  }
}
