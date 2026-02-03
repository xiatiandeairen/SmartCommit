export interface Formatter {
  format(raw: string, style: string): string;
}

export const MAX_FIRST_LINE_LENGTH = 72;
