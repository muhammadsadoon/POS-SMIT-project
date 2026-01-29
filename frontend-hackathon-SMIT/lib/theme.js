import { MantineThemeOverride } from '@mantine/core';

export const theme = {
  primaryColor: 'teal',
  primaryShade: 6,
  colorScheme: 'light',
  colors: {
    teal: [
      '#E6FBF5',
      '#C7F9EA',
      '#9FEFD0',
      '#66E1B3',
      '#2ED399',
      '#00C28A',
      '#00AF74',
      '#048F60',
      '#0B6E4C',
      '#0F4F38',
    ],
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  globalStyles: (theme) => ({
    body: {
      background: theme.colorScheme === 'light' ? '#F7FBFA' : theme.colors.dark[8],
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
  }),
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        padding: 'md',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
  fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  headings: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    fontWeight: 600,
  },
  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
};

export default theme;
