'use client';

import { SegmentedControl, Group, Center, Box, ColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useColorScheme } from './MantineProvider';

export default function SegmentedToggle() {
  // Use the color scheme context from MantineProvider
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  // Handle the theme change - using the context's toggleColorScheme
  // which will handle cookie storage and DOM updates
  const handleChange = (value: string) => {
    toggleColorScheme(value as ColorScheme);
  };
  
  // We don't need this effect as we handle it in MantineProvider
  // to avoid duplicate DOM updates

  return (
    <Group>
      <SegmentedControl
        value={colorScheme}
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