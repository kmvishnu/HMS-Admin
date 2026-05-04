export const theme = {
  colors: {
    primary: {
      light: '#8b5cf6', // violet-500
      dark: '#a78bfa',  // violet-400
    },
    secondary: {
      light: '#06b6d4', // cyan-500
      dark: '#22d3ee',  // cyan-400
    },
    background: {
      light: '#f8fafc', // slate-50
      dark: '#0f172a',  // slate-900
    },
    card: {
      light: 'rgba(255, 255, 255, 0.7)',
      dark: 'rgba(30, 41, 59, 0.7)',
    },
    text: {
      light: '#334155', // slate-700
      dark: '#f8fafc',  // slate-50
    },
    textMuted: {
      light: '#64748b', // slate-500
      dark: '#94a3b8',  // slate-400
    },
    border: {
      light: 'rgba(203, 213, 225, 0.5)', // slate-300
      dark: 'rgba(51, 65, 85, 0.5)',     // slate-700
    }
  },
  gradients: {
    primary: {
      light: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      dark: 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)',
    },
    cardHover: {
      light: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
      dark: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(34, 211, 238, 0.15) 100%)',
    }
  },
  shadows: {
    soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    glow: '0 0 20px rgba(139, 92, 246, 0.3)',
    darkGlow: '0 0 20px rgba(167, 139, 250, 0.2)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  }
};

export const applyTheme = (mode: 'light' | 'dark') => {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-primary', theme.colors.primary[mode]);
  root.style.setProperty('--color-secondary', theme.colors.secondary[mode]);
  root.style.setProperty('--color-background', theme.colors.background[mode]);
  root.style.setProperty('--color-card', theme.colors.card[mode]);
  root.style.setProperty('--color-text', theme.colors.text[mode]);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted[mode]);
  root.style.setProperty('--color-border', theme.colors.border[mode]);

  // Gradients
  root.style.setProperty('--gradient-primary', theme.gradients.primary[mode]);
  root.style.setProperty('--gradient-card-hover', theme.gradients.cardHover[mode]);

  // Shadows
  root.style.setProperty('--shadow-soft', theme.shadows.soft);
  root.style.setProperty('--shadow-glow', mode === 'dark' ? theme.shadows.darkGlow : theme.shadows.glow);

  // Border Radius
  root.style.setProperty('--radius-sm', theme.borderRadius.sm);
  root.style.setProperty('--radius-md', theme.borderRadius.md);
  root.style.setProperty('--radius-lg', theme.borderRadius.lg);
  root.style.setProperty('--radius-xl', theme.borderRadius.xl);
  root.style.setProperty('--radius-2xl', theme.borderRadius['2xl']);

  // Spacing
  root.style.setProperty('--spacing-sm', theme.spacing.sm);
  root.style.setProperty('--spacing-md', theme.spacing.md);
  root.style.setProperty('--spacing-lg', theme.spacing.lg);
  root.style.setProperty('--spacing-xl', theme.spacing.xl);

  // Set color scheme for native elements
  root.style.setProperty('color-scheme', mode);
  
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};
