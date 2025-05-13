'use client';

import { Button, Container, Group, Text, Title, MantineProvider, createTheme } from '@mantine/core';
import { useEffect } from 'react';

// Create a simple theme for the error page
const theme = createTheme({
  primaryColor: 'indigo',
});

export default function GlobalError({
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
    <html>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Container style={{ textAlign: 'center', paddingTop: '80px' }}>
            <Title>Something went wrong!</Title>
            <Text size="lg" mb="xl" mt="md">
              A critical error occurred. Please try again later.
            </Text>
            <Group justify="center">
              <Button onClick={reset}>
                Try again
              </Button>
            </Group>
          </Container>
        </MantineProvider>
      </body>
    </html>
  );
}