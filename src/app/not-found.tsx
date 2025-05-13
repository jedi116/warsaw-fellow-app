'use client';

import React, { Suspense } from 'react';
import { Button, Container, Title, Text, Group } from '@mantine/core';

// Router component must be client-side only
const HomeButton = () => {
  // Import useRouter dynamically to avoid Suspense issues
  const { useRouter } = require('next/navigation');
  const router = useRouter();
  
  return (
    <Button onClick={() => router.push('/')}>
      Back to home
    </Button>
  );
};

export default function NotFound() {
  return (
    <Container style={{ textAlign: 'center', paddingTop: '80px' }}>
      <Title size="4rem">404</Title>
      <Text size="xl" mb="lg">Page not found</Text>
      <Text size="lg" mb="xl" c="dimmed">
        The page you are looking for doesn&apos;t exist or has been moved.
      </Text>
      <Group justify="center">
        <Suspense fallback={<Button disabled>Loading...</Button>}>
          <HomeButton />
        </Suspense>
      </Group>
    </Container>
  );
}