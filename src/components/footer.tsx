'use client';

import { Box, Container, Group, Text, ThemeIcon, Anchor, Divider } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { css } from '@emotion/react';
import { useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';

export function Footer() {
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  const essentialLinks = [
    { label: 'Home', href: '/' },
    { label: 'Members', href: '/members' },
    { label: 'Attendance', href: '/attendance' },
    { label: 'Login', href: '/auth/login' },
  ];
  
  const footerStyles = css`
    background: transparent;
    border-top: 1px solid ${colorScheme === 'dark'
      ? 'rgba(92, 124, 250, 0.1)'
      : 'rgba(222, 226, 230, 0.5)'
    };
    padding: 16px 0;
  `;
  
  return (
    <Box css={footerStyles}>
      <Container size="xl">
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap={8}>
            <ThemeIcon 
              size={24} 
              radius="xl" 
              variant="light" 
              color="indigo"
            >
              <IconHeart size={14} style={{ strokeWidth: 1.5 }} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              © {new Date().getFullYear()} Warsaw Ethiopian Fellowship
            </Text>
          </Group>
          
          <Group gap={16}>
            {essentialLinks.map((link) => (
              <Anchor
                component={Link}
                href={link.href}
                key={link.label}
                underline="never"
                c={colorScheme === 'dark' ? 'dimmed' : 'dark.6'}
                size="xs"
                style={{ transition: 'color 0.2s ease' }}
              >
                {link.label}
              </Anchor>
            ))}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}