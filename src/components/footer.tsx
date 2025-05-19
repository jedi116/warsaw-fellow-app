'use client';

import { Box, Container, Group, Text, Anchor, Divider } from '@mantine/core';
import { css } from '@emotion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useColorScheme } from '@/components/MantineProvider';

export function Footer() {
  // Use color scheme from context
  const { colorScheme } = useColorScheme();
  
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
    width: 100%;
    height: 53px; /* Fixed height for the footer */
    margin-top: auto; /* Push to the bottom if content doesn't fill page */
  `;
  
  return (
    <Box css={footerStyles}>
      <Container size="xl">
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap={8}>
            <Box style={{ width: 24, height: 24, position: 'relative', overflow: 'hidden', borderRadius: '50%' }}>
              <Image
                src="/warsaw_fellow_logo2.png"
                alt="Warsaw Ethiopian Fellowship"
                fill
                sizes="24px"
                style={{ objectFit: 'cover' }}
              />
            </Box>
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