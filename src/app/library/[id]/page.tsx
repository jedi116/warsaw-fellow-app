'use client';

import { Box, Container } from '@mantine/core';
import BookDetail from '@/components/library/BookDetail';
import { useLoginRedirect } from '@/hooks/user';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('./loading'), { ssr: false });

export default function BookDetailPage({ params }: { params: { id: string } }) {
  useLoginRedirect();
  
  return (
    <Suspense fallback={<Loading />}>
      <Container size="xl">
        <Box>
          <BookDetail id={params.id} />
        </Box>
      </Container>
    </Suspense>
  );
}