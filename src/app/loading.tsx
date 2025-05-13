'use client';

import { Container, Center, Loader } from '@mantine/core';

export default function Loading() {
  return (
    <Container style={{ height: '100vh' }}>
      <Center style={{ height: '100%' }}>
        <Loader size="xl" />
      </Center>
    </Container>
  );
}