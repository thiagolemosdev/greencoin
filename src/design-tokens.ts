export const designTokens = {
  colors: {
    // Cores primárias (verde - idêntico ao FlashPay)
    primary: '#16a34a',
    primaryHover: '#15803d',
    secondary: '#15803d',
    accent: '#22c55e',

    // Backgrounds (light)
    background: '#F9FAFB',
    cardBackground: '#FFFFFF',
    sidebarBackground: '#ffffff',
    surfaceStrong: '#f3f4f6',

    // Backgrounds (dark) - valores exatos do FlashPay
    backgroundDark: '#0a0a0a',
    darkBg: '#0a0a0a',
    darkSurface: '#111111',
    darkCard: '#151515',
    darkElevated: '#1a1a1a',
    darkBorder: '#222222',

    // Texto
    text: '#111827',
    textLight: '#6B7280',
    textMuted: '#9CA3AF',
    textOnPrimary: '#FFFFFF',

    // Borders
    border: '#E5E7EB',
    borderDark: '#374151',

    // Status
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',

    // RGB (para rgba() com transparência)
    primaryRgb: '22, 163, 74',
    secondaryRgb: '21, 128, 61',
    accentRgb: '34, 197, 94',
    successRgb: '34, 197, 94',
    errorRgb: '239, 68, 68',
    warningRgb: '245, 158, 11',
    infoRgb: '59, 130, 246',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 14px rgba(22, 163, 74, 0.15)',
    lg: '0 12px 24px rgba(22, 163, 74, 0.12)',
    xl: '0 20px 40px rgba(22, 163, 74, 0.15)',
    neon: '0 0 20px rgba(22, 163, 74, 0.3), 0 0 40px rgba(22, 163, 74, 0.2)',
  },
  animation: {
    durationFast: '150ms',
    durationBase: '200ms',
    durationslow: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingLanding: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
