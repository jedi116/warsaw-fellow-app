'use client';

import { MantineProvider, createTheme, ColorScheme } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');

  // Mount on client only
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return unthemed version on server
    return <>{children}</>;
  }

  return (
    <MantineProvider
      theme={{ colorScheme }}
      defaultColorScheme="dark"
    >
      {children}
    </MantineProvider>
  );
}