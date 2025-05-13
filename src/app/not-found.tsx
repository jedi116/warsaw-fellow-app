'use client';

import { Button, Container, Title, Text, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container style={{ textAlign: 'center', paddingTop: '80px' }}>
      <Title size="4rem">404</Title>
      <Text size="xl" mb="lg">Page not found</Text>
      <Text size="lg" mb="xl" c="dimmed">
        The page you are looking for doesn't exist or has been moved.
      </Text>
      <Group justify="center">
        <Button onClick={() => router.push('/')}>
          Back to home
        </Button>
      </Group>
    </Container>
  );
}