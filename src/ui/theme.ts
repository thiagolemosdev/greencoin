import { designTokens } from '@/design-tokens';

export const theme = designTokens;

export type Theme = typeof theme;

export function getThemeColor(path: string): string | undefined {
  return path.split('.').reduce((acc: any, key) => acc?.[key], theme);
}
