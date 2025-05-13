'use client';

import { useMantineColorScheme, SegmentedControl, Group, Center, Box } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export default function SegmentedToggle() {
  // Remove direct reference to useMantineColorScheme() which uses useSearchParams
  // Instead, use a fixed value for now
  
  // This hardcoded 'dark' value matches what we're using elsewhere to prevent hydration issues
  const [mode, setMode] = useState('dark');
  
  // Handle the theme change without using useSearchParams
  const handleChange = (value: 'light' | 'dark') => {
    setMode(value);
    // Apply the theme change directly to document attributes
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mantine-color-scheme', value);
    }
  };

  return (
    <Group>
      <SegmentedControl
        value={mode}
        onChange={handleChange}
        data={[
          {
            value: 'light',
            label: (
              <Center>
                <IconSun size="1rem" stroke={1.5} />
                <Box ml={10}>Light</Box>
              </Center>
            ),
          },
          {
            value: 'dark',
            label: (
              <Center>
                <IconMoon size="1rem" stroke={1.5} />
                <Box ml={10}>Dark</Box>
              </Center>
            ),
          },
        ]}
      />
    </Group>
  );
}