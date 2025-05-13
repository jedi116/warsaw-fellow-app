'use client';

import { 
  MantineProvider as BaseMantineProvider, 
  createTheme, 
  ColorSchemeScript
} from '@mantine/core';
import { useEffect, useState } from 'react';

// Create the theme
const theme = createTheme({
  primaryColor: 'indigo',
  colors: {
    indigo: [
      '#EDF2FF', // 0
      '#DBE4FF', // 1
      '#BAC8FF', // 2
      '#91A7FF', // 3
      '#748FFC', // 4
      '#5C7CFA', // 5
      '#4C6EF5', // 6
      '#4263EB', // 7
      '#3B5BDB', // 8
      '#364FC7', // 9
    ],
    dark: [
      '#C1C2C5', // 0: text
      '#A6A7AB', // 1: dimmed text
      '#909296', // 2: more dimmed
      '#5C5F66', // 3: icons
      '#373A40', // 4: borders
      '#2C2E33', // 5: buttons/ui backgrounds
      '#25262B', // 6: input backgrounds
      '#1A1B1E', // 7: page background
      '#141517', // 8: darker elements
      '#101113', // 9: darkest elements
    ],
    gray: [
      '#F8F9FA', // 0
      '#F1F3F5', // 1
      '#E9ECEF', // 2
      '#DEE2E6', // 3
      '#CED4DA', // 4
      '#ADB5BD', // 5
      '#868E96', // 6
      '#495057', // 7
      '#343A40', // 8
      '#212529', // 9
    ],
  },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      }
    },
    Card: {
      defaultProps: {
        padding: 'lg',
        radius: 'md',
      },
    },
    Container: {
      defaultProps: {
        size: 'lg',
      },
    },
  },
  other: {
    transition: {
      default: 'all 200ms ease',
      slow: 'all 500ms ease',
    },
  },
});

// MantineProvider with client-side init to avoid hydration issues
export function MantineProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  // Mount on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <BaseMantineProvider
      theme={theme}
      defaultColorScheme="dark"
    >
      {children}
    </BaseMantineProvider>
  );
}

// Create a separate component for the color scheme script
export function MantineColorSchemeScript() {
  return <ColorSchemeScript defaultColorScheme="dark" />;
}