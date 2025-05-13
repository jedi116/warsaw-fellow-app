'use client';

import React from 'react';
import { Button, Container, Title, Text, Group } from '@mantine/core';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <Container style={{ textAlign: 'center', paddingTop: '80px' }}>
          <Title>Something went wrong!</Title>
          <Text size="lg" mb="xl" mt="md">
            Sorry, a critical error occurred. Please try again.
          </Text>
          <Group justify="center">
            <Button onClick={reset}>
              Try again
            </Button>
          </Group>
        </Container>
      </body>
    </html>
  );
}