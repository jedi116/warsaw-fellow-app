'use client';

import React from 'react';
import {
  Container,
  Title,
  Skeleton,
  Group,
  Stack,
  Grid,
  Card,
  Box,
  Divider,
  Paper,
  Timeline
} from '@mantine/core';
import { IconHistory } from '@tabler/icons-react';

export default function AboutLoading() {
  // Create a few timeline items for the skeleton
  const timelineItems = Array(5).fill(null);

  return (
    <Container size="lg">
      {/* Hero Section */}
      <Box my={50}>
        <Title order={1} size={48} ta="center" mb="xl">About Our Fellowship</Title>
        
        <Grid gutter={40} align="center">
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
            <Skeleton height={30} width="60%" mb="md" />
            <Skeleton height={16} mb={8} />
            <Skeleton height={16} mb={8} />
            <Skeleton height={16} mb={8} />
            <Skeleton height={16} mb={25} />
            <Skeleton height={16} mb={8} />
            <Skeleton height={16} mb={8} />
            <Skeleton height={16} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
            <Skeleton height={350} radius="md" />
          </Grid.Col>
        </Grid>
      </Box>

      <Divider my={40} />

      {/* Our Mission & Values */}
      <Box my={80}>
        <Skeleton height={36} width={220} mx="auto" mb="xl" />
        
        <Paper p="xl" radius="md" withBorder mb="xl">
          <Group align="center" position="center" mb="md">
            <Skeleton height={40} width={40} radius="md" />
            <Skeleton height={24} width={200} />
          </Group>
          <Skeleton height={16} width="80%" mx="auto" mb={8} />
          <Skeleton height={16} width="70%" mx="auto" />
        </Paper>
        
        <Grid>
          {Array(4).fill(null).map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
              <Card withBorder p="xl" radius="md">
                <Group mb="md">
                  <Skeleton height={40} width={40} radius="md" />
                  <Skeleton height={24} width={120} />
                </Group>
                <Skeleton height={16} mb={8} />
                <Skeleton height={16} mb={8} />
                <Skeleton height={16} />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      <Divider my={40} />

      {/* Our History */}
      <Box my={80}>
        <Skeleton height={36} width={180} mx="auto" mb="xl" />
        
        <Timeline active={timelineItems.length - 1} bulletSize={24} lineWidth={2}>
          {timelineItems.map((_, index) => (
            <Timeline.Item 
              key={index} 
              bullet={<IconHistory size={12} />} 
              title={<Skeleton height={18} width={200} />}
            >
              <Skeleton height={14} width="60%" mt={8} />
            </Timeline.Item>
          ))}
        </Timeline>
      </Box>

      <Divider my={40} />

      {/* Leadership Team */}
      <Box my={80}>
        <Skeleton height={36} width={240} mx="auto" mb="xl" />
        
        <Grid>
          {Array(4).fill(null).map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
              <Card withBorder p="lg" radius="md">
                <Card.Section py="lg" style={{ textAlign: 'center' }}>
                  <Skeleton height={120} width={120} radius={120} mx="auto" />
                  <Skeleton height={24} width={180} mx="auto" mt="md" />
                  <Skeleton height={14} width={120} mx="auto" mt={8} mb="xs" />
                </Card.Section>
                
                <Skeleton height={16} mb={8} />
                <Skeleton height={16} />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      <Divider my={40} />

      {/* Location & Meetings */}
      <Box my={80} mb={50}>
        <Skeleton height={36} width={120} mx="auto" mb="xl" />
        
        <Grid gutter={40}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="md" h="100%">
              <Group mb="md">
                <Skeleton height={40} width={40} radius="md" />
                <Skeleton height={24} width={180} />
              </Group>
              <Stack spacing="md">
                {Array(3).fill(null).map((_, index) => (
                  <Group key={index} noWrap align="flex-start">
                    <Skeleton height={16} width={70} />
                    <Skeleton height={16} width="70%" />
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="lg" radius="md" h="100%">
              <Group mb="md">
                <Skeleton height={40} width={40} radius="md" />
                <Skeleton height={24} width={120} />
              </Group>
              <Skeleton height={16} width="80%" mb="md" />
              <Skeleton height={16} mb={8} />
              <Skeleton height={16} mb={8} />
              <Skeleton height={16} />
            </Card>
          </Grid.Col>
        </Grid>
      </Box>
    </Container>
  );
}