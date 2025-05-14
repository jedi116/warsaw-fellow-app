'use client';

import { useEffect } from 'react';
import { Box, Container, Title, Button, Group } from '@mantine/core';
import BorrowRequestList from '@/components/library/BorrowRequestList';
import { useLoginRedirect } from '@/hooks/user';
import { useProfile } from '@/hooks/profile';
import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('./loading'), { ssr: false });

export default function BorrowRequestsPage() {
  useLoginRedirect();
  const { profile } = useProfile();
  const router = useRouter();
  
  // Redirect non-admin users
  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.push('/library');
    }
  }, [profile, router]);
  
  return (
    <Suspense fallback={<Loading />}>
      <Container size="xl">
        <Group mb="lg">
          <Button 
            component={Link} 
            href="/library" 
            variant="subtle" 
            leftSection={<IconArrowLeft size={16} />}
          >
            Back to Library
          </Button>
        </Group>
        
        <Box>
          <Title order={1} mb="xl">Borrow Requests</Title>
          <BorrowRequestList />
        </Box>
      </Container>
    </Suspense>
  );
}