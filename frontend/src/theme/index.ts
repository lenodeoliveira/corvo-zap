export const theme = {
  colors: {
    background: '#121212',
    surface: '#1C1B22',
    surfaceLight: '#2B2520',

    primary: '#D4A65A',
    primaryDark: '#B88B42',
    secondary: '#EED8A8',

    text: {
      primary: '#F5F1E8',
      secondary: '#B6B2AA',
      disabled: '#7A746B',
    },

    border: '#3A322B',

    success: '#5FA777',
    warning: '#D4A65A',
    error: '#C95A5A',

    white: '#FFFFFF',
    black: '#000000',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },

  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semiBold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
      title: 'Cinzel-Bold',
    },

    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 28,
      xxl: 36,
    },

    lineHeight: {
      sm: 18,
      md: 22,
      lg: 28,
      xl: 36,
    },
  },

  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      elevation: 2,
    },

    md: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      elevation: 4,
    },
  },

  button: {
    height: 56,
  },

  input: {
    height: 56,
  },
} as const;

export type Theme = typeof theme;

export const Spacing = theme.spacing;