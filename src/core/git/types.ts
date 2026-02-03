export interface GitContext {
  stagedDiff: string;
  branch: string;
  files: string[];
}

export const MAX_DIFF_LENGTH = 4096;
