'use client';

import { 
  Container, 
  Title, 
  Box, 
  Group, 
  Button, 
  Skeleton, 
  Grid, 
  Stack
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export default function AddBookLoading() {
  return (
    <Container size="lg">
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
        <Title order={1} mb="xl">Add New Book</Title>
        
        <Box>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack spacing="md">
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={150} radius="md" />
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack spacing="md">
                <Skeleton height={200} radius="md" mb="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Box pt="xl">
                  <Skeleton height={50} width={200} radius="md" />
                </Box>
              </Stack>
            </Grid.Col>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}