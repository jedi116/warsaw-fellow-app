'use client';

import { Box, Container, Group, Title, Button } from '@mantine/core';
import BookList from '@/components/library/BookList';
import { useLoginRedirect } from '@/hooks/user';
import { useProfile } from '@/hooks/profile';
import { useRouter } from 'next/navigation';
import { IconPlus } from '@tabler/icons-react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('./loading'), { ssr: false });

export default function LibraryPage() {
  useLoginRedirect();
  const { profile } = useProfile();
  const router = useRouter();
  
  return (
    <Suspense fallback={<Loading />}>
      <Container size="xl">
        <Group position="apart" mb="lg">
          <Title order={1}>Library</Title>
          {profile?.role === 'admin' && (
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => router.push('/library/add')}
            >
              Add Book
            </Button>
          )}
        </Group>
        <Box>
          <BookList />
        </Box>
      </Container>
    </Suspense>
  );
}