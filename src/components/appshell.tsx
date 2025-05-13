'use client';

import React from 'react';
import { ModernHeader } from './header';
import { Footer } from './footer';
import { Box } from '@mantine/core';
import { css } from '@emotion/react';
import { NavigationProgress } from './ProgressBar';

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell(props: AppShellProps) {
  const { children } = props;
  // Use fixed dark colorScheme for now to avoid hydration issues
  const colorScheme = 'dark';
  
  const mainStyles = css`
    margin-top: 90px;
    min-height: calc(100vh - 90px);
    width: 100%;
    background-color: ${colorScheme === 'dark' ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)'};
    transition: background-color 0.3s ease;
  `;

  return (
    <>
      <NavigationProgress />
      <ModernHeader />
      <Box css={mainStyles}>
        {children}
      </Box>
      <Footer />
    </>
  );
}