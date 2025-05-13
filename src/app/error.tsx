'use client';

import { Button, Container, Group, Text, Title } from '@mantine/core';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container style={{ textAlign: 'center', paddingTop: '80px' }}>
      <Title>Something went wrong!</Title>
      <Text size="lg" mb="xl" mt="md">
        An error occurred. You can try refreshing the page or contact support if the problem persists.
      </Text>
      <Group justify="center">
        <Button onClick={reset}>
          Try again
        </Button>
      </Group>
    </Container>
  );
}