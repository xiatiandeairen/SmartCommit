import type { MessageGenerator } from '@/core/generator/types.js';
import type { GitContext } from '@/core/git/types.js';
import type { CommitgenConfig } from '@/core/config/types.js';

export interface RemoteAdapterOptions {
  baseUrl?: string;
  apiKey?: string;
}

export class RemoteAdapter implements MessageGenerator {
  private options: RemoteAdapterOptions;

  constructor(config?: CommitgenConfig['remote']) {
    this.options = {
      baseUrl: config?.baseUrl ?? process.env.COMMITGEN_API_URL,
      apiKey: config?.apiKey ?? process.env.COMMITGEN_API_KEY,
    };
  }

  async generate(context: GitContext): Promise<string> {
    if (!this.options.baseUrl) {
      return `chore: update (remote API not configured, set COMMITGEN_API_URL)`;
    }

    try {
      const response = await fetch(`${this.options.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.options.apiKey && { Authorization: `Bearer ${this.options.apiKey}` }),
        },
        body: JSON.stringify({
          stagedDiff: context.stagedDiff,
          branch: context.branch,
          files: context.files,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = (await response.json()) as { message?: string };
      return data.message ?? 'chore: update';
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      return `chore: update (remote failed: ${msg})`;
    }
  }
}
