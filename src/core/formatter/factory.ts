import type { Formatter } from '@/core/formatter/types.js';
import { ConventionalFormatter } from '@/core/formatter/conventional.js';

const formatters: Record<string, Formatter> = {
  conventional: new ConventionalFormatter(),
};

export function getFormatter(style: string): Formatter {
  const formatter = formatters[style];
  if (formatter) return formatter;
  return formatters.conventional;
}
